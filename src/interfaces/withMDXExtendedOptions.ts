import { MDXExtendedLoaderOptions } from '@saschazar/mdx-extended-loader';

import { PathMapOptions } from 'interfaces/pathMap';

export interface WithMDXExtendedOptions
  extends MDXExtendedLoaderOptions,
    PathMapOptions {
  enableRewrites?: boolean; // whether to also enable URL rewrites in addition to exportPathMap
}
