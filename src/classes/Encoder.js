import {GIFEncoder, quantize, applyPalette} from 'gifenc';
const {Buffer} = require('buffer');

class Encoder {
  constructor(config) {
    this.config = config;
  }

  encodeGif(imageDatas, width, height) {
    // Create an encoding stream
    const gif = GIFEncoder();

    const delay = this.config.delayPerFrame;

    const framesLength = imageDatas.length;
    for (let i = 0; i < framesLength; i++) {
      const data = imageDatas[i].data;

      // Quantize your colors to a 256-color RGB palette palette
      const palette = quantize(data, 256);

      // Get an indexed bitmap by reducing each pixel to the nearest color palette
      const index = applyPalette(data, palette);

      // Write a single frame
      gif.writeFrame(index, width, height, {
        palette,
        delay,
        transparent: true,
        // dispose: 2,
      });

      // Wait a tick so that we don't lock up browser
      // await new Promise(resolve => setTimeout(resolve, 0));
    }

    // Write end-of-stream character
    gif.finish();

    // Get the Uint8Array output of your binary GIF file
    const output = gif.bytes();

    if (this.config.returnBufferType === 'Buffer') {
      return Buffer.from(output);
    } else {
      return Array.from(output);
    }
  }

  encode(imageDatas) {
    const {width, height} = imageDatas[0];

    return {
      width,
      height,
      framesLength: imageDatas.length,
      extension: 'gif',
      buffer:
        this.config.returnBufferType === 'ArrayOfImageData'
          ? imageDatas
          : this.encodeGif(imageDatas, width, height),
    };
  }
}

module.exports = Encoder;
