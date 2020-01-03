import { Configuration, ICompiler } from 'webpack';
import WebpackDevMiddleware, { Options } from 'webpack-dev-middleware';
import { NextHandleFunction } from 'connect';

import { NextOptions } from 'interfaces/nextOptions';
import { PathMap, PathMapDirectories } from 'interfaces/pathMap';
import { RewriteRule } from 'interfaces/rewriteRule';

export interface NextConfig {
  env?: string[];
  webpack?: (config?: Configuration, options?: NextOptions) => any;
  webpackDevMiddleware?: (
    compiler: ICompiler,
    options?: Options
  ) => WebpackDevMiddleware.WebpackDevMiddleware & NextHandleFunction;
  distDir?: string;
  assetPrefix?: string;
  configOrigin?: string;
  useFileSystemPublicRoutes?: boolean;
  generateBuildId?: () => string | null;
  generateEtags?: boolean;
  pageExtensions?: string[];
  target?: string;
  poweredByHeader?: boolean;
  compress?: boolean;
  devIndicators?: {
    buildActivity?: boolean;
    autoPrerender?: boolean;
  };
  onDemandEntries?: {
    maxInactiveAge?: number;
    pagesBufferLength?: number;
  };
  amp?: {
    canonicalBase?: string;
  };
  exportPathMap?: (
    defaultPathMap: PathMap,
    directories: PathMapDirectories
  ) => PathMap;
  exportTrailingSlash?: boolean;
  experimental?: {
    ampBindInitData?: boolean;
    cpus?: number;
    catchAllRouting?: boolean;
    css?: boolean;
    documentMiddleware?: boolean;
    granularChunks?: boolean;
    modern?: boolean;
    plugins?: boolean;
    profiling?: boolean;
    sprFlushToDisk?: boolean;
    deferScripts?: boolean;
    reactMode?: string;
    rewrites: () => Promise<RewriteRule[]>;
    workerThreads?: boolean;
  };
  future?: {
    excludeDefaultMomentLocales?: boolean;
  };
  serverRuntimeConfig?: any;
  publicRuntimeConfig?: any;
  reactStrictMode?: boolean;
}
