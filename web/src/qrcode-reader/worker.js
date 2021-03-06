// ES6 import
import jsQR from "jsqr";

export default function () {
  return function () {
    self.addEventListener("message", function (event) {
      const imageData = event.data;
      const result = jsQR(imageData.data, imageData.width, imageData.height);

      let content = null;
      let location = null;

      if (result !== null) {
        content = result.data;
        location = result.location;
      }

      const message = { content, location, imageData };
      self.postMessage(message, [imageData.data.buffer]);
    });
  }
}