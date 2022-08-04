import { For, JSXElement } from 'solid-js';
import { MessageModel } from './message';

import logClasses from './classes.module.css';

const LogElement = (props: {
  name: string;
  message: MessageModel[];
}): JSXElement => (
  <div>
    {
      <For each={props.message}>
        {item => (
          <div>
            <span>[{props.name}]: </span>
            <span class={logClasses[`s-${item.type}`]}>{item.text}</span>
          </div>
        )}
      </For>
    }
  </div>
);

export default LogElement;
