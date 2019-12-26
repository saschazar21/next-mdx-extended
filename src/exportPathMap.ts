import { basename, join, resolve } from 'path';
import { readFile } from 'fs-extra';
import matter from 'gray-matter';
import parse from '@saschazar/mdx-extended-loader/parser';

import {
  PathMap,
  PathMapDirectories,
  PathMapOptions,
} from 'interfaces/pathMap';
import glob from 'helpers/glob';
import parseFormat from 'helpers/parseFormat';

function parseDateAndTitle(url: string) {
  try {
    return parse(url);
  } catch (e) {
    console.error(e.message || e);
    return null;
  }
}

export default async function exportPathMap(
  defaultPathMap: PathMap,
  directories: PathMapDirectories,
  options: PathMapOptions = {},
): Promise<PathMap> {
  const { dir } = directories;
  const { blogDir = 'blog', format = '/blog/YYYY/[title]' } = options;
  const blogDirPath = join(dir, 'pages', blogDir);

  const posts = await glob(blogDirPath);
  const postsPathMap = await posts.reduce(
    async (
      processedPaths: Promise<PathMap>,
      post: string,
    ): Promise<PathMap> => {
      let url = resolve('/', blogDir, post);
      try {
        const parsedFilename = parse(basename(post));
        const postContents = await readFile(join(blogDirPath, post), 'utf-8');
        const { data } = matter(postContents);
        url = parseFormat(format, Object.assign({}, parsedFilename, data));
      } catch (e) {
        console.error(e);
      }

      return Object.assign({}, processedPaths, {
        [join('/', blogDir, post)]: url,
      });
    },
    Promise.resolve({} as PathMap),
  );

  // TODO: continue working from here!
  return Object.assign({}, defaultPathMap, postsPathMap);
}
