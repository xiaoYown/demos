import { Component, onCleanup } from 'solid-js';
import Demo from './components/demo';

import classes from './App.module.css';

const App: Component = () => {
  onCleanup(() => {});

  return (
    <div class={classes.container}>
      <Demo></Demo>
    </div>
  );
};

export default App;
