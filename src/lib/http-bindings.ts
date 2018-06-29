import { toCamelCase } from './camel-case';
import { CloudEvent, validateCloudEvent } from './cloud-events';
import { reduceIterator } from './reduce-iterator';

const NormalHeaderExp = /^ce-(?!x-)([\w\-]+)$/i;
const ExtensionHeaderExp = /^ce-x-([\w\-]+)$/i;
const StandardHeaderExp = /^(content-type)$/i;

const parseHeader = (exp: RegExp, pos: number) => (key: string) => {
  const match = key.match(exp);
  if (match) {
    return toCamelCase(match[pos]);
  }
  return null;
};

export const parse = async (
  headers: Iterable<[string, string]> | any,
  getBody: any | Promise<any> | (() => any | Promise<any>)
): Promise<CloudEvent> => {
  const pairs = headers[Symbol.iterator]
    ? headers
    : Object.entries<string>(headers);

  const eventNoData = reduceIterator<[string, string], any>(
    pairs,
    (acc, [key, value]) => {
      const asExtensionKey = parseHeader(ExtensionHeaderExp, 1)(key);
      if (asExtensionKey) {
        const ext = acc.extensions || {};
        return { ...acc, extensions: { ...ext, [asExtensionKey]: value } };
      } else {
        const asNormalKey = parseHeader(NormalHeaderExp, 1)(key);
        if (asNormalKey) {
          return { ...acc, [asNormalKey]: value };
        } else {
          const asStandardKey = parseHeader(StandardHeaderExp, 1)(key);
          if (asStandardKey) {
            return { ...acc, [asStandardKey]: value };
          }
        }
      }
      return acc;
    },
    {} as any
  );

  const bodyPromise = typeof getBody === 'function' ? getBody() : getBody;

  const data = await Promise.resolve(bodyPromise);

  const event =
    data !== undefined && data !== null
      ? { ...eventNoData, data }
      : eventNoData;

  return validateCloudEvent(event);
};
