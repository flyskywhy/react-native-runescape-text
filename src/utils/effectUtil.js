const tinycolor = require("tinycolor2");

const staticColors = ["yellow", "red", "green", "cyan", "purple", "white"];
const dynamicColors = ["glow1", "glow2", "glow3", "flash1", "flash2", "flash3"];
const colors = [...staticColors, ...dynamicColors];
const motions = ["wave", "wave2", "shake", "scroll", "slide"];

const effectsMap = {
  ...Object.fromEntries([
    ...colors.map((color) => [color, "color"]),
    ...motions.map((motion) => [motion, "motion"]),
  ]),
};

const yellow = [255, 255, 0];
const red = [255, 0, 0];
const green = [0, 255, 0];
const cyan = [0, 255, 255];
const purple = [255, 0, 255];
const white = [255, 255, 255];

const lightGreen = [128, 255, 128];
const darkGreen = [0, 176, 0];
const blue = [0, 0, 255];

const glow1Rs3 = [cyan, green, yellow, red, cyan];
const glow2Rs3 = [red, blue, purple, red];
const glow3Rs3 = [cyan, white, green, white, cyan];

const flash1Rs3 = [red, yellow];
const flash2Rs3 = [blue, cyan];
const flash3Rs3 = [darkGreen, lightGreen];

const glow1Osrs = [red, yellow, green, cyan, red];
const glow2Osrs = [red, purple, blue, red];
const glow3Osrs = [white, green, white, cyan, white];

const flash1Osrs = [red, yellow];
const flash2Osrs = [cyan, blue];
const flash3Osrs = [darkGreen, lightGreen];

const isAnimated = (color, motion) => {
  return motion !== "none" || dynamicColors.includes(color);
};

const gradient2FillStyle = (imageData, fillStyle, gradientThreshold) => {
  const {r, g, b} = tinycolor(fillStyle).toRgb();
  const totalPixels = imageData.data.length;

  for (var i = 0; i < totalPixels; i++) {
    const pos = i * 4;
    const a = imageData.data[pos + 3];
    if (a) {
      if (a > gradientThreshold) {
        imageData.data[pos] = r;
        imageData.data[pos + 1] = g;
        imageData.data[pos + 2] = b;
        imageData.data[pos + 3] = 255;
      } else {
        imageData.data[pos] = 0;
        imageData.data[pos + 1] = 0;
        imageData.data[pos + 2] = 0;
        imageData.data[pos + 3] = 0;
      }
    }
  }
};

module.exports = {
  colors,
  motions,
  effectsMap,
  yellow,
  red,
  green,
  cyan,
  purple,
  white,
  lightGreen,
  darkGreen,
  blue,
  glow1Rs3,
  glow2Rs3,
  glow3Rs3,
  flash1Rs3,
  flash2Rs3,
  flash3Rs3,
  glow1Osrs,
  glow2Osrs,
  glow3Osrs,
  flash1Osrs,
  flash2Osrs,
  flash3Osrs,
  isAnimated,
  gradient2FillStyle,
};
