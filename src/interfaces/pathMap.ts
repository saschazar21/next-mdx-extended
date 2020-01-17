import { JsonFeed } from 'interfaces/jsonfeed';

export interface PathMap {
  [key: string]: { page: string; query?: { [key: string]: string } };
}

export interface PathMapDirectories {
  dev: boolean;
  dir: string;
  outDir: string;
  distDir: string;
  buildId: string;
}

export interface PathMapOptions {
  blogDir?: string; // the directory where to look for Markdown/MDX files, relative to 'pages', default 'blog'
  feed?: JsonFeed | null; // when present, exports the posts collection to a JSON Feed (https://jsonfeed.org/version/1)
  format?: string; // the format to rewrite the blog posts, default /blog/YYYY/[title]
}
