import { MDXExtendedLoaderOptions } from '@saschazar/mdx-extended-loader';
import { Configuration } from 'webpack';
import { NextConfig } from "./types/nextConfig";
import { NextOptions } from "./types/nextOptions";
declare const _default: (pluginOptions: MDXExtendedLoaderOptions) => (nextConfig: NextConfig) => NextConfig & {
    webpack(config: Configuration, options: NextOptions): any;
};
export default _default;
