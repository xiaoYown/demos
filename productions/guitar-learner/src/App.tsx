import { Component, onCleanup } from 'solid-js';
import Navigation from './components/navigation';

import classes from './App.module.css';

const App: Component = () => {
  onCleanup(() => {});

  return (
    <div class={classes.container}>
      <div>
        <Navigation />
      </div>
    </div>
  );
};

export default App;
