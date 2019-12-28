import { basename, extname, join, resolve } from 'path';
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
import writeData from 'helpers/writeData';

/**
 * Parses the file URL for date and title
 *
 * @param url - The URL to parse for date and title
 */
function parseDateAndTitle(
  url: string,
): { date: string; title: string } | null {
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
  const { dir } = directories; // get the CWD
  const {
    blogDir = 'blog',
    exportData,
    format = '/blog/YYYY/[title]',
  } = options; // set default values to the options
  const blogDirPath = join(dir, 'pages', blogDir); // get the URL of the blog post directory

  // rewrite blog post routes according to given format and store it into own object
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  const postsMeta: { [key: string]: any }[] = [];
  const posts = await glob(blogDirPath);
  const postsPathMap = await posts.reduce(
    async (
      processedPaths: Promise<PathMap>,
      post: string,
    ): Promise<PathMap> => {
      let url = join('/', blogDir, post);
      try {
        const parsedFilename = parseDateAndTitle(basename(post)); // attempt to parse date and title from the filename
        const postContents = await readFile(
          resolve(blogDirPath, post),
          'utf-8',
        ); // read the file contents
        const { data } = matter(postContents); // parse the frontmatter
        const meta = Object.assign({}, parsedFilename, data);
        url = parseFormat(format, meta); // replace the placeholders in the format with the actual values
        postsMeta.push(
          Object.assign({}, meta, { __filepath: join('/', blogDir, url) }),
        );
      } catch (e) {
        console.error(e);
      }

      // add the rewritten path to the PathMap
      return Object.assign({}, await processedPaths, {
        [join('/', url)]: {
          page: join('/', blogDir, basename(post, extname(post))),
        },
      });
    },
    Promise.resolve({} as PathMap),
  );

  // filter out the previously rewritten blog post routes
  const legacyPathMap = Object.keys(defaultPathMap).reduce(
    (processed: PathMap, current: string): PathMap => {
      if (!current.includes(join('/', blogDir))) {
        return Object.assign({}, processed, {
          [current]: defaultPathMap[current],
        });
      }
      return processed;
    },
    {} as PathMap,
  );

  exportData && (await writeData(postsMeta, directories));

  // merge the rewritten blog post routes with the filtered non-blog routes and return
  return Object.assign({}, legacyPathMap, postsPathMap);
}
