export const reduceIterator = <T, A>(
  it: Iterable<T>,
  f: (a: A, x: T) => A,
  init: A
) => {
  // tslint:disable-next-line:no-let
  let a = init;
  for (const x of it) {
    a = f(a, x);
  }
  return a;
};
