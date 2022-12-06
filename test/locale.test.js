'use strict';

const assert = require('assert');
const en = require('./fixtures/locale/en-US');
const locale = require('../src/locale');

describe('test/locale.test.js', () => {
  let __i18n;
  let result;
  describe('zh', () => {
    beforeEach(() => {
      __i18n = locale({
        en,
        useEn: () => false,
        transferFilter: (text) => {
          return text;
        },
      });
    });

    it('general text', () => {
      result = __i18n('这是一段普通的文本');
      assert.equal(result, '这是一段普通的文本');
    });

    it('text include interpolation string value', () => {
      result = __i18n('这段文本里含有{value}插值', {
        value: __i18n('特殊'),
      });
      assert.equal(result, '这段文本里含有特殊插值');
    });
  });

  describe('en', () => {
    beforeEach(() => {
      __i18n = locale({
        en,
        useEn: () => true,
        transferFilter: (text) => {
          return text;
        },
      });
    });

    it('general text', () => {
      result = __i18n('这是一段普通的文本');
      assert.equal(result, 'This is a normal text');
    });

    it('text include interpolation string value', () => {
      result = __i18n('这段文本里含有{value}插值', {
        value: __i18n('特殊'),
      });
      assert.equal(result, 'This text contains special interpolation');
    });
  });
});
