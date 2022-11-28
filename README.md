# easy-i18n-cli

[![NPM version][npm-image]][npm-url]
[![CI][ci-image]][ci-url]
[![Test coverage][codecov-image]][codecov-url]
[![node version][node-image]][node-url]
[![npm download][download-image]][download-url]

[npm-image]: https://img.shields.io/npm/v/easy-i18n-cli.svg
[npm-url]: https://npmjs.org/package/easy-i18n-cli
[ci-image]: https://github.com/xudafeng/easy-i18n-cli/actions/workflows/ci.yml/badge.svg
[ci-url]: https://github.com/xudafeng/easy-i18n-cli/actions/workflows/ci.yml`
[codecov-image]: https://img.shields.io/codecov/c/github/xudafeng/easy-i18n-cli.svg?logo=codecov
[codecov-url]: https://codecov.io/gh/xudafeng/easy-i18n-cli
[node-image]: https://img.shields.io/badge/node.js-%3E=_8-green.svg
[node-url]: http://nodejs.org/download/
[download-image]: https://img.shields.io/npm/dm/easy-i18n-cli.svg
[download-url]: https://npmjs.org/package/easy-i18n-cli

> i18n cli

## Installment

```bash
$ npm i easy-i18n-cli --save-dev
```

## Configuraion

```javascript
// i18n.config.js
module.exports = {
  srcDirs: [
    'test/fixtures/**/*.*',
  ],
  distDir: __dirname,
  tokenName: '__i18n',
};
```

```
...
  "translate": "easy-i18n-cli -c ./i18n.config.js",
  "translate:check": "npm run translate -- --check",
...
```

## License

The MIT License (MIT)
