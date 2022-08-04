import { Component } from 'solid-js';
import Schedulers from './apis/schedulers';
import ForkJoin from './apis/fork-join';

import classes from './App.module.css';

const DemoItem = ({ component: Cmp }: { component: Component<DemoProps> }) => {
  let running: () => void | null;

  return (
    <div class={classes['demo-item']}>
      <div class={classes['demo-item-shadow']}>
        <h3>{Cmp.name}</h3>
        <Cmp
          bindStart={(exec: () => void) => {
            running = exec;
          }}
        />
      </div>
      <div class={classes['demo-item-bottom']}>
        <button
          onClick={() => {
            running?.();
          }}
        >
          run
        </button>
      </div>
    </div>
  );
};

const App: Component = () => (
  <div class={classes.container}>
    <DemoItem component={Schedulers} />
    <DemoItem component={ForkJoin} />
  </div>
);

export default App;
