const defaultOptions = {
  en: {},
  getLanguage: () => {
    return window.navigator.language;
  },
};

module.exports = (opts = {}) => {
  const options = {
    ...defaultOptions,
    ...opts,
  };
  const language = options.getLanguage();
  const { en: enMap } = options;
  return (...args) => {
    const key = args[0];
    if (language.startsWith('zh')) {
      return key;
    }
    return enMap[key];
  };
};
