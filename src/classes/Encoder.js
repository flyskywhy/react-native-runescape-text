const {GIFEncoder} = require('react-native-gifencoder');
const {Buffer} = require('buffer');

// ref to https://github.com/flyskywhy/PixelShapeRN/blob/v1.1.27/src/workers/generateGif.worker.js#L22
const isTransparencyPresent = (imageDataArr, transparentColor) => {
  let i = 0,
    transpUsed = -1;
  const len = imageDataArr.length;

  for (; i < len; ) {
    transpUsed *=
      imageDataArr[i++] -
      transparentColor.r +
      imageDataArr[i++] -
      transparentColor.g +
      imageDataArr[i++] -
      transparentColor.b;

    i++;

    if (!transpUsed) {
      break;
    }
    transpUsed = -1;
  }
  return !transpUsed;
};

class Encoder {
  constructor(config) {
    this.config = config;
  }

  encodeGif(imageDatas, width, height) {
    const gif = new GIFEncoder();
    const transparentColor = 0x000000;
    const transpRGB = {r: 0, g: 0, b: 0};

    gif.setRepeat(0);
    // we need to set disposal code of 2 for each frame
    // to be sure that the current frame will override the previous and won't overlap
    gif.setDispose(2);
    gif.setQuality(this.config.quality);
    gif.setDelay(this.config.delayPerFrame);
    gif.setSize(width, height);
    gif.setComment('');

    let frames = [];
    imageDatas.map((imageData, index) => {
        const useTransparency = isTransparencyPresent(imageData.data, transpRGB);
        if (useTransparency) {
          gif.setTransparent(transparentColor);
        } else {
          gif.setTransparent(null);
        }

        if (index === 0) {
          gif.start();
        } else {
          gif.cont();
          gif.setProperties(true, false); // started, firstFrame
        }

        gif.addFrame(imageData.data, true);

        if (imageDatas.length === index + 1) {
          gif.finish();
        }

        frames = frames.concat(gif.stream().bin);
      });

    if (this.config.returnBuffer) {
      return Buffer.from(frames);
    } else {
      return frames;
    }
  }

  encode(imageDatas) {
    const { width, height } = imageDatas[0];

    return {
          width,
          height,
          framesLength: imageDatas.length,
          extension: "gif",
          buffer: this.encodeGif(imageDatas, width, height),
        };
  }
}

module.exports = Encoder;
