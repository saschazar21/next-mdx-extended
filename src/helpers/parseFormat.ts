import { paramCase } from 'param-case';

export const YEAR_REGEX = /[Y]{2,4}/;
export const MONTH_REGEX = /[M]{2}/;
export const DATE_REGEX = /[D]{2}/;
export const PROPS_REGEX = /\[(.*?)\]/;

export interface ParseFormatOptions {
  [key: string]: string | Date;
  date: string;
  title: string;
}

/**
 * Checks whether the number is smaller than 10, prepends a zero if true.
 *
 * @param num - The number to check
 */
function prependZero(num: number): string {
  return num > 9 ? num.toString() : `0${num}`;
}

/**
 * Parses the desired format and applies the given data in the options object to the string result
 *
 * @param format - The format to parse the URL to, e.g. /YYYY/[title] becomes /2019/a-title
 * @param options - The options containing the properties for the [placeholder] values in the format
 */
export default function parseFormat(
  format: string,
  options: ParseFormatOptions,
): string {
  const { date: dateString } = options || {};

  if (!dateString || isNaN(Date.parse(dateString))) {
    throw new Error('Date missing or corrupt, parsing format is not possible!');
  }

  // stringify all the necessary date values
  const date = new Date(dateString);
  const values = [
    date.getFullYear().toString(),
    prependZero(date.getMonth() + 1),
    prependZero(date.getDate()),
  ];

  // replace the date placeholders with real data
  let appliedDate = [YEAR_REGEX, MONTH_REGEX, DATE_REGEX].reduce(
    (parsed: string, current: RegExp, idx: number): string =>
      parsed.replace(current, values[idx]),
    format,
  );

  // at last, replace the [placeholder] keys with the param-cased data from the options object
  let prop;
  while ((prop = PROPS_REGEX.exec(appliedDate)) !== null) {
    if (prop[1]) {
      appliedDate = appliedDate.replace(
        `[${prop[1]}]`,
        paramCase((options[prop[1]] as string) || ''),
      );
    }
  }

  return appliedDate;
}
