"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SupportedFileFormats = exports.VIDEO_WRITE_STATUS = void 0;
/**
 * @ignore
 * @enum VIDEO_WRITE_STATUS
 */
var VIDEO_WRITE_STATUS;
(function (VIDEO_WRITE_STATUS) {
    VIDEO_WRITE_STATUS[VIDEO_WRITE_STATUS["NOT_STARTED"] = 0] = "NOT_STARTED";
    VIDEO_WRITE_STATUS[VIDEO_WRITE_STATUS["IN_PROGRESS"] = 1] = "IN_PROGRESS";
    VIDEO_WRITE_STATUS[VIDEO_WRITE_STATUS["COMPLETED"] = 2] = "COMPLETED";
    VIDEO_WRITE_STATUS[VIDEO_WRITE_STATUS["ERROR"] = 3] = "ERROR";
    VIDEO_WRITE_STATUS[VIDEO_WRITE_STATUS["ABORTED"] = 4] = "ABORTED";
})(VIDEO_WRITE_STATUS = exports.VIDEO_WRITE_STATUS || (exports.VIDEO_WRITE_STATUS = {}));
/**
 * @description supported video format for recording.
 * @example
 *  recording.start('./video.mp4');
 *  recording.start('./video.mov');
 *  recording.start('./video.webm');
 *  recording.start('./video.avi');
 */
var SupportedFileFormats;
(function (SupportedFileFormats) {
    SupportedFileFormats["MP4"] = "mp4";
    SupportedFileFormats["MOV"] = "mov";
    SupportedFileFormats["AVI"] = "avi";
    SupportedFileFormats["WEBM"] = "webm";
})(SupportedFileFormats = exports.SupportedFileFormats || (exports.SupportedFileFormats = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFnZVZpZGVvU3RyZWFtVHlwZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvbGliL3BhZ2VWaWRlb1N0cmVhbVR5cGVzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBOzs7R0FHRztBQUNILElBQVksa0JBTVg7QUFORCxXQUFZLGtCQUFrQjtJQUM1Qix5RUFBYSxDQUFBO0lBQ2IseUVBQWEsQ0FBQTtJQUNiLHFFQUFXLENBQUE7SUFDWCw2REFBTyxDQUFBO0lBQ1AsaUVBQVMsQ0FBQTtBQUNYLENBQUMsRUFOVyxrQkFBa0IsR0FBbEIsMEJBQWtCLEtBQWxCLDBCQUFrQixRQU03QjtBQThJRDs7Ozs7OztHQU9HO0FBQ0gsSUFBWSxvQkFLWDtBQUxELFdBQVksb0JBQW9CO0lBQzlCLG1DQUFXLENBQUE7SUFDWCxtQ0FBVyxDQUFBO0lBQ1gsbUNBQVcsQ0FBQTtJQUNYLHFDQUFhLENBQUE7QUFDZixDQUFDLEVBTFcsb0JBQW9CLEdBQXBCLDRCQUFvQixLQUFwQiw0QkFBb0IsUUFLL0IifQ==