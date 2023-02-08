# easy-i18n-cli2

[![NPM version][npm-image]][npm-url]
[![CI][ci-image]][ci-url]
[![Test coverage][codecov-image]][codecov-url]
[![node version][node-image]][node-url]
[![npm download][download-image]][download-url]

[npm-image]: https://img.shields.io/npm/v/easy-i18n-cli2.svg
[npm-url]: https://npmjs.org/package/easy-i18n-cli2
[ci-image]: https://github.com/xudafeng/easy-i18n-cli2/actions/workflows/ci.yml/badge.svg
[ci-url]: https://github.com/xudafeng/easy-i18n-cli2/actions/workflows/ci.yml
[codecov-image]: https://img.shields.io/codecov/c/github/xudafeng/easy-i18n-cli2.svg?logo=codecov
[codecov-url]: https://codecov.io/gh/xudafeng/easy-i18n-cli2
[node-image]: https://img.shields.io/badge/node.js-%3E=_8-green.svg
[node-url]: http://nodejs.org/download/
[download-image]: https://img.shields.io/npm/dm/easy-i18n-cli2.svg
[download-url]: https://npmjs.org/package/easy-i18n-cli2

> i18n cli

## Installment

```bash
$ npm i easy-i18n-cli2 --save-dev
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
  "translate": "easy-i18n-cli2 -c ./i18n.config.js",
  "translate:check": "npm run translate -- --check",
...
```
## Use web modules

```javascript
import locale from 'easy-i18n-cli2/src/locale';
import enObj from './en-US';

export const __i18n = locale({
  en: enObj,
  useEn: () => true,
});
```

## Use APIS

```bash
$ ./bin/easy-i18n-cli2.js -c ./google-translate.config.js
```

<!-- GITCONTRIBUTOR_START -->

## Contributors

|[<img src="https://avatars.githubusercontent.com/u/1011681?v=4" width="100px;"/><br/><sub><b>xudafeng</b></sub>](https://github.com/xudafeng)<br/>|[<img src="https://avatars.githubusercontent.com/u/52845048?v=4" width="100px;"/><br/><sub><b>snapre</b></sub>](https://github.com/snapre)<br/>|[<img src="https://avatars.githubusercontent.com/u/12947068?v=4" width="100px;"/><br/><sub><b>ilimei</b></sub>](https://github.com/ilimei)<br/>|
| :---: | :---: | :---: |


This project follows the git-contributor [spec](https://github.com/xudafeng/git-contributor), auto updated at `Wed Feb 01 2023 17:48:43 GMT+0800`.

<!-- GITCONTRIBUTOR_END -->

## License

The MIT License (MIT)
