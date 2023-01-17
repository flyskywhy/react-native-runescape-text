const config = require("../config");
const wordWrapConfig = require("../wordWrapConfig");

const getConfig = (options) => {
  const merged = { ...config, ...options };
  const delayPerFrame = 1000 / merged.fps;
  const totalFrames = Math.round(merged.cycleDuration / delayPerFrame);

  return {
    ...merged,
    delayPerFrame,
    totalFrames,
  };
};

const getWordWrapConfig = (options) => {
  return { ...wordWrapConfig, ...options };
};

const getImageDataSxOrSy = (oldWidthOrHeight, newWidthOrHeight) => {
  return oldWidthOrHeight / 2 - (newWidthOrHeight / 2);
};

module.exports = {
  getConfig,
  getWordWrapConfig,
  getImageDataSxOrSy,
};
