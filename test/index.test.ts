/* eslint-disable @typescript-eslint/no-var-requires */
jest.mock('globby');
const globby = require('globby');
jest.mock('fs-extra');
const fsExtra = require('fs-extra');

import { MDXExtendedLoaderOptions } from '@saschazar/mdx-extended-loader';
import { fs, vol } from 'memfs';

import mdxExtended from '../src/index';
import { NextConfig } from '../src/interfaces/nextConfig';

const nextConfig: NextConfig = {
  pageExtensions: ['mdx', 'md', 'tsx', 'ts'],
};

const options: MDXExtendedLoaderOptions = {
  extensions: nextConfig.pageExtensions,
  layoutsDir: 'layouts',
};

const withMDXExtended = mdxExtended(options);
const config = withMDXExtended(nextConfig);

describe('next-mdx-extended', () => {
  beforeAll(() => {
    const files = {
      './blog/2019-12-28_a-post.mdx':
        '---\nlayout: custom\nauthor: Sascha Zarhuber\nkeywords:\n  blog\n  post\n---\n\n A blog post',
      './blog/2019-12-29_a-new-post.mdx':
        '---\nlayout: custom\nauthor: Sascha Zarhuber\nkeywords:\n  blog\n  post\n---\n\n A new blog post',
    };

    vol.fromJSON(files, '/pages');

    globby.mockImplementation(() =>
      Promise.resolve(['2019-12-28_a-post.mdx', '2019-12-29_a-new-post.mdx']),
    );

    fsExtra.ensureDir.mockImplementation((path) =>
      Promise.resolve(fs.mkdirpSync(path)),
    );
    fsExtra.readFile.mockImplementation((url) =>
      Promise.resolve(fs.readFileSync(url)),
    );

    process.cwd = () => '/';
  });

  it('contains custom settings', () => {
    expect(config).toHaveProperty('pageExtensions', nextConfig.pageExtensions);
  });

  it('extracts path map correctly', async () => {
    const defaultPathMap = {};
    const directories = { dev: true, dir: '/' };

    const pathMap = await config.exportPathMap(defaultPathMap, directories);

    expect(pathMap).toHaveProperty('/blog/2019/a-post');
  });

  it('enables rewrites by default', async () => {
    expect(config).toHaveProperty('experimental');

    const rewrites = await config.experimental.rewrites();

    expect(rewrites).toHaveLength(2);
    expect(rewrites[0]).toHaveProperty('source', '/blog/2019/a-post');
  });
});
