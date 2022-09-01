import { Component, onMount } from 'solid-js';
import { store } from '../store';

const Template02: Component = () => {
  onMount(() => {});

  const handlePlay = () => {
    // 用来绘制波峰
    const maxCanvas = document.getElementById(
      'canvas-max-03'
    ) as HTMLCanvasElement;
    // 用来绘制波谷
    const minCanvas = document.getElementById(
      'canvas-min-03'
    ) as HTMLCanvasElement;

    const canvasWidth = maxCanvas.width;
    const canvasHeight = maxCanvas.height;

    // 请求要注意跨域问题
    fetch(`${store.publicPath}b.mp3`)
      .then(res =>
        // 这里一定要设置成arraybuffer; 对应ajax中responseType配置
        res.arrayBuffer()
      )
      .then(res => {
        // 注意这里的audioData并不是我们最终要获取的音频数据，还需要进行解码
        const audioData = res;

        const audioCtx = new AudioContext();
        // MARK: step 1
        // 创建环境
        audioCtx.decodeAudioData(audioData, buffer => {
          // buffer就是我们要获取的数据
          // 以下是音频控制的方式，并不是绘制频谱必须的，也可以使用audio标签事件来代替控制方案
          const dataSource = audioCtx.createBufferSource();
          dataSource.buffer = buffer;
          // 连接播放节点
          dataSource.connect(audioCtx.destination);
          // 开始播放音频
          dataSource.start();
          // MARK: step 2
          const switchData = () => {
            // 获取buffer长度
            const { /* numberOfChannels, sampleRate, */ length } = buffer;
            // canvas每一个展示单元的宽度
            const unitWidth = 2;
            // canvas每一个展示单元间的间距
            const unitSpacing = 1;

            // 共需要多少份
            const total = canvasWidth / (unitWidth + 2 * unitSpacing);
            // 每一份的点数
            const sampleSize = length / total;
            const first = 0;
            const last = total;
            const peaks = [];

            // 取左声道数据
            const chan = buffer.getChannelData(0);
            for (let i = first; i < last; i += 1) {
              const start = i * sampleSize;
              const end = start + sampleSize;
              let min = 0;
              let max = 0;
              for (let j = start; j < end; j += 1) {
                const value = chan[j];
                if (value > max) max = value;
                if (value < min) min = value;
              }
              // 波峰
              peaks[2 * i] = max;
              // 波谷
              peaks[2 * i + 1] = min;
            }
            return { peaks, unitWidth, unitSpacing };
          };

          // MARK: step 3
          const { peaks, unitWidth, unitSpacing } = switchData();

          // 这里假设画布高度，值可以通过获取传入进来

          const maxCtx = minCanvas.getContext('2d') as CanvasRenderingContext2D;
          const minCtx = maxCanvas.getContext('2d') as CanvasRenderingContext2D;
          maxCtx.fillStyle = 'rgba(0,0,0,0.5)';
          minCtx.fillStyle = 'rgba(0,0,0,0.5)';

          peaks.forEach((item, index) => {
            if (index > 0) {
              const x =
                (unitSpacing * 2 + unitWidth) * (item / 2) + unitSpacing;
              const y =
                80 * (1 - index) >= canvasHeight - 1
                  ? canvasHeight - 1
                  : canvasHeight * (1 - index);
              const height =
                canvasHeight * index < 1 ? 1 : canvasHeight * index;
              // maxCtx.fillRect(x, y, unitWidth, height);
              maxCtx.fillRect(x * index, y, unitWidth, height);
              console.log(x * index, y, unitWidth, height);
            } else {
              const x =
                (unitSpacing * 2 + unitWidth) * ((item - 1) / 2) + unitSpacing;
              const y = 1;
              const height = -80 * index < 1 ? 1 : -80 * index;
              // minCtx.fillRect(x, y, unitWidth, height);
              maxCtx.fillRect(x * index, y, unitWidth, height);
            }
            maxCtx.fill();
            minCtx.fill();
          });
        });
      })
      .catch(e => {
        console.log(e);
      });
  };
  return (
    <div>
      <div>
        <canvas
          id="canvas-max-03"
          style={{ background: '#cccccc', width: '600px', height: '300px' }}
        ></canvas>
        <br />
        <br />
        <canvas
          id="canvas-min-03"
          style={{ background: '#cccccc', width: '600px', height: '300px' }}
        ></canvas>
      </div>
      <button onClick={handlePlay}>Play</button>
    </div>
  );
};

export default Template02;
