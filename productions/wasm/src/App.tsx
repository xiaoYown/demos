import { Component, createSignal, onMount, Show } from 'solid-js';

import classes from './App.module.css';

import init from '../public/xv/pkg';

interface AppProps {
  publicPath: string;
}

type SizeModel = number;

const wasmUrl = 'xv/pkg/xv_bg.wasm';

// const keepDigital = (num: number, n = 3) => {
//   const d = 10 ** n;
//   return Math.floor(d * num) / d;
// };

const getRandom = (max = 100) => Math.floor(max * Math.random());

const getSizeList = (length: number): SizeModel[] => {
  let len = length;
  const size: SizeModel[] = [];
  while (len > 0) {
    len -= 1;
    size.push(getRandom());
  }
  return size;
};

const calSizeScale = (size: number[], zoom = 1) =>
  size.map(num => num * zoom * zoom);

const App: Component<AppProps> = props => {
  const [getArrLen, setArrLen] = createSignal(30000000);
  const [getJsTime, setJsTime] = createSignal(0);
  const [getWasmTime, setWasmTime] = createSignal(0);
  const [getIsCalculating, setIsCalculating] = createSignal(false);

  const compare = () => {
    const resourceUrl = `${props.publicPath}${wasmUrl}`;
    init(resourceUrl).then(({ cal_size_zoom: calSizeZoom }) => {
      setIsCalculating(true);
      setTimeout(() => {
        const sizeList = getSizeList(getArrLen());
        /* js cal start */
        let startTime = Date.now();
        let result = calSizeScale(sizeList, 0.698);
        setJsTime(Date.now() - startTime);
        /* js cal end */

        startTime = Date.now();
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        result = calSizeZoom(sizeList, 0.698);
        setWasmTime(Date.now() - startTime);
        setIsCalculating(false);
      }, 10);
    });
  };

  return (
    <div class={classes.container}>
      <div>
        <h3>数组长度</h3>
        <input
          type="text"
          value={getArrLen()}
          onInput={e => {
            const value = parseInt(
              (e.target.value as string).replace(/\[^d]/g, '') || '0',
              10
            );
            setArrLen(value);
          }}
        />
      </div>
      <div>
        <h3>js 时长</h3>
        <div>{getJsTime()}</div>
      </div>
      <div>
        <h3>wasm 时长</h3>
        <div>{getWasmTime()}</div>
      </div>
      <Show when={getIsCalculating()}>计算中</Show>
      <Show when={!getIsCalculating()}>
        <button onClick={compare}>compare</button>
      </Show>
    </div>
  );
};

export default App;
