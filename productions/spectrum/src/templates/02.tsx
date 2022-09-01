import { Component, onMount } from 'solid-js';
import WaveSurfer from 'wavesurfer.js';
import { store } from '../store';

const Template02: Component = () => {
  onMount(() => {});

  const handlePlay = () => {
    const wavesurfer = WaveSurfer.create({
      container: '#waveform',
      waveColor: 'violet',
      progressColor: 'purple',
    });

    wavesurfer.on('ready', () => {
      wavesurfer.play();
    });

    wavesurfer.load(`${store.publicPath}b.mp3`);
  };
  return (
    <div>
      <div id="waveform"></div>
      <button onClick={handlePlay}>Play</button>
    </div>
  );
};

export default Template02;
