import { Component, onCleanup } from 'solid-js';

import S2Table from './table/Table';

import classes from './App.module.css';

const App: Component = () => {
  onCleanup(() => {});

  return (
    <div class={classes.container}>
      <S2Table />
    </div>
  );
};

export default App;
