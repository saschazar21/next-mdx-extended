import { join } from 'path';

import exportPathMap from 'exportPathMap';
import { RewriteRule } from 'interfaces/rewriteRule';
import {
  PathMap,
  PathMapDirectories,
  PathMapOptions,
} from 'interfaces/pathMap';

export const BUILD_ID_PLACEHOLDER = 'BUILD_ID_PLACEHOLDER';

/**
 * Creates a set of rewrite rules based on the exportPathMap functionality.
 * Makes use of the latest experimental rewrites() configuration option.
 *
 * @param options - The options for the exportPathMap function
 */
export default async function rewrites(
  options: PathMapOptions,
): Promise<RewriteRule[]> {
  const defaultPathMap: PathMap = {};
  const directories: PathMapDirectories = {
    dev: process.env.NODE_ENV !== 'production',
    dir: process.cwd(),
    distDir: join(process.cwd(), '.next'),
    outDir: join(process.cwd(), 'out'),
    buildId: BUILD_ID_PLACEHOLDER,
  };

  const pathMap = await exportPathMap(defaultPathMap, directories, options);

  const rewriteRules: RewriteRule[] = Object.keys(pathMap).map(
    (source: string): RewriteRule => {
      const { page: destination } = pathMap[source];
      return { source, destination };
    },
  );

  return rewriteRules;
}
