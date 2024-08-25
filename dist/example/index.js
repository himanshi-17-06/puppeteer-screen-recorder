// import puppeteer from 'puppeteer';
// import { PuppeteerScreenRecorder } from '../lib/PuppeteerScreenRecorder';
// /** @ignore */
// function sleep(time: number) {
//   return new Promise((resolve) => {
//     setTimeout(resolve, time);
//   });
// }
// /** @ignore */
// async function testStartMethod(format: string) {
//   const executablePath = process.env['PUPPETEER_EXECUTABLE_PATH'];
//   const browser = await puppeteer.launch({
//     ...(executablePath ? { executablePath: executablePath } : {}),
//     headless: false,
//   });
//   const page = await browser.newPage();
//   const recorder = new PuppeteerScreenRecorder(page);
//   await page.setViewport({
//     width: 1920,
//     height: 1080,
//     deviceScaleFactor: 1,
//   });
//   await recorder.start(format);
//   await page.goto('https://developer.mozilla.org/en-US/docs/Web/CSS/animation');
//   await sleep(10 * 1000);
//   await recorder.stop();
//   await browser.close();
// }
// async function executeSample(format) {
//   return testStartMethod(format);
// }
// executeSample('./report/video/simple1.mp4').then(() => {
//   console.log('completed');
// });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvZXhhbXBsZS9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxxQ0FBcUM7QUFFckMsNEVBQTRFO0FBRTVFLGlCQUFpQjtBQUNqQixpQ0FBaUM7QUFDakMsc0NBQXNDO0FBQ3RDLGlDQUFpQztBQUNqQyxRQUFRO0FBQ1IsSUFBSTtBQUVKLGlCQUFpQjtBQUNqQixtREFBbUQ7QUFDbkQscUVBQXFFO0FBQ3JFLDZDQUE2QztBQUM3QyxxRUFBcUU7QUFDckUsdUJBQXVCO0FBQ3ZCLFFBQVE7QUFDUiwwQ0FBMEM7QUFDMUMsd0RBQXdEO0FBQ3hELDZCQUE2QjtBQUM3QixtQkFBbUI7QUFDbkIsb0JBQW9CO0FBQ3BCLDRCQUE0QjtBQUM1QixRQUFRO0FBRVIsa0NBQWtDO0FBRWxDLG1GQUFtRjtBQUNuRiw0QkFBNEI7QUFFNUIsMkJBQTJCO0FBQzNCLDJCQUEyQjtBQUMzQixJQUFJO0FBRUoseUNBQXlDO0FBQ3pDLG9DQUFvQztBQUNwQyxJQUFJO0FBRUosMkRBQTJEO0FBQzNELDhCQUE4QjtBQUM5QixNQUFNIn0=