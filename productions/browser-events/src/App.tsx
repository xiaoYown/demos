import { Component, createSignal, For, onCleanup, Show } from 'solid-js';

import OrientationEvent from './event-demos/orientation-event';
import WheelEvent from './event-demos/wheel-event';

import './App.css';

const events = [OrientationEvent, WheelEvent];

const App: Component = _props => {
  const [getCurrentEvent, setCurrentEvent] = createSignal('');

  onCleanup(() => {});

  return (
    <div class='container'>
      <div class='nav'>
        <Show when={getCurrentEvent()}>
          <div class='nav-item' onClick={() => setCurrentEvent('')}>
            Back
          </div>
        </Show>
        <Show when={!getCurrentEvent()}>
          <For each={events}>
            {item => (
              <span
                class='nav-item'
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
