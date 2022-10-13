import 'solid-js';

declare module 'solid-js' {
  namespace JSX {
    interface IntrinsicElements {
      'ui5-button': JSX.IntrinsicElements['div'] & { foo: number };
      'text-reverse': JSX.IntrinsicElements['div'] & { text?: string };
    }
  }
}
