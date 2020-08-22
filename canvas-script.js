window.onload = function () {
  const canvas = document.querySelector("canvas");
  canvas.width = 600;
  canvas.height = 300;
  const context = canvas.getContext("2d");

  const img = new Image();
  img.src = "iStock_3357562_600x300.jpg";
  let imageData;

  const kernelAlgo = (imageData, weights, opaque) => {
    let side = Math.round(Math.sqrt(weights.length));
    let halfSide = Math.floor(side / 2);
    let src = imageData.data;
    let sw = imageData.width;
    let sh = imageData.height;
    let imageDataCopy = context.createImageData(600, 300);
    imageDataCopy.data = imageData.data;
    imageDataCopy.width = imageData.width;
    imageDataCopy.height = imageData.height;

    let w = sw;
    let h = sh;

    let alphaFac = opaque ? 1 : 0;
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        let sy = y;
        let sx = x;
        let dstOff = (y * w + x) * 4;
        let r = 0,
          g = 0,
          b = 0,
          a = 0;
        for (let cy = 0; cy < side; cy++) {
          for (let cx = 0; cx < side; cx++) {
            let scy = sy + cy - halfSide;
            let scx = sx + cx - halfSide;
            if (scy >= 0 && scy < sh && scx >= 0 && scx < sw) {
              let srcOff = (scy * sw + scx) * 4;
              let wt = weights[cy * side + cx];
              r += src[srcOff] * wt;
              g += src[srcOff + 1] * wt;
              b += src[srcOff + 2] * wt;
              a += src[srcOff + 3] * wt;
            }
          }
        }
        imageDataCopy.data[dstOff] = r;
        imageDataCopy.data[dstOff + 1] = g;
        imageDataCopy.data[dstOff + 2] = b;
        imageDataCopy.data[dstOff + 3] = a + alphaFac * (255 - a);
      }
    }
    return imageDataCopy;
  };

  const originalbtn = document.getElementById("originalbtn");
  const sharpenbtn = document.getElementById("sharpenbtn");
  const blurbtn = document.getElementById("blurbtn");
  const sepiabtn = document.getElementById("sepiabtn");
  const BWbtn = document.getElementById("BWbtn");
  const mirrorbtn = document.getElementById("mirrorbtn");
  const sketchbtn = document.getElementById("sketchbtn");
  const brightform = document.getElementById("brightform");
  const negativebtn = document.getElementById("negativebtn");

  img.onload = () => {
    context.drawImage(img, 0, 0, 600, 300);
    imageData = context.getImageData(0, 0, 600, 300);

    originalbtn.addEventListener("click", () => {
      context.putImageData(imageData, 0, 0);
    });

    sharpenbtn.addEventListener("click", () => {
      let weights = [-1, -1, -1, -1, 9, -1, -1, -1, -1];
      let opaque = 0;
      const imageDataCopy = kernelAlgo(imageData, weights, opaque);
      context.putImageData(imageDataCopy, 0, 0);
    });

    blurbtn.addEventListener("click", () => {
      let weights = [
        1 / 9,
        1 / 9,
        1 / 9,
        1 / 9,
        1 / 9,
        1 / 9,
        1 / 9,
        1 / 9,
        1 / 9,
      ];
      let opaque = 0;
      const imageDataCopy = kernelAlgo(imageData, weights, opaque);
      context.putImageData(imageDataCopy, 0, 0);
    });

    sepiabtn.addEventListener("click", () => {
      let imageDataCopy = context.createImageData(600, 300);

      for (i = 0; i < imageData.data.length; i += 4) {
        imageDataCopy.data[i] = imageData.data[i] * 1.07; //RED
        imageDataCopy.data[i + 1] = imageData.data[i + 1] * 0.74; //GREEN
        imageDataCopy.data[i + 2] = imageData.data[i + 2] * 0.43; //BLUE
        imageDataCopy.data[i + 3] = imageData.data[i + 3]; //Alpha
      }

      context.putImageData(imageDataCopy, 0, 0);
    });

    BWbtn.addEventListener("click", () => {
      let imageDataCopy = context.createImageData(600, 300);

      for (i = 0; i < imageData.data.length; i += 4) {
        const avg =
          imageData.data[i] * 0.29 +
          imageData.data[i + 1] * 0.58 +
          imageData.data[i + 2] * 0.11;

        imageDataCopy.data[i] = avg; //RED
        imageDataCopy.data[i + 1] = avg; //GREEN
        imageDataCopy.data[i + 2] = avg; //BLUE
        imageDataCopy.data[i + 3] = imageData.data[i + 3]; //Alpha
      }
      context.putImageData(imageDataCopy, 0, 0);
    });

    negativebtn.addEventListener("click", () => {
      let imageDataCopy = context.createImageData(600, 300);

      for (i = 0; i < imageData.data.length; i += 4) {
        imageDataCopy.data[i] = 255 - imageData.data[i]; //RED
        imageDataCopy.data[i + 1] = 255 - imageData.data[i + 1]; //GREEN
        imageDataCopy.data[i + 2] = 255 - imageData.data[i + 2]; //BLUE
        imageDataCopy.data[i + 3] = imageData.data[i + 3]; //Alpha
      }
      context.putImageData(imageDataCopy, 0, 0);
    });

    mirrorbtn.addEventListener("click", () => {
      let imageDataCopy = context.createImageData(600, 300);
      for (let i = 0; i < imageData.data.length; i++) {
        imageDataCopy.data[i] = imageData.data[i];
      }

      for (var i = 0; i < imageData.height; i++) {
        for (var j = 0; j < imageData.width / 2; j++) {
          var off = (i * imageData.width + j) * 4;
          var dstOff = (i * imageData.width + (imageData.width - j - 1)) * 4;
          imageDataCopy.data[dstOff] = imageData.data[off];
          imageDataCopy.data[dstOff + 1] = imageData.data[off + 1];
          imageDataCopy.data[dstOff + 2] = imageData.data[off + 2];
          imageDataCopy.data[dstOff + 3] = imageData.data[off + 3];
        }
      }
      context.putImageData(imageDataCopy, 0, 0);
    });

    sketchbtn.addEventListener("click", () => {
      let imageDataCopy = context.createImageData(600, 300);
      for (i = 0; i < imageData.data.length; i += 4) {
        const threshold = 150;

        const affect =
          (imageData.data[i] + imageData.data[i] + imageData.data[i]) / 3 >=
          threshold
            ? 255
            : 0;

        imageDataCopy.data[i] = affect; //RED
        imageDataCopy.data[i + 1] = affect; //GREEN
        imageDataCopy.data[i + 2] = affect; //BLUE
        imageDataCopy.data[i + 3] = imageData.data[i + 3]; //Alpha
      }
      context.putImageData(imageDataCopy, 0, 0);
    });

    brightform.addEventListener("submit", (e) => {
      let imageDataCopy = context.createImageData(600, 300);
      e.preventDefault();
      const brightness = document.getElementById("brightness").value;

      for (i = 0; i < imageData.data.length; i += 4) {
        imageDataCopy.data[i] = imageData.data[i] + (brightness - 0); //RED
        imageDataCopy.data[i + 1] = imageData.data[i + 1] + (brightness - 0); //GREEN
        imageDataCopy.data[i + 2] = imageData.data[i + 2] + (brightness - 0); //BLUE
        imageDataCopy.data[i + 3] = imageData.data[i + 3]; //Alpha
      }
      context.putImageData(imageDataCopy, 0, 0);
    });
  };
};
