const { Context, measureText } = require("./Context");
const {gradient2FillStyle, isAnimated} = require("../utils/effectUtil");
const range = require("../utils/range");
const {getImageDataSxOrSy} = require("../utils/configUtil");

class Motion {
  constructor(config) {
    this.version = config.version;
    this.scale = config.scale;
    this.fontName = config.font;
    this.totalFrames = config.totalFrames;
    this.clipWidth = config.width;
    this.clipHeight = config.height;
    this.imageSmoothingEnabled = config.imageSmoothingEnabled;
    this.imageGradientEnabled = config.imageGradientEnabled;
    this.gradientThreshold = config.gradientThreshold;
  }

  renderNoneStatic(message, color) {
    const { width, height, ascent } = measureText(message, this.scale, this.fontName);

    const context = new Context(
      width,
      height,
      this.scale,
      this.imageSmoothingEnabled,
      this.fontName,
    ).getStatic();
    context.fillStyle = color.calculate(0);

    context.fillText(message, 0, ascent);

    let sx = this.clipWidth ? getImageDataSxOrSy(width, this.clipWidth) : 0;
    let sy = this.clipHeight ? getImageDataSxOrSy(height, this.clipHeight) : 0;
    let sw = this.clipWidth ? this.clipWidth : width;
    let sh = this.clipHeight ? this.clipHeight : height;
    let imageData = context.getImageData(sx, sy, sw, sh);
    if (!this.imageGradientEnabled) {
      gradient2FillStyle(imageData, context.fillStyle, this.gradientThreshold);
    }
    return [imageData];
  }

  renderNoneDynamic(line, color) {
    const { width, height, ascent } = measureText(line, this.scale, this.fontName);

    return range(this.totalFrames).map((frame) => {
      const context = new Context(
        width,
        height,
        this.scale,
        this.imageSmoothingEnabled,
        this.fontName,
      ).getDynamic();
      context.fillStyle = color.calculate(frame);

      context.fillText(line, 0, ascent);

      let sx = this.clipWidth ? getImageDataSxOrSy(width, this.clipWidth) : 0;
      let sy = this.clipHeight ? getImageDataSxOrSy(height, this.clipHeight) : 0;
      let sw = this.clipWidth ? this.clipWidth : width;
      let sh = this.clipHeight ? this.clipHeight : height;
      let imageData = context.getImageData(sx, sy, sw, sh);
      if (!this.imageGradientEnabled) {
        gradient2FillStyle(imageData, context.fillStyle, this.gradientThreshold);
      }
      return imageData;
    });
  }

  getWave() {
    return {
      amplitudeFactor: 1 / 3,
      getTotalWidth: (width) => width,
      frameFactor: 1,
      getWave: (wave) => 1 + wave,
      getX: (width) => width,
    };
  }

  getWave2() {
    return {
      amplitudeFactor: 1 / 6,
      getTotalWidth: (width, amplitude) => Math.round(width + 2 * amplitude),
      frameFactor: 1,
      getWave: (wave) => 1 + wave,
      getX: (width, displacement) => Math.round(width + displacement),
    };
  }

  getShake() {
    return {
      amplitudeFactor: 1 / 3,
      getTotalWidth: (width) => width,
      frameFactor: 6,
      getWave: (wave, frame) =>
        2 * frame > this.totalFrames
          ? 1
          : 1 + wave * (1 - (2 * frame) / this.totalFrames),
      getX: (width) => width,
    };
  }

  renderWave(
    line,
    color,
    { amplitudeFactor, getTotalWidth, frameFactor, getWave, getX }
  ) {
    const { width, height, ascent } = measureText(line, this.scale, this.fontName);

    const amplitude = height * amplitudeFactor;
    const totalWidth = getTotalWidth(width, amplitude);
    const totalHeight = Math.round(height + 2 * amplitude);

    return range(this.totalFrames).map((frame) => {
      const context = new Context(
        totalWidth,
        totalHeight,
        this.scale,
        this.imageSmoothingEnabled,
        this.fontName,
      ).getDynamic();
      context.fillStyle = color.calculate(frame);

      line.split("").forEach((char, index) => {
        const wave = Math.sin(
          Math.PI * (index / 6 + 8 * frameFactor * (frame / this.totalFrames))
        );
        const displacement = amplitude * getWave(wave, frame);
        const x = getX(
          measureText(line.slice(0, index), this.scale, this.fontName).width,
          displacement
        );
        const y = Math.round(ascent + displacement);

        context.fillText(char, x, y);
      });

      let sx = this.clipWidth ? getImageDataSxOrSy(width, this.clipWidth) : 0;
      let sy = this.clipHeight ? getImageDataSxOrSy(height, this.clipHeight) : 0;
      let sw = this.clipWidth ? this.clipWidth : width;
      let sh = this.clipHeight ? this.clipHeight : height;
      let imageData = context.getImageData(sx, sy, sw, sh);
      if (!this.imageGradientEnabled) {
        gradient2FillStyle(imageData, context.fillStyle, this.gradientThreshold);
      }
      return imageData;
    });
  }

  renderScroll(line, color) {
    const { width, height, ascent } = measureText(line, this.scale, this.fontName);

    return range(this.totalFrames).map((frame) => {
      const context = new Context(
        width,
        height,
        this.scale,
        this.imageSmoothingEnabled,
        this.fontName,
      ).getDynamic();
      context.fillStyle = color.calculate(frame);

      const displacement = width - ((2 * frame) / this.totalFrames) * width;

      context.fillText(line, Math.round(displacement), ascent);

      let sx = this.clipWidth ? getImageDataSxOrSy(width, this.clipWidth) : 0;
      let sy = this.clipHeight ? getImageDataSxOrSy(height, this.clipHeight) : 0;
      let sw = this.clipWidth ? this.clipWidth : width;
      let sh = this.clipHeight ? this.clipHeight : height;
      let imageData = context.getImageData(sx, sy, sw, sh);
      if (!this.imageGradientEnabled) {
        gradient2FillStyle(imageData, context.fillStyle, this.gradientThreshold);
      }
      return imageData;
    });
  }

  getSlideOsrs() {
    return {
      getY: (ascent, frame, motionFrameIndex, height) => {
        let displacement = ascent;
        if (frame < motionFrameIndex) {
          displacement -=
            ((motionFrameIndex - frame) / motionFrameIndex) * height;
        } else if (frame > this.totalFrames - motionFrameIndex) {
          displacement -=
            ((this.totalFrames - motionFrameIndex - frame) / motionFrameIndex) *
            height;
        }

        return Math.round(displacement);
      },
    };
  }

  getSlideRs3() {
    return {
      getY: (ascent, frame, motionFrameIndex, height) => {
        let displacement = ascent;
        if (frame < motionFrameIndex) {
          displacement +=
            ((motionFrameIndex - frame) / motionFrameIndex) * height;
        } else if (frame > this.totalFrames - motionFrameIndex) {
          displacement +=
            ((this.totalFrames - motionFrameIndex - frame) / motionFrameIndex) *
            height;
        }

        return Math.round(displacement);
      },
    };
  }

  renderSlide(line, color, { getY }) {
    const { width, height, ascent } = measureText(line, this.scale, this.fontName);
    const motionFrameIndex = Math.round(this.totalFrames / 6);

    return range(this.totalFrames).map((frame) => {
      const context = new Context(
        width,
        height,
        this.scale,
        this.imageSmoothingEnabled,
        this.fontName,
      ).getDynamic();
      context.fillStyle = color.calculate(frame);

      context.fillText(line, 0, getY(ascent, frame, motionFrameIndex, height));

      let sx = this.clipWidth ? getImageDataSxOrSy(width, this.clipWidth) : 0;
      let sy = this.clipHeight ? getImageDataSxOrSy(height, this.clipHeight) : 0;
      let sw = this.clipWidth ? this.clipWidth : width;
      let sh = this.clipHeight ? this.clipHeight : height;
      let imageData = context.getImageData(sx, sy, sw, sh);
      if (!this.imageGradientEnabled) {
        gradient2FillStyle(imageData, context.fillStyle, this.gradientThreshold);
      }
      return imageData;
    });
  }

  mergeImageDatas(mergedImageDatas, imageDatas) {
    if (mergedImageDatas.length === 0) {
      return imageDatas;
    }

    const maxWidth = Math.max(
      mergedImageDatas[0].width,
      imageDatas[0].width
    );
    const totalHeight =
      mergedImageDatas[0].height + imageDatas[0].height;

    return mergedImageDatas.map((imageData, index) => {
      const newContext = new Context(
        maxWidth,
        totalHeight,
        this.scale,
        this.imageSmoothingEnabled,
        this.fontName,
      ).getMerge();

      newContext.drawImage(imageData, 0, 0);
      newContext.drawImage(imageDatas[index], 0, imageData.height);

      let sx = this.clipWidth ? getImageDataSxOrSy(width, this.clipWidth) : 0;
      let sy = this.clipHeight ? getImageDataSxOrSy(height, this.clipHeight) : 0;
      let sw = this.clipWidth ? this.clipWidth : width;
      let sh = this.clipHeight ? this.clipHeight : height;
      return newContext.getImageData(sx, sy, sw, sh);
    });
  }

  setMotion(motion) {
    const motionFunctionMap = {
      osrs: {
        none: this.renderNoneDynamic,
        wave: (line, color) => this.renderWave(line, color, this.getWave()),
        wave2: (line, color) => this.renderWave(line, color, this.getWave2()),
        shake: (line, color) => this.renderWave(line, color, this.getShake()),
        scroll: this.renderScroll,
        slide: (line, color) =>
          this.renderSlide(line, color, this.getSlideOsrs()),
      },
      rs3: {
        none: this.renderNoneDynamic,
        wave: (line, color) => this.renderWave(line, color, this.getWave()),
        wave2: (line, color) => this.renderWave(line, color, this.getWave2()),
        shake: (line, color) => this.renderWave(line, color, this.getShake()),
        scroll: this.renderScroll,
        slide: (line, color) =>
          this.renderSlide(line, color, this.getSlideRs3()),
      },
    };

    this.motion = motion;
    this.motionFunction = motionFunctionMap[this.version][this.motion];
  }

  render(message, color) {
    if (!isAnimated(color.color, this.motion)) {
      return this.renderNoneStatic(message, color);
    }

    return message.split("\n").reduce((mergedImageDatas, line) => {
      const imageDatas = this.motionFunction(line, color);
      return this.mergeImageDatas(mergedImageDatas, imageDatas);
    }, []);
  }
}

module.exports = Motion;
