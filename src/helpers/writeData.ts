import { resolve } from 'path';
import { ensureDir, writeJson } from 'fs-extra';

import { PathMapDirectories } from 'interfaces/pathMap';
import { JsonFeed } from 'interfaces/jsonfeed';

/**
 * Writes the posts meta collection as JSON file to the 'public' directory, so that it might get requested using HTTP GET
 *
 * @param feed - The posts meta collection to write as a JSON file
 * @param directories - the directories object provided by Next.js
 */
export default function writeData(
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  feed: JsonFeed,
  directories: PathMapDirectories
): Promise<void> {
  const { dir } = directories;

  const publicDir = resolve(dir, 'public');

  return ensureDir(publicDir).then(() =>
    writeJson(resolve(publicDir, 'feed.json'), feed, { spaces: 4 })
  );
}
