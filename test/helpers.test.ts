/* eslint-disable @typescript-eslint/no-var-requires */
jest.mock('globby');
const globby = require('globby');
jest.mock('fs-extra');
const fsExtra = require('fs-extra');

import { resolve } from 'path';
import { fs, vol } from 'memfs';

import glob from '../src/helpers/glob';
import parseFormat from '../src/helpers/parseFormat';
import writeData from '../src/helpers/writeData';

const mockedFiles = ['2019-12-28_a-post.mdx', '2019-12-29_a-new-post.mdx'];
const mockedUrl = resolve('pages', 'blog');

describe('Glob', () => {
  beforeAll(() => {
    globby.mockImplementation(url =>
      Promise.resolve(url === mockedUrl ? mockedFiles : []),
    );
    
    const files = {
      './blog/2019-12-28_a-post.mdx':
        '---\nlayout: custom\nauthor: Sascha Zarhuber\nkeywords:\n  blog\n  post\n---\n\n A blog post',
      './blog/2019-12-29_a-new-post.mdx':
        '---\nlayout: custom\nauthor: Sascha Zarhuber\nkeywords:\n  blog\n  post\n---\n\n A new blog post',
    };
    
    vol.fromJSON(files, '/pages');
  });

  it('finds MDX files in the given root directory', async () => {
    const paths = await glob(mockedUrl);

    expect(paths).toHaveLength(2);
    expect(paths).toEqual(mockedFiles);
  });

  it('throws an error, when no files are found', async () => {
    await expect(glob('somedir')).rejects.toThrowError();
  });
});

describe('ParseFormat', () => {
  it('successfully parses placeholders', () => {
    const format = '/[author]/YYYY/MM/[title]';
    const options = { date: '2019-12-30', title: 'Test Title', author: 'John Doe' };
    const outcome = '/john-doe/2019/12/test-title';
    
    expect(parseFormat(format, options)).toEqual(outcome);
  });
  
  it('throws Error when parsing invalid date format', () => {
    const options = { date: '20-12-29', title: 'a-title' };
    
    expect(() => parseFormat('/YYYY/[title]', options)).toThrowError();
  });
});

describe('WriteData', () => {
  beforeAll(() => {
    fsExtra.writeJson.mockImplementation((path, data, opts) => {
      const { spaces: space } = opts;
      const stringified = JSON.stringify(data, null, space);
      return Promise.resolve(fs.writeFileSync(path, stringified));
    });
    
    fsExtra.ensureDir.mockImplementation(path => Promise.resolve(fs.mkdirpSync(path)));
  });
  
  it('stores PathMap in /public folder', async () => {
    const pathMap = {
      '/': { page: '/' },
      '/blog/2019/a-post': { page: '/blog/2019-12-28_a-post' },
      '/blog/2019/a-new-post': { page: '/blog/2019-12-29_a-new-post' },
    };
    await writeData(pathMap, { dir: '/' });
    
    const result = fs.readFileSync('/public/posts.json', 'utf-8');
    const stringified = JSON.stringify(pathMap, null, 4);
    
    expect(result).toEqual(stringified);
  });
});
