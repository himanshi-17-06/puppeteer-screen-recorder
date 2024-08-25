"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("events");
const os_1 = __importDefault(require("os"));
const path_1 = require("path");
const stream_1 = require("stream");
const fluent_ffmpeg_1 = __importStar(require("fluent-ffmpeg"));
const pageVideoStreamTypes_1 = require("./pageVideoStreamTypes");
/**
 * @ignore
 */
const SUPPORTED_FILE_FORMATS = [
    pageVideoStreamTypes_1.SupportedFileFormats.MP4,
    pageVideoStreamTypes_1.SupportedFileFormats.AVI,
    pageVideoStreamTypes_1.SupportedFileFormats.MOV,
    pageVideoStreamTypes_1.SupportedFileFormats.WEBM,
];
/**
 * @ignore
 */
class PageVideoStreamWriter extends events_1.EventEmitter {
    constructor(destinationSource, options) {
        super();
        this.screenLimit = 10;
        this.screenCastFrames = [];
        this.duration = '00:00:00:00';
        this.frameGain = 0;
        this.frameLoss = 0;
        this.status = pageVideoStreamTypes_1.VIDEO_WRITE_STATUS.NOT_STARTED;
        this.videoMediatorStream = new stream_1.PassThrough();
        this.ffmpegProcess = null;
        if (options) {
            this.options = options;
        }
        const isWritable = this.isWritableStream(destinationSource);
        this.configureFFmPegPath();
        if (isWritable) {
            this.configureVideoWritableStream(destinationSource);
        }
        else {
            this.configureVideoFile(destinationSource);
        }
    }
    get videoFrameSize() {
        const { width, height } = this.options.videoFrame;
        return width !== null && height !== null ? `${width}x${height}` : '100%';
    }
    get autopad() {
        const autopad = this.options.autopad;
        return !autopad
            ? { activation: false }
            : { activation: true, color: autopad.color };
    }
    getFfmpegPath() {
        if (this.options.ffmpeg_Path) {
            return this.options.ffmpeg_Path;
        }
        try {
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            const ffmpeg = require('@ffmpeg-installer/ffmpeg');
            if (ffmpeg.path) {
                return ffmpeg.path;
            }
            return null;
        }
        catch (e) {
            return null;
        }
    }
    getDestinationPathExtension(destinationFile) {
        const fileExtension = (0, path_1.extname)(destinationFile);
        return fileExtension.includes('.')
            ? fileExtension.replace('.', '')
            : fileExtension;
    }
    configureFFmPegPath() {
        const ffmpegPath = this.getFfmpegPath();
        if (!ffmpegPath) {
            throw new Error('FFmpeg path is missing, \n Set the FFMPEG_PATH env variable');
        }
        (0, fluent_ffmpeg_1.setFfmpegPath)(ffmpegPath);
    }
    isWritableStream(destinationSource) {
        if (destinationSource && typeof destinationSource !== 'string') {
            if (!(destinationSource instanceof stream_1.Writable) ||
                !('writable' in destinationSource) ||
                !destinationSource.writable) {
                throw new Error('Output should be a writable stream');
            }
            return true;
        }
        return false;
    }
    configureVideoFile(destinationPath) {
        const fileExt = this.getDestinationPathExtension(destinationPath);
        if (!SUPPORTED_FILE_FORMATS.includes(fileExt)) {
            throw new Error('File format is not supported');
        }
        this.writerPromise = new Promise((resolve) => {
            const outputStream = this.getDestinationStream();
            outputStream
                .on('error', (e) => {
                this.handleWriteStreamError(e.message);
                resolve(false);
            })
                .on('stderr', (e) => {
                this.handleWriteStreamError(e);
                resolve(false);
            })
                .on('end', () => resolve(true))
                .save(destinationPath);
            if (fileExt == pageVideoStreamTypes_1.SupportedFileFormats.WEBM) {
                outputStream
                    .videoCodec('libvpx')
                    .videoBitrate(this.options.videoBitrate || 1000, true)
                    .outputOptions('-flags', '+global_header', '-psnr');
            }
        });
    }
    configureVideoWritableStream(writableStream) {
        this.writerPromise = new Promise((resolve) => {
            const outputStream = this.getDestinationStream();
            outputStream
                .on('error', (e) => {
                writableStream.emit('error', e);
                resolve(false);
            })
                .on('stderr', (e) => {
                writableStream.emit('error', { message: e });
                resolve(false);
            })
                .on('end', () => {
                writableStream.end();
                resolve(true);
            });
            outputStream.toFormat('mp4');
            outputStream.addOutputOptions('-movflags +frag_keyframe+separate_moof+omit_tfhd_offset+empty_moov');
            outputStream.pipe(writableStream);
        });
    }
    getOutputOption() {
        var _a, _b;
        const cpu = Math.max(1, os_1.default.cpus().length - 1);
        const videoOutputOptions = (_a = this.options.videOutputOptions) !== null && _a !== void 0 ? _a : [];
        const outputOptions = [];
        outputOptions.push(`-crf ${(_b = this.options.videoCrf) !== null && _b !== void 0 ? _b : 23}`);
        outputOptions.push(`-preset ${this.options.videoPreset || 'ultrafast'}`);
        outputOptions.push(`-pix_fmt ${this.options.videoPixelFormat || 'yuv420p'}`);
        outputOptions.push(`-minrate ${this.options.videoBitrate || 1000}`);
        outputOptions.push(`-maxrate ${this.options.videoBitrate || 1000}`);
        outputOptions.push('-framerate 1');
        outputOptions.push(`-threads ${cpu}`);
        outputOptions.push(`-loglevel error`);
        videoOutputOptions.forEach((options) => {
            outputOptions.push(options);
        });
        return outputOptions;
    }
    addVideoMetadata(outputStream) {
        var _a;
        const metadataOptions = (_a = this.options.metadata) !== null && _a !== void 0 ? _a : [];
        for (const metadata of metadataOptions) {
            outputStream.outputOptions('-metadata', metadata);
        }
    }
    getDestinationStream() {
        var _a;
        const outputStream = (0, fluent_ffmpeg_1.default)({
            source: this.videoMediatorStream,
            priority: 20,
        })
            .videoCodec(this.options.videoCodec || 'libx264')
            .size(this.videoFrameSize)
            .aspect(this.options.aspectRatio || '4:3')
            .autopad(this.autopad.activation, (_a = this.autopad) === null || _a === void 0 ? void 0 : _a.color)
            .inputFormat('image2pipe')
            .inputFPS(this.options.fps)
            .outputOptions(this.getOutputOption())
            .on('progress', (progressDetails) => {
            this.duration = progressDetails.timemark;
        });
        this.addVideoMetadata(outputStream);
        if (this.options.recordDurationLimit) {
            outputStream.duration(this.options.recordDurationLimit);
        }
        this.ffmpegProcess = outputStream;
        return outputStream;
    }
    handleWriteStreamError(errorMessage) {
        this.emit('videoStreamWriterError', errorMessage);
        if (this.status !== pageVideoStreamTypes_1.VIDEO_WRITE_STATUS.IN_PROGRESS &&
            errorMessage.includes('pipe:0: End of file')) {
            return;
        }
        return console.error(`Error unable to capture video stream: ${errorMessage}`);
    }
    findSlot(timestamp) {
        if (this.screenCastFrames.length === 0) {
            return 0;
        }
        let i;
        let frame;
        for (i = this.screenCastFrames.length - 1; i >= 0; i--) {
            frame = this.screenCastFrames[i];
            if (timestamp > frame.timestamp) {
                break;
            }
        }
        return i + 1;
    }
    insert(frame) {
        // reduce the queue into half when it is full
        if (this.screenCastFrames.length === this.screenLimit) {
            const numberOfFramesToSplice = Math.floor(this.screenLimit / 2);
            const framesToProcess = this.screenCastFrames.splice(0, numberOfFramesToSplice);
            this.processFrameBeforeWrite(framesToProcess, this.screenCastFrames[0].timestamp);
        }
        const insertionIndex = this.findSlot(frame.timestamp);
        if (insertionIndex === this.screenCastFrames.length) {
            this.screenCastFrames.push(frame);
        }
        else {
            this.screenCastFrames.splice(insertionIndex, 0, frame);
        }
    }
    trimFrame(fameList, chunckEndTime) {
        return fameList.map((currentFrame, index) => {
            const endTime = index !== fameList.length - 1
                ? fameList[index + 1].timestamp
                : chunckEndTime;
            const duration = endTime - currentFrame.timestamp;
            return Object.assign(Object.assign({}, currentFrame), { duration });
        });
    }
    processFrameBeforeWrite(frames, chunckEndTime) {
        const processedFrames = this.trimFrame(frames, chunckEndTime);
        processedFrames.forEach(({ blob, duration }) => {
            this.write(blob, duration);
        });
    }
    write(data, durationSeconds = 1) {
        this.status = pageVideoStreamTypes_1.VIDEO_WRITE_STATUS.IN_PROGRESS;
        const totalFrames = durationSeconds * this.options.fps;
        const floored = Math.floor(totalFrames);
        let numberOfFPS = Math.max(floored, 1);
        if (floored === 0) {
            this.frameGain += 1 - totalFrames;
        }
        else {
            this.frameLoss += totalFrames - floored;
        }
        while (1 < this.frameLoss) {
            this.frameLoss--;
            numberOfFPS++;
        }
        while (1 < this.frameGain) {
            this.frameGain--;
            numberOfFPS--;
        }
        for (let i = 0; i < numberOfFPS; i++) {
            this.videoMediatorStream.write(data);
        }
    }
    drainFrames(stoppedTime) {
        this.processFrameBeforeWrite(this.screenCastFrames, stoppedTime);
        this.screenCastFrames = [];
    }
    stop(stoppedTime = Date.now() / 1000) {
        if (this.status === pageVideoStreamTypes_1.VIDEO_WRITE_STATUS.COMPLETED) {
            return this.writerPromise;
        }
        this.drainFrames(stoppedTime);
        this.videoMediatorStream.end();
        this.status = pageVideoStreamTypes_1.VIDEO_WRITE_STATUS.COMPLETED;
        return this.writerPromise;
    }
    abort() {
        // Check if already completed or aborted
        if (this.status === pageVideoStreamTypes_1.VIDEO_WRITE_STATUS.COMPLETED || this.status === pageVideoStreamTypes_1.VIDEO_WRITE_STATUS.ABORTED) {
            return Promise.resolve();
        }
        // Immediately terminate the stream without draining frames
        if (this.videoMediatorStream) {
            this.videoMediatorStream.destroy(); // Forcefully close the stream without finalizing
            this.videoMediatorStream = null;
        }
        if (this.writerPromise) {
            // this.writerPromise.catch((err) => {
            //   console.error('Recording aborted:', err.message);
            // });
            // Reject the promise with an error indicating that the recording was aborted
            this.writerPromise = Promise.resolve(false);
            //Promise.reject(new Error('Recording aborted.'));
            // this.writerPromise = null;
        }
        if (this.ffmpegProcess) {
            this.ffmpegProcess.kill('SIGKILL'); // Force kill ffmpeg process
            this.ffmpegProcess = null; // Ensure it's not referenced
        }
        this.status = pageVideoStreamTypes_1.VIDEO_WRITE_STATUS.ABORTED;
        console.log('Recording aborted, resources released without finalizing.');
        // Resolve the promise immediately, no further processing needed
        return Promise.resolve();
    }
}
exports.default = PageVideoStreamWriter;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFnZVZpZGVvU3RyZWFtV3JpdGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2xpYi9wYWdlVmlkZW9TdHJlYW1Xcml0ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLG1DQUFzQztBQUN0Qyw0Q0FBb0I7QUFDcEIsK0JBQStCO0FBQy9CLG1DQUErQztBQUUvQywrREFBc0Q7QUFFdEQsaUVBS2dDO0FBRWhDOztHQUVHO0FBQ0gsTUFBTSxzQkFBc0IsR0FBRztJQUM3QiwyQ0FBb0IsQ0FBQyxHQUFHO0lBQ3hCLDJDQUFvQixDQUFDLEdBQUc7SUFDeEIsMkNBQW9CLENBQUMsR0FBRztJQUN4QiwyQ0FBb0IsQ0FBQyxJQUFJO0NBQzFCLENBQUM7QUFFRjs7R0FFRztBQUNILE1BQXFCLHFCQUFzQixTQUFRLHFCQUFZO0lBZTdELFlBQVksaUJBQW9DLEVBQUUsT0FBc0I7UUFDdEUsS0FBSyxFQUFFLENBQUM7UUFmTyxnQkFBVyxHQUFHLEVBQUUsQ0FBQztRQUMxQixxQkFBZ0IsR0FBRyxFQUFFLENBQUM7UUFDdkIsYUFBUSxHQUFHLGFBQWEsQ0FBQztRQUN6QixjQUFTLEdBQUcsQ0FBQyxDQUFDO1FBQ2QsY0FBUyxHQUFHLENBQUMsQ0FBQztRQUViLFdBQU0sR0FBRyx5Q0FBa0IsQ0FBQyxXQUFXLENBQUM7UUFHeEMsd0JBQW1CLEdBQWdCLElBQUksb0JBQVcsRUFBRSxDQUFDO1FBRXJELGtCQUFhLEdBQWdDLElBQUksQ0FBQztRQU14RCxJQUFJLE9BQU8sRUFBRTtZQUNYLElBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO1NBQ3hCO1FBRUQsTUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDLGlCQUFpQixDQUFDLENBQUM7UUFDNUQsSUFBSSxDQUFDLG1CQUFtQixFQUFFLENBQUM7UUFDM0IsSUFBSSxVQUFVLEVBQUU7WUFDZCxJQUFJLENBQUMsNEJB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