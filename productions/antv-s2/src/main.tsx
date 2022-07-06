import { render } from 'solid-js/web';
import { JSXElement, Show } from 'solid-js';
import { createMutable } from 'solid-js/store';

import DemoAdapter from '@xv-demo/adapter';

import App from './App';

interface StoreModel {
  exist: boolean;
}

const createDefaultValue = (): StoreModel => ({
  exist: false,
});

const store = createMutable<StoreModel>(createDefaultValue());

const mount = () => {
  store.exist = true;
};

const unmount = () => {
  store.exist = false;
};

const Container = (props: { store: StoreModel; children: JSXElement }) => (
  <Show when={props.store.exist}>{props.children}</Show>
);

class DemoEntry extends DemoAdapter {
  override mount = (): void => {
    const container = document.getElementById(this.container) as HTMLDivElement;
    mount();
    render(
      () => (
        <Container store={store}>
          <App />
        </Container>
      ),
      container
    );
  };

  override unmount = (): void => {
    unmount();
  };
}

export default DemoEntry;
