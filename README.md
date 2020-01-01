[![Build Status](https://travis-ci.com/saschazar21/next-mdx-extended.svg?branch=master)](https://travis-ci.com/saschazar21/next-mdx-extended) [![npm version](https://badge.fury.io/js/%40saschazar%2Fnext-mdx-extended.png)](https://badge.fury.io/js/%40saschazar%2Fnext-mdx-extended) [![codecov](https://codecov.io/gh/saschazar21/next-mdx-extended/branch/dev/graph/badge.svg)](https://codecov.io/gh/saschazar21/next-mdx-extended)

# 📦 Next.js MDX extended plugin

> Easily wrap MDX pages in React components for Next.js

A [Next.js](https://nextjs.org) plugin for wrapping **Markdown/MDX** files in **React** components, with URL rewriting options.

## Features

This project was heavily influenced by [@next/mdx](https://github.com/zeit/next.js/tree/canary/packages/next-mdx) and of course [next-mdx-enhanced](https://github.com/hashicorp/next-mdx-enhanced).

The underlying standalone [Webpack](https://webpack.js.org/) loader may be found here: [@saschazar/mdx-extended-loader](https://github.com/saschazar21/mdx-extended-loader).

| **Features**                | `@saschazar/next-mdx-extended` | [`@next/mdx`](https://github.com/zeit/next.js/tree/canary/packages/next-mdx) |
| --------------------------- | ------------------------------ | ---------------------------------------------------------------------------- |
| `.md` files                 | ✔️                             | ✔️                                                                           |
| `.mdx` files                | ✔️                             | ✔️                                                                           |
| custom layouts              | ✔️                             | ✖️                                                                           |
| URL rewriting               | ✔️                             | ✖️                                                                           |
| extracting metadata to JSON | ✔️                             | ✖️                                                                           |

Given the following project tree:

```
MyApp
|
├─ pages
|  ├ index.jsx
|  ├ about.mdx
|  ├─ blog
|     ├ 2020-01-01_first-blog-post.mdx
|
├─ layouts
   ├ index.jsx
   ├ custom.jsx
```

Without any custom [options](#options), both `.mdx` files would be wrapped in `layouts/index.jsx` and the final HTML root would look like this:

```
├  index.html
├  about.html
├─ blog
   ├─ 2020
      ├ first-blog-post.html
```

## Installation

`yarn add @saschazar/next-mdx-extended`

or

`npm install --save @saschazar/next-mdx-extended`

(Of course, a working [Next.js](https://nextjs.org) environment is advised to be set up beforehand.)

## Usage

Create a `next.config.js` file in your project root:

```javascript
// next.config.js
const withMDXExtended = require('@saschazar/next-mdx-extended')();

module.exports = withMDXExtended({
  pageExtensions: ['mdx', 'md'],
});
```

This will assume:

- your layouts are placed in `./layouts`, with at least an `index.jsx` present, and
- your blog posts are placed in `./pages/blog`.

For customization or enhancement of the above parameters, check the [options](#options) section.

## Options

_Work in progress_

## Credits

Without [@next/mdx](https://github.com/zeit/next.js/tree/canary/packages/next-mdx) and [next-mdx-enhanced](https://github.com/hashicorp/next-mdx-enhanced), none of this would have happened, or at least in a very different way.

## License

Licensed under the MIT license.

Copyright ©️ 2020 [Sascha Zarhuber](https://github.com/saschazar21)
