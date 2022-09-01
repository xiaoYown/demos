import { Component } from 'solid-js';

// import Template01 from './templates/01';
import Template03 from './templates/03';

import classes from './App.module.css';

const App: Component = () => (
  <div>
    {/* <Template01 /> */}
    <div class={classes.line}></div>
    <Template03 />
  </div>
);

export default App;
