import { Component, onCleanup } from 'solid-js';
import Demo1 from './demo-1';

import classes from './App.module.css';

const App: Component = () => {
  onCleanup(() => {});

  return (
    <div class={classes.container}>
      <Demo1 />
    </div>
  );
};

export default App;
