"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = require("path");
const ava_1 = __importDefault(require("ava"));
// @ts-ignore:next-line
const puppeteer_1 = __importDefault(require("puppeteer"));
const __1 = require("../");
const launchBrowser = async () => {
    const puppeteerPath = process.env['PUPPETEER_EXECUTABLE_PATH'];
    const browser = await puppeteer_1.default.launch(Object.assign({ headless: true }, (puppeteerPath ? { executablePath: puppeteerPath } : {})));
    return browser;
};
(0, ava_1.default)('case 1a --> Happy Path: Should be able to create a new screen-recording session', async (assert) => {
    /** setup */
    const browser = await launchBrowser();
    const page = await browser.newPage();
    const outputVideoPath = './test-output/test/video-recorder/testCase1.mp4';
    const recorder = new __1.PuppeteerScreenRecorder(page);
    const recorderValue = await recorder.start(outputVideoPath);
    /** execute */
    await page.goto('https://github.com', { waitUntil: 'load' });
    await page.goto('https://google.com', { waitUntil: 'load' });
    /** clear */
    const status = await recorder.stop();
    await browser.close();
    /** assert */
    assert.is(recorderValue instanceof __1.PuppeteerScreenRecorder, true);
    assert.is(status, true);
    assert.is(fs_1.default.existsSync(outputVideoPath), true);
});
(0, ava_1.default)('case 1a --> Happy Path: Should be able to create a new screen-recording session using mp4 format', async (assert) => {
    /** setup */
    const browser = await launchBrowser();
    const page = await browser.newPage();
    const outputVideoPath = './test-output/test/video-recorder/testCase1.mp4';
    const recorder = new __1.PuppeteerScreenRecorder(page);
    const recorderValue = await recorder.start(outputVideoPath);
    /** execute */
    await page.goto('https://github.com', { waitUntil: 'load' });
    await page.goto('https://google.com', { waitUntil: 'load' });
    /** clear */
    const status = await recorder.stop();
    await browser.close();
    /** assert */
    assert.is(recorderValue instanceof __1.PuppeteerScreenRecorder, true);
    assert.is(status, true);
    assert.is(fs_1.default.existsSync(outputVideoPath), true);
});
(0, ava_1.default)('case 1b --> Happy Path: Should be able to create a new screen-recording session using mov', async (assert) => {
    /** setup */
    const browser = await launchBrowser();
    const page = await browser.newPage();
    const outputVideoPath = './test-output/test/video-recorder/testCase1.mov';
    const recorder = new __1.PuppeteerScreenRecorder(page);
    const recorderValue = await recorder.start(outputVideoPath);
    /** execute */
    await page.goto('https://github.com', { waitUntil: 'load' });
    await page.goto('https://google.com', { waitUntil: 'load' });
    /** clear */
    const status = await recorder.stop();
    await browser.close();
    /** assert */
    assert.is(recorderValue instanceof __1.PuppeteerScreenRecorder, true);
    assert.is(status, true);
    assert.is(fs_1.default.existsSync(outputVideoPath), true);
});
(0, ava_1.default)('case 1c --> Happy Path: Should be able to create a new screen-recording session using webm', async (assert) => {
    /** setup */
    const browser = await launchBrowser();
    const page = await browser.newPage();
    const outputVideoPath = './test-output/test/video-recorder/testCase1.webm';
    const recorder = new __1.PuppeteerScreenRecorder(page);
    const recorderValue = await recorder.start(outputVideoPath);
    /** execute */
    await page.goto('https://github.com', { waitUntil: 'load' });
    await page.goto('https://google.com', { waitUntil: 'load' });
    /** clear */
    const status = await recorder.stop();
    await browser.close();
    /** assert */
    assert.is(recorderValue instanceof __1.PuppeteerScreenRecorder, true);
    assert.is(status, true);
    assert.is(fs_1.default.existsSync(outputVideoPath), true);
});
(0, ava_1.default)('case 1d --> Happy Path: should be to get the total duration of recording using avi', async (assert) => {
    /** setup */
    const browser = await launchBrowser();
    const page = await browser.newPage();
    const outputVideoPath = './test-output/test/video-recorder/testCase2.avi';
    const recorder = new __1.PuppeteerScreenRecorder(page);
    const recorderValue = await recorder.start(outputVideoPath);
    /** execute */
    await page.goto('https://github.com', { waitUntil: 'load' });
    await page.goto('https://google.com', { waitUntil: 'load' });
    /** clear */
    const status = await recorder.stop();
    recorder.getRecordDuration();
    await browser.close();
    /** assert */
    assert.is(recorderValue instanceof __1.PuppeteerScreenRecorder, true);
    assert.is(status, true);
    assert.is(fs_1.default.existsSync(outputVideoPath), true);
});
(0, ava_1.default)('case 2 --> Happy Path: testing video recording with video frame width, height and aspect ratio', async (assert) => {
    /** setup */
    const browser = await launchBrowser();
    const page = await browser.newPage();
    const options = {
        followNewTab: false,
        videoFrame: {
            width: 1024,
            height: 1024,
        },
        aspectRatio: '4:3',
    };
    const outputVideoPath = './test-output/test/video-recorder/testCase4.mp4';
    const recorder = new __1.PuppeteerScreenRecorder(page, options);
    const recorderValue = await recorder.start(outputVideoPath);
    /** execute */
    await page.goto('https://github.com', { waitUntil: 'load' });
    /** clear */
    const status = await recorder.stop();
    await browser.close();
    /** assert */
    assert.is(recorderValue instanceof __1.PuppeteerScreenRecorder, true);
    assert.is(status, true);
    assert.is(fs_1.default.existsSync(outputVideoPath), true);
});
(0, ava_1.default)('test 3 -> Error Path: should throw error if an invalid savePath argument is passed for start method', async (assert) => {
    /** setup */
    const browser = await launchBrowser();
    const page = await browser.newPage();
    try {
        const outputVideoPath = './test-output/test/video-recorder/';
        const recorder = new __1.PuppeteerScreenRecorder(page);
        await recorder.start(outputVideoPath);
        /** execute */
        await page.goto('https://github.com', { waitUntil: 'load' });
        await page.goto('https://google.com', { waitUntil: 'load' });
        /** clear */
        await recorder.stop();
    }
    catch (error) {
        assert.true(error.message === 'File format is not supported');
    }
});
(0, ava_1.default)('case 4 --> Happy Path: Should be able to create a new screen-recording session using streams', async (assert) => {
    /** setup */
    const browser = await launchBrowser();
    const page = await browser.newPage();
    const outputVideoPath = './test-output/test/video-recorder/testCase4.mp4';
    try {
        fs_1.default.mkdirSync((0, path_1.dirname)(outputVideoPath), { recursive: true });
    }
    catch (e) {
        console.error(e);
    }
    const fileWriteStream = fs_1.default.createWriteStream(outputVideoPath);
    const recorder = new __1.PuppeteerScreenRecorder(page);
    await recorder.startStream(fileWriteStream);
    /** execute */
    await page.goto('https://github.com', { waitUntil: 'load' });
    await page.goto('https://google.com', { waitUntil: 'load' });
    /** clear */
    const status = await recorder.stop();
    await browser.close();
    /** assert */
    assert.is(status, true);
    assert.is(fs_1.default.existsSync(outputVideoPath), true);
    fileWriteStream.on('end', () => {
        assert.is(fileWriteStream.writableFinished, true);
    });
});
(0, ava_1.default)('case 5a --> Happy Path: testing video recording with video frame width, height and autopad color', async (assert) => {
    /** setup */
    const browser = await launchBrowser();
    const page = await browser.newPage();
    const options = {
        followNewTab: false,
        videoFrame: {
            width: 1024,
            height: 1024,
        },
        autopad: {
            color: 'gray',
        },
    };
    const outputVideoPath = './test-output/test/video-recorder/testCase5a.mp4';
    const recorder = new __1.PuppeteerScreenRecorder(page, options);
    const recorderValue = await recorder.start(outputVideoPath);
    /** execute */
    await page.goto('https://github.com', { waitUntil: 'load' });
    /** clear */
    const status = await recorder.stop();
    await browser.close();
    /** assert */
    assert.is(recorderValue instanceof __1.PuppeteerScreenRecorder, true);
    assert.is(status, true);
    assert.is(fs_1.default.existsSync(outputVideoPath), true);
});
(0, ava_1.default)('case 5b --> Happy Path: testing video recording with video frame width, height and autopad color as hex code', async (assert) => {
    /** setup */
    const browser = await launchBrowser();
    const page = await browser.newPage();
    const options = {
        followNewTab: false,
        videoFrame: {
            width: 1024,
            height: 1024,
        },
        autopad: {
            color: '#008000',
        },
    };
    const outputVideoPath = './test-output/test/video-recorder/testCase5b.mp4';
    const recorder = new __1.PuppeteerScreenRecorder(page, options);
    const recorderValue = await recorder.start(outputVideoPath);
    /** execute */
    await page.goto('https://github.com', { waitUntil: 'load' });
    /** clear */
    const status = await recorder.stop();
    await browser.close();
    /** assert */
    assert.is(recorderValue instanceof __1.PuppeteerScreenRecorder, true);
    assert.is(status, true);
    assert.is(fs_1.default.existsSync(outputVideoPath), true);
});
(0, ava_1.default)('case 5c --> Happy Path: testing video recording with video frame width, height and default autopad color', async (assert) => {
    /** setup */
    const browser = await launchBrowser();
    const page = await browser.newPage();
    const options = {
        followNewTab: false,
        videoFrame: {
            width: 1024,
            height: 1024,
        },
        autopad: {},
    };
    const outputVideoPath = './test-output/test/video-recorder/testCase5c.mp4';
    const recorder = new __1.PuppeteerScreenRecorder(page, options);
    const recorderValue = await recorder.start(outputVideoPath);
    /** execute */
    await page.goto('https://github.com', { waitUntil: 'load' });
    /** clear */
    const status = await recorder.stop();
    await browser.close();
    /** assert */
    assert.is(recorderValue instanceof __1.PuppeteerScreenRecorder, true);
    assert.is(status, true);
    assert.is(fs_1.default.existsSync(outputVideoPath), true);
});
(0, ava_1.default)('case 6 --> Happy Path: should create a video with a custom crf', async (assert) => {
    /** setup */
    const browser = await launchBrowser();
    const page = await browser.newPage();
    const options = {
        followNewTab: false,
        videoFrame: {
            width: 1024,
            height: 1024,
        },
        videoCrf: 0,
    };
    const outputVideoPath = './test-output/test/video-recorder/testCase6.mp4';
    const recorder = new __1.PuppeteerScreenRecorder(page, options);
    const recorderValue = await recorder.start(outputVideoPath);
    /** execute */
    await page.goto('https://github.com', { waitUntil: 'load' });
    /** clear */
    const status = await recorder.stop();
    await browser.close();
    /** assert */
    assert.is(recorderValue instanceof __1.PuppeteerScreenRecorder, true);
    assert.is(status, true);
    assert.is(fs_1.default.existsSync(outputVideoPath), true);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUHVwcGV0ZWVyU2NyZWVuUmVjb3JkZXIuc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zcGVjL1B1cHBldGVlclNjcmVlblJlY29yZGVyLnNwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSw0Q0FBb0I7QUFDcEIsK0JBQStCO0FBRS9CLDhDQUF1QjtBQUN2Qix1QkFBdUI7QUFDdkIsMERBQWtDO0FBRWxDLDJCQUE4RTtBQUU5RSxNQUFNLGFBQWEsR0FBRyxLQUFLLElBQUksRUFBRTtJQUMvQixNQUFNLGFBQWEsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLDJCQUEyQixDQUFDLENBQUM7SUFFL0QsTUFBTSxPQUFPLEdBQUcsTUFBTSxtQkFBUyxDQUFDLE1BQU0saUJBQ3BDLFFBQVEsRUFBRSxJQUFJLElBQ1gsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLEVBQUUsY0FBYyxFQUFFLGFBQWEsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFDM0QsQ0FBQztJQUVILE9BQU8sT0FBTyxDQUFDO0FBQ2pCLENBQUMsQ0FBQztBQUVGLElBQUEsYUFBSSxFQUFDLGlGQUFpRixFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsRUFBRTtJQUN2RyxZQUFZO0lBQ1osTUFBTSxPQUFPLEdBQUcsTUFBTSxhQUFhLEVBQUUsQ0FBQztJQUV0QyxNQUFNLElBQUksR0FBRyxNQUFNLE9BQU8sQ0FBQyxPQUFPLEVBQUUsQ0FBQztJQUVyQyxNQUFNLGVBQWUsR0FBRyxpREFBaUQsQ0FBQztJQUMxRSxNQUFNLFFBQVEsR0FBRyxJQUFJLDJCQUF1QixDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ25ELE1BQU0sYUFBYSxHQUFHLE1BQU0sUUFBUSxDQUFDLEtBQUssQ0FBQyxlQUFlLENBQUMsQ0FBQztJQUU1RCxjQUFjO0lBQ2QsTUFBTSxJQUFJLENBQUMsSUFBSSxDQUFDLG9CQUFvQixFQUFFLEVBQUUsU0FBUyxFQUFFLE1BQU0s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