import { Component } from 'solid-js';
import Observable from './apis/observable';
import Schedulers from './apis/schedulers';
import ForkJoin from './apis/fork-join';
import DemoAjax from './apis/ajax';
import DemoCombineLastest from './apis/combine-latest';

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
    <DemoItem component={Observable} />
    <DemoItem component={ForkJoin} />
    <DemoItem component={Schedulers} />
    <DemoItem component={DemoAjax} />
    <DemoItem component={DemoCombineLastest} />
  </div>
);

export default App;
