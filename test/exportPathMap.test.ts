/* eslint-disable @typescript-eslint/no-var-requires */
jest.mock('globby');
const globby = require('globby');
jest.mock('fs-extra');
const fsExtra = require('fs-extra');
import { fs, vol } from 'memfs';

import pkg from '../package.json';
import exportPathMap from '../src/exportPathMap';

const defaultPathMap = {
  '/': { page: '/' },
  '/about': { page: '/about' },
  '/blog/2019-12-28_a-post': { page: '/blog/2019-12-28_a-post' }
};
const directories = { dev: true, dir: '/' };

jest.setTimeout(10000);

describe('ExportPathMap', () => {
  beforeAll(() => {
    const files = {
      '/package.json': JSON.stringify(pkg),
      '/pages/blog/2019-12-28_a-post.mdx':
        '---\nlayout: custom\nauthor: Sascha Zarhuber\nkeywords:\n  blog\n  post\n---\n\n A blog post',
      '/pages/blog/2019-12-29_a-new-post.mdx':
        '---\nlayout: custom\nauthor: Sascha Zarhuber\nkeywords:\n  blog\n  post\n---\n\n A new blog post'
    };

    vol.fromJSON(files);

    globby.mockImplementation(() =>
      Promise.resolve(['2019-12-28_a-post.mdx', '2019-12-29_a-new-post.mdx'])
    );

    fsExtra.ensureDir.mockImplementation(path =>
      Promise.resolve(fs.mkdirpSync(path))
    );
    fsExtra.readFile.mockImplementation(url =>
      Promise.resolve(fs.readFileSync(url, 'utf-8'))
    );
    fsExtra.readJson.mockImplementation(url => {
      const contents = fs.readFileSync(url, 'utf-8') as string;
      try {
        const jsonContents = JSON.parse(contents);
        return Promise.resolve(jsonContents);
      } catch (e) {
        return Promise.reject(e);
      }
    });
    fsExtra.writeJson.mockImplementation((path, data, options) => {
      const { spaces } = options;
      const stringified = JSON.stringify(data, null, spaces);
      return Promise.resolve(fs.writeFileSync(path, stringified));
    });
  });

  it('handles paths using defaults', async () => {
    const paths = await exportPathMap(defaultPathMap, directories);
    expect(paths).toHaveProperty('/blog/2019/a-post', {
      page: '/blog/2019-12-28_a-post'
    });
  });

  it('handles paths using custom settings', async () => {
    const paths = await exportPathMap(defaultPathMap, directories, {
      format: '/posts/[author]/YYYY/MM/[title]'
    });
    expect(paths).toHaveProperty('/posts/sascha-zarhuber/2019/12/a-new-post', {
      page: '/blog/2019-12-29_a-new-post'
    });
  });

  it('stores feed.json to /public folder', async () => {
    await exportPathMap(defaultPathMap, directories, {
      feed: {
        // eslint-disable-next-line @typescript-eslint/camelcase
        home_page_url: 'https://sascha.work'
      }
    });

    const posts = fs.readFileSync('/public/feed.json', 'utf-8') as string;
    const parsed = JSON.parse(posts);

    expect(Array.isArray(parsed.items)).toBeTruthy();
    expect(parsed.items).toHaveLength(2);
    expect(parsed.items[0]).toHaveProperty('author', 'Sascha Zarhuber');
    expect(parsed.items[1]).toHaveProperty('id', '/blog/2019/a-new-post');
    expect(parsed).toHaveProperty('description', pkg.description);
    expect(parsed).toHaveProperty('home_page_url', 'https://sascha.work');
  });
});

describe('ExportPathMap fails', () => {
  beforeAll(() => {
    const files = {
      './blog/19-12-28_a-post.mdx':
        '---\nlayout: custom\nauthor: Sascha Zarhuber\nkeywords:\n  blog\n  post\n---\n\n A blog post',
      './blog/19-12-29_a-new-post.mdx':
        '---\nlayout: custom\nauthor: Sascha Zarhuber\nkeywords:\n  blog\n  post\n---\n\n A new blog post'
    };

    vol.fromJSON(files);

    globby.mockImplementation(() =>
      Promise.resolve(['19-12-28_a-post.mdx', '19-12-29_a-new-post.mdx'])
    );
    fsExtra.readFile.mockImplementation(url => Promise.resolve(url));
    fsExtra.readJson.mockImplementation(path => {
      const jsonfile = fs.readFileSync(path, 'utf-8') as string;
      try {
        const obj = JSON.parse(jsonfile);
        return Promise.resolve(obj);
      } catch (e) {
        return Promise.reject(e);
      }
    });
  });

  it('when parsing format with invalid data', async () => {
    console.error = jest.fn();
    const paths = await exportPathMap(defaultPathMap, directories);

    expect(paths).toHaveProperty('/blog/19-12-29_a-new-post', {
      page: '/blog/19-12-29_a-new-post'
    });
    expect(console.error).toHaveBeenCalled();
  });
});
