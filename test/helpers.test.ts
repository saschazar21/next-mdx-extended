/* eslint-disable @typescript-eslint/no-var-requires */
jest.mock('globby');
const globby = require('globby');
jest.mock('fs-extra');
const fsExtra = require('fs-extra');

import { resolve } from 'path';
import { vol } from 'memfs';

import glob from '../src/helpers/glob';

const mockedFiles = ['2019-12-28_a-post.mdx', '2019-12-29_a-new-post.mdx'];
const mockedUrl = resolve('pages', 'blog');

describe('Glob', () => {
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
    globby.mockImplementation(url =>
      Promise.resolve(url === mockedUrl ? mockedFiles : []),
    );
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
