# `@aegisjsproject/url`

Safe URL parsing/escaping via JS tagged templates

[![CodeQL](https://github.com/AegisJSProject/url/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/AegisJSProject/url/actions/workflows/codeql-analysis.yml)
![Node CI](https://github.com/AegisJSProject/url/workflows/Node%20CI/badge.svg)
![Lint Code Base](https://github.com/AegisJSProject/url/workflows/Lint%20Code%20Base/badge.svg)

[![GitHub license](https://img.shields.io/github/license/AegisJSProject/url.svg)](https://github.com/AegisJSProject/url/blob/master/LICENSE)
[![GitHub last commit](https://img.shields.io/github/last-commit/AegisJSProject/url.svg)](https://github.com/AegisJSProject/url/commits/master)
[![GitHub release](https://img.shields.io/github/release/AegisJSProject/url?logo=github)](https://github.com/AegisJSProject/url/releases)
[![GitHub Sponsors](https://img.shields.io/github/sponsors/shgysk8zer0?logo=github)](https://github.com/sponsors/shgysk8zer0)

[![npm](https://img.shields.io/npm/v/@aegisjsproject/url)](https://www.npmjs.com/package/@aegisjsproject/url)
![node-current](https://img.shields.io/node/v/@aegisjsproject/url)
![npm bundle size gzipped](https://img.shields.io/bundlephobia/minzip/@aegisjsproject/url)
[![npm](https://img.shields.io/npm/dw/@aegisjsproject/url?logo=npm)](https://www.npmjs.com/package/@aegisjsproject/url)

[![GitHub followers](https://img.shields.io/github/followers/shgysk8zer0.svg?style=social)](https://github.com/shgysk8zer0)
![GitHub forks](https://img.shields.io/github/forks/AegisJSProject/url.svg?style=social)
![GitHub stars](https://img.shields.io/github/stars/AegisJSProject/url.svg?style=social)
[![Twitter Follow](https://img.shields.io/twitter/follow/shgysk8zer0.svg?style=social)](https://twitter.com/shgysk8zer0)

[![Donate using Liberapay](https://img.shields.io/liberapay/receives/shgysk8zer0.svg?logo=liberapay)](https://liberapay.com/shgysk8zer0/donate "Donate using Liberapay")
- - -

- [Code of Conduct](./.github/CODE_OF_CONDUCT.md)
- [Contributing](./.github/CONTRIBUTING.md)
<!-- - [Security Policy](./.github/SECURITY.md) -->

## Installation

```bash
npm i @aegisjsproject/url
```

## Usage

```js
import { url } from '@aegisjsproject/url';

// Santize user input (encodes and escapes as necessary)
const url1 = url`https://example.com/${userInput}`;
const url2 = url`${location.origin}/path/${someVar}`;

// Create a `blob:` URI from a file
const file = new File(['Hello, World!'], hi.txt, { type: 'text/plain' });
const download = `<a href="${url`file`}" download="${file.name}">Download File</a>`;
```
