import { Configuration } from 'webpack';

import { NextConfig } from 'interfaces/nextConfig';
import { NextOptions } from 'interfaces/nextOptions';
import { PathMap, PathMapDirectories } from 'interfaces/pathMap';
import { WithMDXExtendedOptions } from 'interfaces/withMDXExtendedOptions';
import exportPathMap from 'exportPathMap';

export default (pluginOptions: WithMDXExtendedOptions) => (
  nextConfig: NextConfig
) => {
  const test = /\.mdx?$/;
  const { blogDir, format, ...mdxLoaderOptions } = pluginOptions;

  return Object.assign({}, nextConfig, {
    exportPathMap: async (defaultPathMap: PathMap, directories: PathMapDirectories) => exportPathMap(defaultPathMap, directories, { blogDir, format }),
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
  });
};
