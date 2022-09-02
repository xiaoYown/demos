import { Component, onMount } from 'solid-js';

import classes from '../App.module.css';
import { store } from '../store';

const convert = require('color-convert');

const calZoom = (width: number, height: number, targetWidth: number) =>
  Math.floor((targetWidth * height) / width);

const clearSaturation = (rgb: number[]) => {
  const hsl = convert.rgb.hsl(...rgb);
  const num = 2;

  hsl[1] = 0;

  if (hsl[2] > 55) {
    hsl[2] = 100;
  } else {
    hsl[2] = Math.floor(hsl[2] / num) * num;
  }

  return convert.hsl.rgb(hsl);
};

const srgb2target = (srgb: number[]) => {
  const rgb = srgb.slice(0, 3);
  const rgbString = clearSaturation(rgb).join(',');
  const opacity = srgb[3] / 255;
  return `rgba(${rgbString},${opacity})`;
};

const Demo1: Component = () => {
  let canvasOriginElement: HTMLCanvasElement | undefined;
  let canvasTargetElement: HTMLCanvasElement | undefined;

  onMount(() => {
    const context = canvasOriginElement?.getContext('2d');
    // const url = `${store.publicPath}01.jpg`;
    const url = `${store.publicPath}03.webp`;
    const canvasWidth = canvasOriginElement?.width as number;

    const image = new Image();
    image.setAttribute('crossorigin', 'anonymous');
    image.setAttribute('src', url);
    image.onload = () => {
      context?.drawImage(
        image,
        0,
        0,
        canvasWidth,
        calZoom(image.width, image.height, canvasWidth)
      );
    };
  });

  const handleMouseMove = (e: any) => {
    const contextOrigin = canvasOriginElement?.getContext('2d');
    const { offsetX: x, offsetY: y } = e;
    const imageData = contextOrigin?.getImageData(x, y, 1, 1);
    console.log(convert.rgb.hsl(imageData?.data?.slice(0, 3)));
  };

  const handleCreate = () => {
    const contextOrigin = canvasOriginElement?.getContext('2d');
    const contextTarget = canvasTargetElement?.getContext('2d');
    const rowNum = canvasOriginElement?.width as number;
    const colNum = canvasOriginElement?.height as number;

    contextTarget?.clearRect(0, 0, rowNum, colNum);

    let srgb: any = [0, 0, 0, 0];

    for (let i = 0; i < rowNum; i += 1) {
      for (let j = 0; j < colNum; j += 1) {
        srgb = contextOrigin?.getImageData(i, j, 1, 1)?.data ?? [0, 0, 0, 0];
        contextTarget && (contextTarget.fillStyle = srgb2target(srgb));
        contextTarget?.fillRect(i, j, 1, 1);
      }
    }
  };

  return (
    <div>
      <h3>原图</h3>
      <div class={classes['demo-container']}>
        <canvas
          ref={canvasOriginElement}
          width={800}
          height={400}
          onMouseMove={handleMouseMove}
        ></canvas>
      </div>
      <h3>生成图</h3>
      <button onClick={handleCreate}>生成</button>
      <div class={classes['demo-container']}>
        <canvas ref={canvasTargetElement} width={800} height={400}></canvas>
      </div>
    </div>
  );
};

export default Demo1;
