const camelCaseExpr = /(?:^\w|[A-Z]|\b\w)/g;
export const toCamelCase = (str: string) =>
  str
    .replace(
      camelCaseExpr,
      (letter, index) =>
        index === 0 ? letter.toLowerCase() : letter.toUpperCase()
    )
    .replace(/[^\w]+/g, '');
