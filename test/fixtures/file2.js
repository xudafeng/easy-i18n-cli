'use strict';

module.exports = () => {
  const text = __i18n('测试4') || __i18n('测试5');
  const text2 = __i18n('测试3和{foo}', { foo: text });
  console.log(text2);
};
