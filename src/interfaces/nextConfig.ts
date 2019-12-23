import { Configuration, ICompiler } from 'webpack';
import WebpackDevMiddleware, { Options } from 'webpack-dev-middleware';
import { NextHandleFunction } from 'connect';

import { NextOptions } from 'types/nextOptions';

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
    defaultPathMap: {
      [key: string]: { page: string; query?: { [key: string]: string } };
    },
    directories: {
      dev: string;
      dir: string;
      outDir: string;
      distDir: string;
      buildId: string;
    }
  ) => { [key: string]: { page: string; query?: { [key: string]: string } } };
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
    workerThreads?: boolean;
  };
  future?: {
    excludeDefaultMomentLocales?: boolean;
  };
  serverRuntimeConfig?: any;
  publicRuntimeConfig?: any;
  reactStrictMode?: boolean;
}
