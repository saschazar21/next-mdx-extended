import { MDXExtendedLoaderOptions } from '@saschazar/mdx-extended-loader';

import mdxExtended from '../src/index';
import { NextConfig } from '../src/interfaces/nextConfig';

const nextConfig: NextConfig = {
  pageExtensions: ['mdx', 'md', 'tsx', 'ts']
};

const options: MDXExtendedLoaderOptions = {
  extensions: nextConfig.pageExtensions,
  layoutsDir: 'layouts'
};

const withMDXExtended = mdxExtended(options);
const config = withMDXExtended(nextConfig);

describe('next-mdx-extended', () => {
  it('contains custom settings', () => {
    expect(config).toHaveProperty('pageExtensions', nextConfig.pageExtensions);
  });
});
