/* eslint-disable @typescript-eslint/no-var-requires */
jest.mock('globby');
const globby = require('globby');
jest.mock('fs-extra');
const fsExtra = require('fs-extra');

import { fs, vol } from 'memfs';

import { PathMapOptions } from '../src/interfaces/pathMap';
import rewrites from '../src/rewrites';

const options: PathMapOptions = {
  blogDir: 'blog',
  format: '/blog/YYYY/MM/[author]/[title]',
};

describe('Rewrites', () => {
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

  it('returns rewrite rules using default options', async () => {
    const rules = await rewrites({});

    expect(rules).toHaveLength(2);
    expect(rules[0]).toHaveProperty('source', '/blog/2019/a-post');
  });

  it('returns rewrite rules using custom options', async () => {
    const rules = await rewrites(options);

    expect(rules).toHaveLength(2);
    expect(rules[0]).toHaveProperty(
      'source',
      '/blog/2019/12/sascha-zarhuber/a-post',
    );
  });
});
