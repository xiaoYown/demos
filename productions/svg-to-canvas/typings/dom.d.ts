import 'solid-js';

declare module 'solid-js' {
  namespace JSX {
    interface IntrinsicElements {
      template: JSX.IntrinsicElements['template'];
    }
  }
}
