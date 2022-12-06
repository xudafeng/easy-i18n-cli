'use strict';

const defaultOptions = {
  en: {},
  useEn: () => false,
  transferFilter: (value) => value, // custom transfer
  outputFilter: (list) => list.join(''), // custom output
};

/**
 * multiple scenes ending
 * e.g. __('text#sceneA') -> 'text'} 
 */
function resolveMultiScenes(value) {
  return value.replace(/#\w*$/, '');
}

/**
 * resolve i18n text
 * @param {string} text
 * @param {Object} replaceValueMap
 * @param {Object} options
 * @return {any[]}
 */
const resolveI18nText = (text, replaceValueMap = {}, options) => {
  const {
    en: enMap,
    useEn,
    transferFilter,
  } = options;
  if (useEn(options)) {
    text = enMap[text] || text;
  }

  let str = transferFilter(text, replaceValueMap);

  str = resolveMultiScenes(str);

  const result = [];
  const originStr = str;

  // interpolate value, return fragment list
  // e.g. __('{key1} {key2}', { key1: 'Hello', key2: <div>World</div> })
  // return ['Hello', <div>World</div>]
  let index = 0;

  str.replace(/\{(\w*)\}/g, (matched, matchedKey, offset) => {
    result.push(originStr.substring(index, offset));
    index = offset + matched.length;

    let key = matchedKey.trim();
    if (!key) {
      return '';
    }

    if (key.match(/^\d+$/)) {
      key = parseInt(key, 10);
    }

    const value = replaceValueMap[key];
    if (typeof value === 'undefined') {
      result.push(matched);
      return matched;
    }

    result.push(value);
    return '';
  });

  // ending fragment e.g. ['Hi {name}. I like your {cat}, so cute']
  // ending fragment is ', so cute'
  // fragment list is ['Hi', 'name', '. I like your ', 'cat', ', so cute']
  if (index < originStr.length) {
    result.push(originStr.substring(index));
  }

  return options.outputFilter(result);
};

/**
 * @callback transferFilter
 * @param {string} text
 * @param {Object} replaceValueMap
 * @return {string} e.g. return text.replace(REG, (matches) => { ... })
 */

/**
 * @callback i18n
 * @param {string} text
 * @param {Object} replaceValueMap
 * @return {any[]}
 */

/**
 * @param {Object} opts
 * @param {Object} opts.en
 * @param {boolean} opts.useEn
 * @param {transferFilter} opts.transferFilter
 * @return {i18n}
 */
module.exports = (opts = {}) => {
  const options = {
    ...defaultOptions,
    ...opts,
  };

  return (...args) => {
    const text = args[0];
    const replaceValueMap = args[1];

    return resolveI18nText(text, replaceValueMap, options);
  };
};
