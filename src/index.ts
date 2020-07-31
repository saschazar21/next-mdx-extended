import { Configuration } from 'webpack';

import { NextConfig } from 'interfaces/nextConfig';
import { NextOptions } from 'interfaces/nextOptions';
import { PathMap, PathMapDirectories } from 'interfaces/pathMap';
import { RewriteRule } from 'interfaces/rewriteRule';
import { WithMDXExtendedOptions } from 'interfaces/withMDXExtendedOptions';
import exportPathMap from 'exportPathMap';
import rewrites from 'rewrites';

export default (pluginOptions: WithMDXExtendedOptions) => (
  nextConfig: NextConfig = {}
): NextConfig => {
  const test = /\.mdx?$/;
  const { blogDir, enableRewrites = true, feed, format, ...loaderOptions } =
    pluginOptions || {};
  const mdxLoaderOptions = Object.assign(
    {},
    { extensions: nextConfig.pageExtensions, layoutsDir: 'layouts' },
    loaderOptions
  );

  return Object.assign(
    {},
    nextConfig,
    {
      // exports path map only when executing `next export`
      exportPathMap: async (
        defaultPathMap: PathMap,
        directories: PathMapDirectories
      ) =>
        exportPathMap(defaultPathMap, directories, {
          blogDir,
          feed: (!enableRewrites && feed) || null, // focus on the export in the rewrites, instead of the export path map step
          format,
        }),
      webpack(config: Configuration, options: NextOptions) {
        const { module: { rules = [] } = {} } = config || {};
        rules.push({
          test,
          use: [
            options.defaultLoaders.babel,
            {
              loader: '@saschazar/mdx-extended-loader',
              options: mdxLoaderOptions,
            },
          ],
        });

        if (typeof nextConfig.webpack === 'function') {
          return nextConfig.webpack(config, options);
        }

        return config;
      },
    },
    enableRewrites && {
      target: nextConfig.target || 'server', // 'server' is preferred, because it allows `next export`
      async rewrites(): Promise<RewriteRule[]> {
        // get any custom rewrite rules from the user's settings in next.config.js
        const {
          experimental: {
            rewrites: customRewrites = (): Promise<RewriteRule[]> =>
              Promise.resolve([]),
          } = {},
        } = nextConfig;

        // check whether custom rewrites are a function after all
        const hasRewrites =
          customRewrites && typeof customRewrites === 'function';

        // generate the rewrite rules based on the exportPathMap settings
        try {
          const parsedRewrites = await rewrites({
            blogDir,
            feed,
            format,
          });

          // merge the custom rewrites with the generated rewrite rules array
          return parsedRewrites.concat(
            hasRewrites ? await customRewrites() : []
          );
        } catch (e) {
          // if the operation fails, return an empty array
          console.error(e.message || e);
          return [];
        }
      },
    }
  );
};
