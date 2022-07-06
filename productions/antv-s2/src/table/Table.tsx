import { Component, onCleanup, onMount } from 'solid-js';
import { PivotSheet } from '@antv/s2';

import data from './data';

console.log(data);

const S2Table: Component = () => {
  let s2: PivotSheet | null = null;

  onMount(() => {
    const container = document.getElementById(
      's2-table-container'
    ) as HTMLDivElement;

    const s2Options = {
      width: 600,
      height: 480,
    };
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    s2 = new PivotSheet(container, data, s2Options);

    s2.render();
  });

  onCleanup(() => {
    s2?.destroy();
  });

  return <div id="s2-table-container"></div>;
};

export default S2Table;
