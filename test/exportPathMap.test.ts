/* eslint-disable @typescript-eslint/no-var-requires */
jest.mock('globby');
const globby = require('globby');
jest.mock('fs-extra');
const fsExtra = require('fs-extra');
import { fs, vol } from 'memfs';

import exportPathMap from '../src/exportPathMap';

const defaultPathMap = {
  '/': { page: '/' },
  '/about': { page: '/about' },
  '/blog/2019-12-28_a-post': { page: '/blog/2019-12-28_a-post' },
};
const directories = { dev: true, dir: '/' };

jest.setTimeout(10000);

describe('exportPathMap', () => {
  beforeAll(() => {
    const files = {
      './blog/2019-12-28_a-post.mdx':
        '---\nlayout: custom\nauthor: Sascha Zarhuber\nkeywords:\n  blog\n  post\n---\n\n A blog post',
      './blog/2019-12-29_a-new-post.mdx':
        '---\nlayout: custom\nauthor: Sascha Zarhuber\nkeywords:\n  blog\n  post\n---\n\n A new blog post',
    };

    vol.fromJSON(files, '/pages');
  });

  beforeEach(() => {
    jest.resetModules();
  });

  it('handles paths using defaults', async () => {
    globby.mockImplementation(() =>
      Promise.resolve(['2019-12-28_a-post.mdx', '2019-12-29_a-new-post.mdx']),
    );
    fsExtra.readFile.mockImplementation(url =>
      Promise.resolve(fs.readFileSync(url)),
    );
    const paths = await exportPathMap(defaultPathMap, directories);
    expect(paths).toHaveProperty('/blog/2019/a-post', {
      page: '/blog/2019-12-28_a-post',
    });
  });
});
