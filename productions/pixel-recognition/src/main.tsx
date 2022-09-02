import { render } from 'solid-js/web';
import { JSXElement, Show } from 'solid-js';

import DemoAdapter from '@xv-demo/adapter';

import { store, StoreModel } from './store';
import App from './App';

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
    // 数据存储
    store.publicPath = this.publicPath;
    // 容器渲染
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
