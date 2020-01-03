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
| URL rewriting               | ✔️ (only using `next export`)  | ✖️                                                                           |
| extracting metadata to JSON | ✔️ (only using `next export`)  | ✖️                                                                           |

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

⚠️ **CAUTION**: The URL rewriting functionality of this plugin only has an effect, when the project is exported via `next export`. More information in the [Next.js docs](https://nextjs.org/docs/api-reference/next.config.js/exportPathMap). Same goes for the [`exportData`](#exportdata) option.

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
  pageExtensions: ['mdx', 'md']
});
```

This will assume:

- your layouts are placed in `./layouts`, with at least an `index.jsx` present, and
- your blog posts are placed in `./pages/blog`.

For customization or enhancement of the above parameters, check the [options](#options) section.

## Options

The following options are all optional, and most of them are having default values set:

### `exportData`

> `boolean` | optional | default: `false`

Whether to export a `posts.json` file containing metadata about the blog posts to `./public` (e.g. for fetching data about blog posts via the `async getInitialProps()` hook). Unset by default (and therefore not exported).

⚠️ **TL/DR**: Whenever activated, it creates a `posts.json` file in your `./public` folder, which might cause unwanted side-effects in your git setup!

### `blogDir`

> `string` | optional | default: `blog`

The directory to look for blog posts for rewriting the paths for. Only filenames in this directory (incl. sub-directories) are getting parsed, whereas other `.md`/`.mdx` files are getting transformed into JavaScript as well, but will be served under their initial filename as URL.

### `format`

> `string` | optional | default: `/blog/YYYY/[title]`

The definition after how to rewrite the blog post URLs. Possible values are:

- `YYYY`: The full year, e.g. `2020` (parsed from file name).
- `MM`: The month, e.g. `01` (parsed from file name).
- `DD`: The date, e.g. `02` (parsed from file name).
- `[title]`: Any string wrapped in square brackets will be replaced by its value from the frontmatter metadata. If no such key is found in the metadata, the placeholder gets deleted from the final URL path. `[title]` refers to the second half of the filename primarily, after the date was parsed, but might as well be replaced by setting the according value in the frontmatter.

**Example**: `/[author]/YYYY/MM/[title]` expects an `author` key in the frontmatter metadata. If no `title` key is present in the metadata, the parsed title from the filename will be used.

### `extensions`

> `array` | optional | default: `pageExtensions` from the [Next.js configuration](https://nextjs.org/docs/api-reference/next.config.js/custom-page-extensions)

The expected file suffixes of the layout files in the [`layoutsDir`](#layoutsdir) directory.

### `layoutsDir`

> `string` | optional | default: `layouts`

The name of the directory (relative to the project root) for where to find the React components, which should later be wrapped around the `.md`/`.mdx` files.

### Other options

As this project acts as a superior Next.js plugin wrapper for both [@mdx-js/loader](https://github.com/mdx-js/mdx) and [@saschazar/mdx-extended-loader](https://github.com/saschazar21/mdx-extended-loader), the options object also takes specific options for those projects.

Please see both repository pages for additional options documentations, (e.g. `mdPlugins`, `hastPlugins`).

## Credits

Without [MDX](https://mdxjs.com/), [@next/mdx](https://github.com/zeit/next.js/tree/canary/packages/next-mdx) and [next-mdx-enhanced](https://github.com/hashicorp/next-mdx-enhanced), none of this would have happened, or at least in a very different way.

Also, I got inspired a lot by @mxstbr's [website respository](https://github.com/mxstbr/mxstbr.com) concerning the `exportPathMap` functionality.

## License

Licensed under the MIT license.

Copyright ©️ 2020 [Sascha Zarhuber](https://github.com/saschazar21)
