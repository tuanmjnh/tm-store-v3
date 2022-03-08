// or with ES6 modules
// import { MultiFormatReader, BarcodeFormat } from '@zxing/library';
import * as ZXING from '@zxing/library';
const inlineWorker = func => {
  const functionBody = func
    .toString()
    .trim()
    .match(/^function\s*\w*\s*\([\w\s,]*\)\s*{([\w\W]*?)}$/)[1];
  return new Worker(URL.createObjectURL(new Blob([functionBody], { type: "text/javascript" })));
};

export default () => {
  /* eslint-disable no-undef */
  return inlineWorker(function () {
    self.importScripts(`${location.origin}/jsqr.min.js`);
    self.addEventListener("message", function (event) {
      const imageData = event.data;
      console.log(imageData)
      const hints = new Map();
      const formats = [
        ZXING.BarcodeFormat.AZTEC,
        ZXING.BarcodeFormat.CODABAR,
        ZXING.BarcodeFormat.CODE_39,
        ZXING.BarcodeFormat.CODE_93,
        ZXING.BarcodeFormat.CODE_128,
        ZXING.BarcodeFormat.DATA_MATRIX,
        ZXING.BarcodeFormat.EAN_8,
        ZXING.BarcodeFormat.EAN_13,
        ZXING.BarcodeFormat.ITF,
        ZXING.BarcodeFormat.MAXICODE,
        ZXING.BarcodeFormat.PDF_417,
        ZXING.BarcodeFormat.QR_CODE,
        ZXING.BarcodeFormat.RSS_14,
        ZXING.BarcodeFormat.RSS_EXPANDED,
        ZXING.BarcodeFormat.UPC_A,
        ZXING.BarcodeFormat.UPC_E,
        ZXING.BarcodeFormat.UPC_EAN_EXTENSION
      ];
      hints.set(ZXING.DecodeHintType.POSSIBLE_FORMATS, formats);

      const reader = new MultiFormatReader();

      reader.setHints(hints);

      const luminanceSource = new RGBLuminanceSource(imageData.data, imageData.width, imageData.height);
      const binaryBitmap = new BinaryBitmap(new HybridBinarizer(luminanceSource));

      const result = reader.decode(binaryBitmap);
      console.log(result)
      // const result = jsQR(imageData.data, imageData.width, imageData.height);
      let content = null;
      let location = null;

      if (result !== null) {
        content = result.data;
        location = result.location;
      }

      const message = { content, location, imageData };
      self.postMessage(message, [imageData.data.buffer]);
    });
  });
  /* eslint-enable */
};
