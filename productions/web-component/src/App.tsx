import { Component, onCleanup } from 'solid-js';
// import registerTextReverse from './entity/component';
// import TextReverseSolid from './entity/component-solid'

import classes from './App.module.css';

const App: Component = () => {
  // onMount(() => {
  //   registerTextReverse();
  // });
  onCleanup(() => {});

  return (
    <div class={classes.container}>
      {/* <text-reverse></text-reverse> */}
      {/* <text-reverse-solid /> */}
    </div>
  );
};

export default App;
