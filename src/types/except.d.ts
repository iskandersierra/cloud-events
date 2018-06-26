declare module 'except' {
  export default function except<T>(obj: T, ...args: string[]): Partial<T>;
  export default function except<T>(obj: T, args: string[]): Partial<T>;
}
