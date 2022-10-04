import { Component, onMount } from 'solid-js';

import classes from '../App.module.css';
import { store } from '../store';

const convert = require('color-convert');

/** 粒度系数 */
const PARTICLE_SIZE = 2;
/** 灰度 */
const GRAY_LEVEL = 10;
/** 白点上限 */
const WHITE_UPPER_LEVER = 60;
/** 图片名 */
const PICTRUE_NAME = '06.jpeg';

const { devicePixelRatio: dpr } = window;

/** 计算图片缩放后高度 */
const calZoom = (width: number, height: number, targetWidth: number) =>
  Math.floor((targetWidth * height) / width);

/** 清空图片饱和度 */
const clearSaturation = (rgb: number[]) => {
  const hsl = convert.rgb.hsl(...rgb);

  hsl[1] = 0;

  if (hsl[2] > WHITE_UPPER_LEVER) {
    hsl[2] = 100;
  } else {
    hsl[2] = Math.floor(hsl[2] / GRAY_LEVEL) * GRAY_LEVEL;
  }

  return convert.hsl.rgb(hsl);
};

/** srgb 转换到目标颜色 */
const srgb2target = (srgb: number[]) => {
  const rgb = srgb.slice(0, 3);
  const rgbString = clearSaturation(rgb).join(',');
  const opacity = srgb[3] / 255;
  return `rgba(${rgbString},${opacity})`;
};

/** 计算区块颜色 */
const transformBlockColor = (colors: Array<number>[]) => {
  const newColors = colors.reduce(
    (previous, current) => previous.map((item, index) => item + current[index]),
    [0, 0, 0, 0]
  );
  return newColors.map(item => Math.floor(item / colors.length));
};

/** 重制图片 */
const remakePicture = (
  canvasOriginElement: HTMLCanvasElement,
  canvasTargetElement: HTMLCanvasElement
) => {
  const contextOrigin = canvasOriginElement?.getContext('2d');
  const contextTarget = canvasTargetElement?.getContext('2d');
  const canvasWidth = canvasOriginElement?.width as number;
  const canvasHeight = canvasOriginElement?.height as number;
  const row =
    canvasWidth / PARTICLE_SIZE + (canvasWidth % PARTICLE_SIZE === 0 ? 0 : 1);
  const col =
    canvasHeight / PARTICLE_SIZE + (canvasHeight % PARTICLE_SIZE === 0 ? 0 : 1);

  if (!contextTarget) return;

  contextTarget.clearRect(0, 0, canvasWidth, canvasHeight);

  let srgb: any = [0, 0, 0, 0];

  for (let i = 0; i < row; i += 1) {
    for (let j = 0; j < col; j += 1) {
      const colors: Array<number>[] = [];
      for (let x = 0; x < PARTICLE_SIZE; x += 1) {
        for (let y = 0; y < PARTICLE_SIZE; y += 1) {
          srgb = contextOrigin?.getImageData(
            i * PARTICLE_SIZE + x,
            j * PARTICLE_SIZE + y,
            1,
            1
          )?.data ?? [0, 0, 0, 0];
          colors.push(srgb);
        }
      }
      const blockColor = transformBlockColor(colors);
      for (let x = 0; x < PARTICLE_SIZE; x += 1) {
        for (let y = 0; y < PARTICLE_SIZE; y += 1) {
          contextTarget.fillStyle = srgb2target(blockColor);
          contextTarget.fillRect(
            i * PARTICLE_SIZE + x,
            j * PARTICLE_SIZE + y,
            1,
            1
          );
        }
      }
    }
  }
};

/** 重制画布大小 */
const resizeCanvas = (
  canvasOriginElement: HTMLCanvasElement,
  canvasTargetElement: HTMLCanvasElement,
  width: number,
  height: number
) => {
  const targetWidth = 1200;
  // eslint-disable-next-line no-param-reassign
  canvasOriginElement.style.width = `${targetWidth}px`;
  // eslint-disable-next-line no-param-reassign
  canvasTargetElement.style.width = `${targetWidth}px`;
  const targetHeight = calZoom(width, height, targetWidth);

  canvasOriginElement.setAttribute('width', `${targetWidth * dpr}`);
  canvasOriginElement.setAttribute('height', `${targetHeight * dpr}`);
  canvasTargetElement.setAttribute('width', `${targetWidth * dpr}`);
  canvasTargetElement.setAttribute('height', `${targetHeight * dpr}`);
  // eslint-disable-next-line no-param-reassign
  canvasOriginElement.style.height = `${targetHeight}px`;
  // eslint-disable-next-line no-param-reassign
  canvasTargetElement.style.height = `${targetHeight}px`;
};

const Demo1: Component = () => {
  let canvasOriginElement: HTMLCanvasElement | undefined;
  let canvasTargetElement: HTMLCanvasElement | undefined;

  /** 重制图片 */
  const getCanvasSize = () => {
    const width = canvasOriginElement?.width as number;
    const height = canvasOriginElement?.height as number;

    return { width, height };
  };

  onMount(() => {
    const context = canvasOriginElement?.getContext('2d');
    // const url = `${store.publicPath}01.jpg`;
    const url = `${store.publicPath}${PICTRUE_NAME}`;

    const image = new Image();
    image.setAttribute('crossorigin', 'anonymous');
    image.setAttribute('src', url);
    image.onload = () => {
      resizeCanvas(
        canvasOriginElement as HTMLCanvasElement,
        canvasTargetElement as HTMLCanvasElement,
        image.width,
        image.height
      );
      const { width, height } = getCanvasSize();
      context?.drawImage(image, 0, 0, width, height);
    };
  });

  const handleMouseMove = (e: any) => {
    const contextOrigin = canvasOriginElement?.getContext('2d');
    const { offsetX: x, offsetY: y } = e;
    const imageData = contextOrigin?.getImageData(x + 100, y, 1, 1);
    console.log(imageData?.data);
    // console.log(convert.rgb.hsl(imageData?.data?.slice(0, 3)));
  };

  const handleCreate = () => {
    remakePicture(
      canvasOriginElement as HTMLCanvasElement,
      canvasTargetElement as HTMLCanvasElement
    );
  };

  return (
    <div>
      <h3>原图</h3>
      <div class={classes['demo-container']}>
        <canvas
          ref={canvasOriginElement}
          onMouseMove={handleMouseMove}
        ></canvas>
      </div>
      <h3>生成图</h3>
      <button onClick={handleCreate}>生成</button>
      <div class={classes['demo-container']}>
        <canvas ref={canvasTargetElement}></canvas>
      </div>
    </div>
  );
};

export default Demo1;
