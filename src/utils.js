const Utils = {};

Utils.noCacheRequire = function (resolvedPath) {
  delete require.cache[resolvedPath];
  return require(resolvedPath);
};

Utils.extractLocaleFromExport = function (data) {
  // 处理各类场景下的 i18n 数据
  const exportValue = data.default || data;
  const firstValue = Object.values(exportValue)[0];

  if (typeof firstValue === 'object') {
    return firstValue;
  }

  return exportValue;
};

module.exports = Utils;
