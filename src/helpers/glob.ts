import { resolve } from 'path';
import globby from 'globby';

/**
 * Globs for Markdown/MDX files in the current directory (incl. subdirectories)
 *
 * @param dir - The directory to glob for Markdown/MDX files
 */
export default async function glob(dir: string): Promise<string[]> {
  const mdxFiles = await globby(dir, {
    expandDirectories: ['**/*.mdx', '**/*.md'],
  });

  if (!mdxFiles || !mdxFiles.length) {
    throw new Error(
      `No Markdown/MDX files found in ${resolve(process.cwd(), dir)}`,
    );
  }

  return mdxFiles;
}
