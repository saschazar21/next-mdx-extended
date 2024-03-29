/* eslint-disable @typescript-eslint/no-var-requires */
jest.mock('globby');
const globby = require('globby');
jest.mock('fs-extra');
const fsExtra = require('fs-extra');

import { MDXExtendedLoaderOptions } from '@saschazar/mdx-extended-loader';
import { fs, vol } from 'memfs';

import mdxExtended from '../src/index';
import { NextConfig } from '../src/interfaces/nextConfig';

const feed = {
  version: 'https://jsonfeed.org/version/1',
  title: 'Unit tests for next-mdx-extended',
  // eslint-disable-next-line @typescript-eslint/camelcase
  home_page_url: 'https://github.com/saschazar21/next-mdx-extended',
};

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
      Promise.resolve(['2019-12-28_a-post.mdx', '2019-12-29_a-new-post.mdx'])
    );

    fsExtra.ensureDir.mockImplementation(path =>
      Promise.resolve(fs.mkdirpSync(path))
    );
    fsExtra.readFile.mockImplementation(url =>
      Promise.resolve(fs.readFileSync(url))
    );
    fsExtra.writeJson.mockImplementation((path, data, options) => {
      const { spaces } = options;
      const stringified = JSON.stringify(data, null, spaces);
      return Promise.resolve(fs.writeFileSync(path, stringified));
    });

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
    expect(config).toHaveProperty('rewrites');

    const rewrites = await config.rewrites();

    expect(rewrites).toHaveLength(2);
    expect(rewrites[0]).toHaveProperty('source', '/blog/2019/a-post');
  });

  it('exports JSON feed from rewrites by default', async () => {
    const postsMetaUrl = '/public/feed.json';
    const defaultPathMap = {};
    const directories = { dev: true, dir: '/' };
    const withMDXExtended = mdxExtended({ ...options, feed });
    const config = withMDXExtended(nextConfig);

    await config.exportPathMap(defaultPathMap, directories);

    expect(() => fs.readFileSync(postsMetaUrl, 'utf-8')).toThrowError(
      "ENOENT: no such file or directory, open '/public/feed.json'"
    );

    await config.rewrites();

    const postsMeta = JSON.parse(
      fs.readFileSync(postsMetaUrl, 'utf-8') as string
    );

    expect(postsMeta.items).toHaveLength(2);
    expect(postsMeta.items[0]).toHaveProperty('author', 'Sascha Zarhuber');
  });

  it('exports JSON feed from exportPathMap, when rewrites disabled', async () => {
    const postsMetaUrl = '/public/feed.json';
    const defaultPathMap = {};
    const directories = { dev: true, dir: '/' };
    const withMDXExtended = mdxExtended({
      ...options,
      enableRewrites: false,
      feed,
    });
    const config = withMDXExtended(nextConfig);

    await config.exportPathMap(defaultPathMap, directories);

    const postsMeta = JSON.parse(
      fs.readFileSync(postsMetaUrl, 'utf-8') as string
    );

    expect(postsMeta.items).toHaveLength(2);
    expect(postsMeta.items[0]).toHaveProperty('author', 'Sascha Zarhuber');
  });
});
