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

describe('ExportPathMap', () => {
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
    fsExtra.writeJson.mockImplementation((path, data, options) => {
      const { spaces } = options;
      const stringified = JSON.stringify(data, null, spaces);
      return Promise.resolve(fs.writeFileSync(path, stringified));
    });
  });

  it('handles paths using defaults', async () => {
    const paths = await exportPathMap(defaultPathMap, directories);
    expect(paths).toHaveProperty('/blog/2019/a-post', {
      page: '/blog/2019-12-28_a-post',
    });
  });

  it('handles paths using custom settings', async () => {
    const paths = await exportPathMap(defaultPathMap, directories, {
      format: '/posts/[author]/YYYY/MM/[title]',
    });
    expect(paths).toHaveProperty('/posts/sascha-zarhuber/2019/12/a-new-post', {
      page: '/blog/2019-12-29_a-new-post',
    });
  });

  it('stores posts.json to /public folder', async () => {
    await exportPathMap(defaultPathMap, directories, { exportData: true });

    const posts = fs.readFileSync('/public/posts.json', 'utf-8') as string;
    const parsed = JSON.parse(posts);

    expect(Array.isArray(parsed)).toBeTruthy();
    expect(parsed).toHaveLength(2);
    expect(parsed[0]).toHaveProperty('author', 'Sascha Zarhuber');
    expect(parsed[1]).toHaveProperty('url', '/blog/2019/a-new-post');
  });
});

describe('ExportPathMap fails', () => {
  beforeAll(() => {
    const files = {
      './blog/19-12-28_a-post.mdx':
        '---\nlayout: custom\nauthor: Sascha Zarhuber\nkeywords:\n  blog\n  post\n---\n\n A blog post',
      './blog/19-12-29_a-new-post.mdx':
        '---\nlayout: custom\nauthor: Sascha Zarhuber\nkeywords:\n  blog\n  post\n---\n\n A new blog post',
    };

    vol.fromJSON(files);

    globby.mockImplementation(() =>
      Promise.resolve(['19-12-28_a-post.mdx', '19-12-29_a-new-post.mdx']),
    );
    fsExtra.readFile.mockImplementation((url) => Promise.resolve(url));
  });

  it('when parsing format with invalid data', async () => {
    console.error = jest.fn();
    const paths = await exportPathMap(defaultPathMap, directories);

    expect(paths).toHaveProperty('/blog/19-12-29_a-new-post', {
      page: '/blog/19-12-29_a-new-post',
    });
    expect(console.error).toHaveBeenCalled();
  });
});
