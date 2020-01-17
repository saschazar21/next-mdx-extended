import { basename, extname, join, resolve } from 'path';
import { readFile, readJson } from 'fs-extra';
import matter from 'gray-matter';
import parse from '@saschazar/mdx-extended-loader/parser';

import {
  PathMap,
  PathMapDirectories,
  PathMapOptions
} from 'interfaces/pathMap';
import glob from 'helpers/glob';
import mapFeedItemData from 'helpers/mapFeedItemData';
import parseFormat from 'helpers/parseFormat';
import writeData from 'helpers/writeData';
import { JsonFeedItem } from 'interfaces/jsonfeed';

/**
 * Parses the file URL for date and title
 *
 * @param url - The URL to parse for date and title
 */
function parseDateAndTitle(
  url: string
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
  options: PathMapOptions = {}
): Promise<PathMap> {
  const { dir } = directories; // get the CWD
  const { blogDir = 'blog', feed, format = '/blog/YYYY/[title]' } = options; // set default values to the options
  const blogDirPath = join(dir, 'pages', blogDir); // get the URL of the blog post directory

  // rewrite blog post routes according to given format and store it into own object
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  const items: JsonFeedItem[] = [];
  const posts = await glob(blogDirPath);
  const postsPathMap = await posts.reduce(
    async (
      processedPaths: Promise<PathMap>,
      post: string
    ): Promise<PathMap> => {
      let url = join('/', blogDir, basename(post, extname(post)));
      try {
        const parsedFilename = parseDateAndTitle(basename(post)); // attempt to parse date and title from the filename
        const postContents = await readFile(
          resolve(blogDirPath, post),
          'utf-8'
        ); // read the file contents
        const { content, data } = matter(postContents); // parse the frontmatter
        const meta = Object.assign({}, parsedFilename, data);
        url = parseFormat(format, meta); // replace the placeholders in the format with the actual values
        const postMeta = Object.assign({}, meta, { url: join('/', url) });
        items.push(
          await mapFeedItemData(Object.assign({}, postMeta, { content }))
        );
      } catch (e) {
        console.error(post, ':\n', e.message || e);
      }

      // add the rewritten path to the PathMap
      return Object.assign({}, await processedPaths, {
        [join('/', url)]: {
          page: join('/', blogDir, basename(post, extname(post)))
        }
      });
    },
    Promise.resolve({} as PathMap)
  );

  // filter out the previously rewritten blog post routes
  const legacyPathMap = Object.keys(defaultPathMap).reduce(
    (processed: PathMap, current: string): PathMap => {
      if (!current.includes(join('/', blogDir))) {
        return Object.assign({}, processed, {
          [current]: defaultPathMap[current]
        });
      }
      return processed;
    },
    {} as PathMap
  );

  // populate feed with default values, then merge with custom data and store in public folder
  if (feed && typeof feed === 'object') {
    let feedData = Object.assign(
      {},
      { version: 'https://jsonfeed.org/version/1' },
      feed
    );
    try {
      const pkg = await readJson(join(dir, 'package.json'));
      feedData = Object.assign(
        {},
        {
          title: pkg.name,
          // eslint-disable-next-line @typescript-eslint/camelcase
          home_page_url: pkg.homepage || pkg.repository,
          description: pkg.description,
          author: pkg.author
        },
        feedData
      );
    } catch (e) {
      console.warn(
        `Warning: could not populate JSON feed with package.json data:\n${e.message ||
          e}`
      );
    } finally {
      await writeData(Object.assign({}, feedData, { items }), directories);
    }
  }

  // merge the rewritten blog post routes with the filtered non-blog routes and return
  return Object.assign({}, legacyPathMap, postsPathMap);
}
