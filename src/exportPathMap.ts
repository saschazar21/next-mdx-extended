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

/**
 * Parses the file URL for date and title
 * 
 * @param url - The URL to parse for date and title
 */
function parseDateAndTitle(url: string) {
  try {
    return parse(url);
  } catch (e) {
    console.error(e.message || e);
    return null;
  }
}

/**
 * Exports a PathMap (a set of Next.js-specific rewrite rules) using custom options
 * 
 * @param defaultPathMap - The default PathMap supplied by Next.js
 * @param directories - The directories object
 * @param options - The options for rewriting the blog post paths
 */
export default async function exportPathMap(
  defaultPathMap: PathMap,
  directories: PathMapDirectories,
  options: PathMapOptions = {},
): Promise<PathMap> {
  const { dir } = directories;
  const { blogDir = 'blog', format = '/blog/YYYY/[title]' } = options;
  const blogDirPath = join(dir, 'pages', blogDir);

  // rewrite blog post routes according to given format and store it into own object
  const posts = await glob(blogDirPath);
  const postsPathMap = await posts.reduce(
    async (
      processedPaths: Promise<PathMap>,
      post: string,
    ): Promise<PathMap> => {
      let url = resolve('/', blogDir, post);
      try {
        const parsedFilename = parseDateAndTitle(basename(post));
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

  // filter out the previously rewritten blog post routes
  const legacyPathMap = Object.keys(defaultPathMap).reduce((processed: PathMap, current: string): PathMap => {
    if (!current.includes(join('/', blogDir))) {
      return Object.assign({}, processed, { [current]: defaultPathMap[current] });
    }
    return processed;
  }, {} as PathMap);
  
  // merge the rewritten blog post routes with the filtered non-blog routes and return
  return Object.assign({}, legacyPathMap, postsPathMap);
}
