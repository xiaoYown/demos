import { Component, onCleanup, onMount } from 'solid-js';
import { store } from './store';

import classes from './App.module.css';

const App: Component = () => {
  let audio: HTMLAudioElement | null = null;
  let canvas: HTMLCanvasElement | null = null;
  let context: CanvasRenderingContext2D | null = null;
  let source: MediaElementAudioSourceNode | null = null;
  let analyser: AnalyserNode | null = null;

  // 创建境况
  const { AudioContext } = window;
  const audioContext = new AudioContext();
  // 用createAnalyser方法,获取音频时间和频率数据,实现数据可视化。

  const height = 400; // canvas高度
  const width = 1000; // canvas宽度

  onMount(() => {
    audio = document.getElementById('audio') as HTMLAudioElement;
    canvas = document.getElementById('canvas') as HTMLCanvasElement;
    context = canvas.getContext('2d') as CanvasRenderingContext2D;

    // 创建输入源
    source = audioContext.createMediaElementSource(audio as HTMLAudioElement);
    analyser = audioContext.createAnalyser();

    // 连接：source → analyser → destination
    (source as MediaElementAudioSourceNode).connect(analyser as AnalyserNode);
    // 声音连接到扬声器
    (analyser as AnalyserNode).connect(audioContext.destination);
  });
  onCleanup(() => {});

  let animation = 0;

  const handlePlay = () => {
    /* 存储频谱数据，Uint8Array数组创建的时候必须制定长度, 长度就从analyser.frequencyBinCount里面获取，长度是1024*/
    const arrData = new Uint8Array(
      (analyser as AnalyserNode).frequencyBinCount
    );
    // const count = Math.min(500, arrData.length);
    const count = arrData.length;
    const step = Math.round((arrData.length * 0.6) / count);

    let value = 0; // 每个能量柱的值
    let drawX = 0; // 能量柱X轴位置
    let drawY = 0; // 能量柱Y轴坐标

    (canvas as HTMLCanvasElement).height = height;
    (canvas as HTMLCanvasElement).width = width;
    // 能量柱宽度，设置线条宽度
    const lineWidth = (canvas as HTMLCanvasElement).width / count;
    // 设置线条宽度
    (context as CanvasRenderingContext2D).lineWidth = lineWidth;

    // 渲染函数
    const render = () => {
      // 每次要清除画布
      (context as CanvasRenderingContext2D).clearRect(0, 0, width, height);
      // 获取频谱值
      (analyser as AnalyserNode).getByteFrequencyData(arrData);
      for (let i = 0; i < count; i += 1) {
        // 前面已经计算好步长了
        value = arrData[i * step + step];
        // X轴位置计算
        drawX = i * lineWidth;
        /*  能量柱的高度，从canvas的底部往上画，那么Y轴坐标就是画布的高度减去能量柱的高度，
          而且经测试发现value正常一般都比较小，要画的能量柱高一点，所以就乘以2，
          又防止太高，取了一下最大值，并且canvas里面尽量避免小数值，取整一下
        */
        // drawY = Math.max(height - value, 10);
        drawY = height - value;
        // 开始一条路径
        (context as CanvasRenderingContext2D).beginPath();
        /* 设置画笔颜色，hsl通过这个公式出来的是很漂亮的彩虹色
          H：Hue(色调)。0(或360)表示红色，120表示绿色，240表示蓝色，也可取其他数值来指定颜色。取值为：0 - 360
          S：Saturation(饱和度)。取值为：0.0% - 100.0%
          L：Lightness(亮度)。取值为：0.0% - 100.0%
        */
        // (context as CanvasRenderingContext2D).strokeStyle = `hsl( ${Math.round(
        //   (i * 360) / count
        // )}, 100%, 50%)`;
        (context as CanvasRenderingContext2D).strokeStyle = '#cf4e41';
        // 从X轴drawX，Y轴就是canvas的高度，也就是canvas的底部
        (context as CanvasRenderingContext2D).moveTo(drawX, height);
        // 从X轴drawX，Y轴就是计算好的Y轴，是从下往上画，这么理解
        (context as CanvasRenderingContext2D).lineTo(drawX, drawY);
        /* stroke方法才是真正的绘制方法,顺便也相当于结束了这次的绘画路径，
          就不用调用closePath方法了
        */
        (context as CanvasRenderingContext2D).stroke();
      }
      // 用requestAnimationFrame做动画
      animation = requestAnimationFrame(render);
    };

    render();
  };

  const handlePause = () => {
    cancelAnimationFrame(animation);
  };

  return (
    <div>
      <div class={classes['canvas-wrapper']}>
        <canvas
          id="canvas"
          style={{
            height: '400px',
            width: '1000px',
            background: '#000',
          }}
        ></canvas>
      </div>
      <div class={classes['audio-wrapper']}>
        <audio
          id="audio"
          crossOrigin="anonymous"
          src={`${store.publicPath}b.mp3`}
          autoplay={false}
          loop={false}
          controls={true}
          preload="auto"
          onPlay={handlePlay}
          onpause={handlePause}
        ></audio>
      </div>
    </div>
  );
};

export default App;
