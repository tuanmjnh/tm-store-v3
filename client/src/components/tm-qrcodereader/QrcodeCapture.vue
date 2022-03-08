<template lang="html">
  <input
    @change="onChangeInput"
    type="file"
    name="image"
    accept="image/*"
    capture="environment"
    multiple
  />
</template>

<script>
import { scan } from "@/qrcode-reader/scanner.js";
import { imageDataFromFile } from "@/qrcode-reader/image-data.js";
import CommonAPI from "./CommonAPI.vue";
import Worker from "@/qrcode-reader/jsqr.js";
import { MultiFormatReader, BarcodeFormat, DecodeHintType, RGBLuminanceSource, BinaryBitmap, HybridBinarizer } from '@zxing/library';

export default {
  name: "qrcode-capture",

  mixins: [CommonAPI],

  props: {
    worker: {
      type: Function,
      default: Worker
    }
  },

  methods: {
    onChangeInput (event) {
      const files = [...event.target.files];
      const resultPromises = files.map(this.onWorker);
      console.log(resultPromises)
      resultPromises.forEach(this.onDetect);
    },
    async onWorker (file) {
      const imageData = await imageDataFromFile(file);
      const hints = new Map();
      const formats = [BarcodeFormat.QR_CODE, BarcodeFormat.DATA_MATRIX/*, ...*/];

      hints.set(DecodeHintType.POSSIBLE_FORMATS, formats);

      const reader = new MultiFormatReader(hints);

      // reader.setHints(hints);

      const luminanceSource = new RGBLuminanceSource(imageData.data, imageData.width, imageData.height);
      const binaryBitmap = new BinaryBitmap(new HybridBinarizer(luminanceSource));

      const rs = reader.decode(binaryBitmap);
      return rs
    },

    async processFile (file) {
      const imageData = await imageDataFromFile(file);
      const scanResult = await scan(onWorker, imageData);

      return scanResult;
    }
  }
};
</script>
