import { MDXExtendedLoaderOptions } from '@saschazar/mdx-extended-loader';
import { Configuration } from 'webpack';

import { NextConfig } from 'types/nextConfig';
import { NextOptions } from 'types/nextOptions';

export default (pluginOptions: MDXExtendedLoaderOptions) => (
  nextConfig: NextConfig
) => {
  const test = /\.mdx?$/;

  return Object.assign({}, nextConfig, {
    webpack(config: Configuration, options: NextOptions) {
      const { module: { rules = [] } = {} } = config || {};
      rules.push({
        test,
        use: [
          options.defaultLoaders.babel,
          {
            loader: '@saschazar/mdx-extended-loader',
            options: pluginOptions
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
