import { Component, onCleanup, onMount } from 'solid-js';

import classes from './App.module.css';
import { convert } from './utils/svg-to-canvas';

const IDENTITY_SVG = 'DEMO_ELEMENT_SVG';

const svgContent = `
<?xml version="1.0" standalone="no"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<svg id="${IDENTITY_SVG}" width="300" height="300" t="1653039406572" class="icon" viewBox="0 0 1024 1024" version="1.1"
  xmlns="http://www.w3.org/2000/svg" p-id="8125"
  xmlns:xlink="http://www.w3.org/1999/xlink" width="200" height="200">
  <defs>
    <style type="text/css">@font-face { font-family: feedback-iconfont; src: url("//at.alicdn.com/t/font_1031158_u69w8yhxdu.woff2?t=1630033759944") format("woff2"), url("//at.alicdn.com/t/font_1031158_u69w8yhxdu.woff?t=1630033759944") format("woff"), url("//at.alicdn.com/t/font_1031158_u69w8yhxdu.ttf?t=1630033759944") format("truetype"); }
    </style>
  </defs>
  <path d="M757.76 907.264H264.2432c-73.1136 0-132.352-59.2384-132.352-132.352v-510.464c0-73.1136 59.2384-132.352 132.352-132.352H757.76c73.1136 0 132.352 59.2384 132.352 132.352v510.464c0 73.1136-59.2384 132.352-132.352 132.352z" fill="#F5D126" p-id="8126"></path>
  <path d="M782.592 132.096H684.544c59.392 0 107.5712 58.0608 107.5712 129.6896v515.84c0 71.6288-48.1792 129.6896-107.5712 129.6896h97.9968c59.392 0 107.5712-58.0608 107.5712-129.6896V261.7856c0-71.6288-48.128-129.6896-107.52-129.6896z" fill="#F2B200" p-id="8127"></path>
  <path d="M757.76 922.624H264.2432c-81.4592 0-147.712-66.2528-147.712-147.712v-510.464c0-81.4592 66.2528-147.712 147.712-147.712H757.76c81.4592 0 147.712 66.2528 147.712 147.712v510.464c0 81.4592-66.2528 147.712-147.712 147.712zM264.2432 147.456c-64.512 0-116.992 52.48-116.992 116.992v510.464c0 64.512 52.48 116.992 116.992 116.992H757.76c64.512 0 116.992-52.48 116.992-116.992v-510.464c0-64.512-52.48-116.992-116.992-116.992H264.2432z" fill="#333333" p-id="8128"></path>
  <path d="M719.872 631.6032H302.1824c-8.4992 0-15.36-6.8608-15.36-15.36s6.8608-15.36 15.36-15.36h417.6896c8.4992 0 15.36 6.8608 15.36 15.36s-6.8608 15.36-15.36 15.36zM719.872 773.6832H302.1824c-8.4992 0-15.36-6.8608-15.36-15.36s6.8608-15.36 15.36-15.36h417.6896c8.4992 0 15.36 6.8608 15.36 15.36s-6.8608 15.36-15.36 15.36z" fill="#333333" p-id="8129"></path>
  <path d="M300.608 235.3152h-24.576c-8.4992 0-15.36-6.8608-15.36-15.36s6.8608-15.36 15.36-15.36h24.576c8.4992 0 15.36 6.8608 15.36 15.36s-6.8608 15.36-15.36 15.36zM371.5584 235.3152H255.488c-8.4992 0-15.36-6.8608-15.36-15.36s6.8608-15.36 15.36-15.36h116.0704c8.4992 0 15.36 6.8608 15.36 15.36s-6.8608 15.36-15.36 15.36z" fill="#FFFFFF" p-id="8130"></path>
  <path d="M302.1824 300.0832H512v209.8176H302.1824z" fill="#FFFCE3" p-id="8131"></path>
  <path d="M300.608 300.0832h59.3408v209.8176H300.608z" fill="#FFF5B8" p-id="8132"></path>
  <path d="M511.9488 525.2096H302.1824c-8.4992 0-15.36-6.8608-15.36-15.36V300.0832c0-8.4992 6.8608-15.36 15.36-15.36H512c8.4992 0 15.36 6.8608 15.36 15.36v209.8176a15.40608 15.40608 0 0 1-15.4112 15.3088z m-194.4064-30.72H496.64V315.4432H317.5424v179.0464z" fill="#333333" p-id="8133"></path>
</svg>
`;

const App: Component = () => {
  let elementCanvasWrapper: HTMLDivElement | undefined;
  let elementImage: HTMLImageElement | undefined;

  onCleanup(() => {});

  onMount(() => {
    convert({
      width: 300,
      height: 300,
      svg: document.querySelector(`#${IDENTITY_SVG}`) as SVGAElement,
    })
      .then(canvas => {
        elementCanvasWrapper?.appendChild(canvas);
        elementImage?.setAttribute('src', canvas.toDataURL('image/png'));
      })
      .catch(error => {
        console.error(error);
      });
  });

  return (
    <div class={classes.container}>
      <h2>SVG</h2>
      <div class={classes['container-item']} innerHTML={svgContent}></div>
      <h2>CANVAS</h2>
      <div class={classes['container-item']} ref={elementCanvasWrapper}></div>
      <h2>IMAGE</h2>
      <div class={classes['container-item']}>
        <img ref={elementImage} alt="demo" />
      </div>
    </div>
  );
};

export default App;
