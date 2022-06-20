import { onCleanup, onMount } from 'solid-js';
import { useParams } from 'solid-app-router';

import type DemoAdapter from '@xv-demo/adapter';

const plugins = new Map<string, DemoAdapter>();

const getPublicPath = (port: string) => {
  return `http://127.0.0.1:${port}/`;
};

const getJsResourceUrl = (port: string) => {
  return `http://127.0.0.1:${port}/main.js`;
};

const getCssResourceUrl = (port: string) => {
  return `http://127.0.0.1:${port}/main.css`;
};

function Adapter() {
  const params = useParams();

  onMount(() => {
    System.import<SystemModel.Props<DemoAdapter>>(
      getJsResourceUrl(params.port)
    ).then((module: SystemModel.Props<DemoAdapter>) => {
      const RemotePlugin = module.default;

      const adapter = new RemotePlugin({
        publicPath: getPublicPath(params.port),
        container: params.name,
      });

      plugins.set(params.name, adapter);

      adapter.mount();
    });
  });
  onCleanup(() => {
    console.log(params.name);
    plugins.get(params.name)?.unmount();
  });
  return <section id={params.name} />;
}

export default Adapter;
