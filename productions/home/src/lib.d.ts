declare module '*.json' {
  const Module: {
    [k: string]: any;
  };
  export default Module;
}

declare type Constructor<T> = new (...args: any[]) => T;

declare namespace SystemModel {
  interface Props<T> {
    default: Constructor<T>;
  }
}
