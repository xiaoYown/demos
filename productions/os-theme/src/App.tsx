import { Component, onCleanup } from 'solid-js';

import classes from './App.module.css';

const App: Component = () => {
  onCleanup(() => {});

  return <div class={classes.container}>tempalte</div>;
};

export default App;
