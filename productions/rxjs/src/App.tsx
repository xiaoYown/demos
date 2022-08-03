import { Component, onCleanup } from 'solid-js';
import Schedulers from './apis/schedulers';

import classes from './App.module.css';

const App: Component = () => {
  onCleanup(() => {});

  return (
    <div class={classes.container}>
      <div>
        <h3>{Schedulers.name}</h3>
        <Schedulers />
      </div>
    </div>
  );
};

export default App;
