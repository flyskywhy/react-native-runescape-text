const config = require("../config");
const wordWrapConfig = require("../wordWrapConfig");

const getConfig = (options) => {
  let obj = { ...options };
  Object.keys(obj).forEach(key => obj[key] === undefined && delete obj[key])
  const merged = { ...config, ...obj };
  const delayPerFrame = 1000 / merged.fps;
  const totalFrames = Math.round(merged.cycleDuration / delayPerFrame);

  return {
    ...merged,
    delayPerFrame,
    totalFrames,
  };
};

const getWordWrapConfig = (options) => {
  let obj = { ...options };
  Object.keys(obj).forEach(key => obj[key] === undefined && delete obj[key])
  return { ...wordWrapConfig, ...obj };
};

const getImageDataSxOrSy = (oldWidthOrHeight, newWidthOrHeight) => {
  return oldWidthOrHeight / 2 - (newWidthOrHeight / 2);
};

module.exports = {
  getConfig,
  getWordWrapConfig,
  getImageDataSxOrSy,
};
