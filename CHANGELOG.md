# [3.0.0](https://github.com/saschazar21/next-mdx-extended/compare/v2.0.0...v3.0.0) (2020-05-26)


### Features

* update to Next v9.4 ([88b8530](https://github.com/saschazar21/next-mdx-extended/commit/88b85309c2b24b4b0e9703e71442fc144ec42988))


### BREAKING CHANGES

* This solves compatibility issues with experimental rewrites in next.config.js

# [2.0.0](https://github.com/saschazar21/next-mdx-extended/compare/v1.1.0...v2.0.0) (2020-01-17)


### Features

* **feed:** refactored postsMeta to export JSON feed data, replaced 'exportData' with 'feed' as config key. ([21fd2bb](https://github.com/saschazar21/next-mdx-extended/commit/21fd2bbbb96dc905676cc1f2d643a0a33354e188))


### BREAKING CHANGES

* **feed:** The 'feed' config option has replaced the 'exportData' config option.
The option exports a '/public/feed.json' containing a JSON Feed instead of a '/public/posts.json' file.

# [1.1.0](https://github.com/saschazar21/next-mdx-extended/compare/v1.0.0...v1.1.0) (2020-01-05)


### Bug Fixes

* **exportPathMap:** improved error output ([705384f](https://github.com/saschazar21/next-mdx-extended/commit/705384f8aaa920836d9138089391f7bd47efc37d))
* **index:** removed target default ([ee15908](https://github.com/saschazar21/next-mdx-extended/commit/ee15908e488e10bffa97c6687d4c0fc84e339d44))
* **index:** set default target to server again ([8d5014d](https://github.com/saschazar21/next-mdx-extended/commit/8d5014d52bb922d99290611279147c6ebf3e13e7))


### Features

* **rewrites:** added rewrites to next config ([10162ee](https://github.com/saschazar21/next-mdx-extended/commit/10162ee68fd259b927ca8db56784c972b6e1ba7f))
* **rewrites:** moved exportData from exportPathMap to rewrites ([587a75b](https://github.com/saschazar21/next-mdx-extended/commit/587a75bc320fb8f2daad558428841a0cff3f6655))

# 1.0.0 (2020-01-03)


### Bug Fixes

* **exportPathMap:** fixed exports mapping in object, enhanced tests ([ed4aac8](https://github.com/saschazar21/next-mdx-extended/commit/ed4aac87f8c018c900b51fb1cab9c2dc17561eb3))
* **exportPathMap:** fixed path for posts meta ([fdfc739](https://github.com/saschazar21/next-mdx-extended/commit/fdfc73932b3df3c6088a30c65bf6f6f0cce67bba))
* **gitignore:** added generated types directory to gitignore ([f8db28f](https://github.com/saschazar21/next-mdx-extended/commit/f8db28f2b435fd2c6b37745ef05c5eadd470fbc1))
* **gitignore:** fixed typo ([b695c48](https://github.com/saschazar21/next-mdx-extended/commit/b695c48da04811e9ff651d1f4c2e92c946694110))
* **index:** provide fallback for omitted options object ([f179abc](https://github.com/saschazar21/next-mdx-extended/commit/f179abcda77d84240d5a2469e3a862b44171c1cb))
* **interfaces:** renamed interfaces directory ([052503b](https://github.com/saschazar21/next-mdx-extended/commit/052503b905b3107072ff80ae32a3472f0fe19265))
* **setup:** added default config values, enhanced README ([32558d3](https://github.com/saschazar21/next-mdx-extended/commit/32558d3c5f395916635feb00d958b1991247e0a6))
* **setup:** fixed dependecies in package.json ([8e672df](https://github.com/saschazar21/next-mdx-extended/commit/8e672dfcf75232a36321f3d778d18bb5f4b5c29f))
* **travis:** fixed travis configuration script ([f653c18](https://github.com/saschazar21/next-mdx-extended/commit/f653c187d6eb36e531345d303ee7f4b42042aedc))


### Features

* **exportPathMap:** added exportPathMap function ([2f57e90](https://github.com/saschazar21/next-mdx-extended/commit/2f57e90852ca3f96a30215c299a91ee463539f60))
* **exportPathMap:** extended functionality for exportPathMap ([1f9c368](https://github.com/saschazar21/next-mdx-extended/commit/1f9c3689c233c78de25eaeca84224f9ca89d0b8e))
* **semantic-release:** added semantic release config ([bb8f74f](https://github.com/saschazar21/next-mdx-extended/commit/bb8f74f13f598d502140af37fe64ad6bd0a77805))
* **setup:** added minimal setup ([047cea1](https://github.com/saschazar21/next-mdx-extended/commit/047cea127bee9fe91b1f51f46e0e48feddf6c689))
* **setup:** initial commit ([260551e](https://github.com/saschazar21/next-mdx-extended/commit/260551e733a598547fdf29334d13bafe9b94a408))
* **test:** added basic testing setup ([a18386b](https://github.com/saschazar21/next-mdx-extended/commit/a18386b8c4c85df963c11f75e800061b434843a3))
* **writeData:** added export metadata to JSON possibility ([c2c40ea](https://github.com/saschazar21/next-mdx-extended/commit/c2c40eaea61845145fb82d23915b722f6388da77))
