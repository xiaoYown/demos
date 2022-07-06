import { onCleanup, onMount } from 'solid-js';
import { useParams } from 'solid-app-router';

import type DemoAdapter from '@xv-demo/adapter';

const plugins = new Map<string, DemoAdapter>();

const getPublicPath = (port: string) =>
  `http://${window.location.hostname}:${port}/`;

const getJsResourceUrl = (port: string) =>
  `${getPublicPath(port)}main.js?stamp=${Date.now()}`;

const getCssResourceUrl = (port: string) =>
  `${getPublicPath(port)}main.css?stamp=${Date.now()}`;

const insertCss = (name: string, src: string) => {
  const identity = 'data-style-id';
  let link = document.querySelector(`[${identity}=${name}]`);

  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', 'stylesheet');
    link.setAttribute(identity, name);
    const header = document.querySelector('head');
    header?.appendChild?.(link);
  }

  link.setAttribute('href', src);
};

function Adapter() {
  const params = useParams();

  onMount(() => {
    // 加载远程 demo css
    insertCss(params.name, getCssResourceUrl(params.port));
    // 加载远程 demo js
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
    plugins.get(params.name)?.unmount();
  });
  return <section id={params.name} />;
}

export default Adapter;
