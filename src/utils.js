const Utils = {};

Utils.noCacheRequire = function (resolvedPath) {
  delete require.cache[resolvedPath];
  return require(resolvedPath);
};

module.exports = Utils;
