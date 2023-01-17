const {createCanvas} = require('@flyskywhy/react-native-gcanvas');

// TODO: register font in react-native
// registerFont(path.resolve(__dirname, "../assets/runescape_uf.ttf"), {
//   family: "RuneScape",
// });

class Context {
  constructor(width, height, scale) {
    this.context = createCanvas(width, height).getContext("2d");
    this.context.clearRect(0, 0, width, height);
    this.scale = scale;
  }

  getStatic() {
    const fontSize = 16 * this.scale;
    this.context.font = `${fontSize}px "RuneScape"`;
    this.context.shadowColor = "black";
    this.context.shadowOffsetX = this.scale;
    this.context.shadowOffsetY = this.scale;

    return this.context;
  }

  getDynamic() {
    this.getStatic();
    this.getMerge();

    return this.context;
  }

  getMerge() {
    // TODO: below will flash some, so comment them, debug later
    // const { width, height } = this.context.canvas;
    // this.context.fillStyle = "rgba(128, 128, 128, 1)";
    // this.context.fillStyle = "rgba(0, 0, 0, 0)";
    // this.context.fillRect(0, 0, width, height);

    return this.context;
  }
}

const measureText = (message, scale) => {
  const fontSize = 16 * scale;
  const context = createCanvas(0, 0).getContext("2d");
  context.font = `${fontSize}px "RuneScape"`;
  const measurement = context.measureText(message);

  return {
    width: measurement.width,
    height:
      measurement.actualBoundingBoxAscent +
      measurement.actualBoundingBoxDescent +
      scale,
    ascent: measurement.actualBoundingBoxAscent,
  };
};

module.exports = {
  Context,
  measureText,
};
