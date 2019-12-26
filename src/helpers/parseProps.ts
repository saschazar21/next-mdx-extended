export const PROPS_REGEX = /const\sprops\s=\s(\{.*?\});/im;

/**
 * Parses a stringified props object out of the contents
 *
 * @param contents - The contents to parse for a stringified props object
 */
export default function propsParser(
  contents: string,
): { [key: string]: string } {
  const results = PROPS_REGEX.exec(contents);
  if (!results) {
    throw new Error('No props parseable from contents!');
  }

  const stringified = results[1];
  if (!stringified) {
    throw new Error('No stringified object found in props declaration!');
  }

  try {
    return JSON.parse(stringified);
  } catch (e) {
    throw new Error('Problems parsing stringified props object!');
  }
}
