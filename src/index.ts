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
  const {
    blogDir,
    enableRewrites = true,
    exportData,
    format,
    ...loaderOptions
  } = pluginOptions || {};
  const mdxLoaderOptions = Object.assign(
    {},
    { extensions: nextConfig.pageExtensions, layoutsDir: 'layouts' },
    loaderOptions
  );

  return Object.assign(
    {},
    nextConfig,
    {
      exportPathMap: async (
        defaultPathMap: PathMap,
        directories: PathMapDirectories
      ) =>
        exportPathMap(defaultPathMap, directories, {
          blogDir,
          exportData,
          format
        }),
      target: nextConfig.target || 'serverless',
      webpack(config: Configuration, options: NextOptions) {
        const { module: { rules = [] } = {} } = config || {};
        rules.push({
          test,
          use: [
            options.defaultLoaders.babel,
            {
              loader: '@saschazar/mdx-extended-loader',
              options: mdxLoaderOptions
            }
          ]
        });

        if (typeof nextConfig.webpack === 'function') {
          return nextConfig.webpack(config, options);
        }

        return config;
      }
    },
    enableRewrites && {
      experimental: {
        modern: true,
        rewrites: async (): Promise<RewriteRule[]> => {
          const {
            experimental: {
              rewrites: customRewrites = (): Promise<RewriteRule[]> =>
                Promise.resolve([])
            } = {}
          } = nextConfig;
          const hasRewrites =
            customRewrites && typeof customRewrites === 'function';

          try {
            const parsedRewrites = await rewrites({ blogDir, format });
            return parsedRewrites.concat(
              hasRewrites ? await customRewrites() : []
            );
          } catch (e) {
            console.error(e.message || e);
            return [];
          }
        }
      }
    }
  );
};
