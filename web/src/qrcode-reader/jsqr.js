// use with commonJS
// const { MultiFormatReader, BarcodeFormat } = require('@zxing/library');
// or with ES6 modules
// import { MultiFormatReader, BarcodeFormat } from '@zxing/library';
// import * as ZXING from '@zxing/library';
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
    // self.importScripts(`${location.origin}/jsqr.min.js`);
    self.importScripts(`${location.origin}/zxing-library.min.js`);
    self.addEventListener("message", function (event) {
      const imageData = event.data;
      const hints = new Map();
      const formats = [
        ZXing.BarcodeFormat.AZTEC,
        ZXing.BarcodeFormat.CODABAR,
        ZXing.BarcodeFormat.CODE_39,
        ZXing.BarcodeFormat.CODE_93,
        ZXing.BarcodeFormat.CODE_128,
        ZXing.BarcodeFormat.DATA_MATRIX,
        ZXing.BarcodeFormat.EAN_8,
        ZXing.BarcodeFormat.EAN_13,
        ZXing.BarcodeFormat.ITF,
        ZXing.BarcodeFormat.MAXICODE,
        ZXing.BarcodeFormat.PDF_417,
        ZXing.BarcodeFormat.QR_CODE,
        ZXing.BarcodeFormat.RSS_14,
        ZXing.BarcodeFormat.RSS_EXPANDED,
        ZXing.BarcodeFormat.UPC_A,
        ZXing.BarcodeFormat.UPC_E,
        ZXing.BarcodeFormat.UPC_EAN_EXTENSION
      ];
      hints.set(ZXing.DecodeHintType.POSSIBLE_FORMATS, formats);

      const reader = new ZXing.MultiFormatReader();

      reader.setHints(hints);

      const luminanceSource = new ZXing.RGBLuminanceSource(imageData.data, imageData.width, imageData.height);
      const binaryBitmap = new ZXing.BinaryBitmap(new ZXing.HybridBinarizer(luminanceSource));
      console.log(ZXing.DecodeHintType.POSSIBLE_FORMATS)

      const result = reader.decode(binaryBitmap);
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
