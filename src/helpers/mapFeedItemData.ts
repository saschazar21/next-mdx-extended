import remark from 'remark';
import mdx from 'remark-mdx';
import strip from 'remark-mdx-to-plain-text';

import { JsonFeedItem } from 'interfaces/jsonfeed';

/**
 * Takes a Markdown/MDX-formatted string and returns a Promise resolving to its plain text version
 *
 * @param content - the source Markdown/MDX string, to be stringified
 */
async function parseContent(content: string): Promise<string> {
  try {
    const processed = await remark()
      .use(mdx)
      .use(strip)
      .process(content);

    return String(processed).trim();
  } catch (e) {
    console.error(e.message || e);
    return content;
  }
}

/**
 * Gets an unformatted JavaScript object and tries to extract valid JSON Feed item data
 *
 * @param obj - the object to map the values to the JSON Feed item format
 */
export default async function mapFeedItemData(obj: {
  [key: string]: any;
}): Promise<JsonFeedItem> {
  const { content, url = '', ...other } = obj;

  if (!content) {
    throw new Error('No content to parse!');
  }

  /* eslint-disable-next-line @typescript-eslint/camelcase */
  const content_text = await parseContent(content);

  return {
    id: url,
    url,
    /* eslint-disable-next-line @typescript-eslint/camelcase */
    content_text,
    ...other
  };
}
