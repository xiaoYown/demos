import { Component, createSignal, For, onCleanup, Show } from 'solid-js';

import OrientationEvent from './event-demos/orientation-event';
import WheelEvent from './event-demos/wheel-event';

import classes from './App.module.css';

const events = [OrientationEvent, WheelEvent];

const App: Component = _props => {
  const [getCurrentEvent, setCurrentEvent] = createSignal('');

  onCleanup(() => {});

  return (
    <div class={classes.container}>
      <div class={classes.nav}>
        <Show when={getCurrentEvent()}>
          <div class={classes['nav-item']} onClick={() => setCurrentEvent('')}>
            Back
          </div>
        </Show>
        <Show when={!getCurrentEvent()}>
          <For each={events}>
            {item => (
              <span
                class={classes['nav-item']}
                onClick={() => setCurrentEvent(item.name)}
              >
                {item.name}
              </span>
            )}
          </For>
        </Show>
      </div>
      <For each={events}>
        {EventView => (
          <Show when={getCurrentEvent() === EventView.name}>
            <EventView></EventView>
          </Show>
        )}
      </For>
    </div>
  );
};

export default App;
