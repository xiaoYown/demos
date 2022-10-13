import { Component, onCleanup } from 'solid-js';
import '@ui5/webcomponents/dist/Button';
import './entity/component';
// import TextReverseSolid from './entity/component-solid'

import classes from './App.module.css';

/**
 * TODO: 待处理
 * 1. typescript types
 * 2. css in js
 */

const App: Component = () => {
  // onMount(() => {
  //   registerTextReverse();
  // });
  onCleanup(() => {});

  const handleClick = () => {
    console.log(9999);
  };

  return (
    <div class={classes.container}>
      <ui5-button foo={5} onClick={handleClick}>
        This is a button
      </ui5-button>
      <text-reverse text="text"></text-reverse>
      {/* <text-reverse-solid /> */}
    </div>
  );
};

export default App;
