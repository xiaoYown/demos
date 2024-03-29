import { Component, createSignal, onCleanup, onMount } from 'solid-js';
import { forkJoin, timer, of } from 'rxjs';
import { MessageModel } from '../log/message';
import Log from '../log';
import LogElement from '../log/element';

const DemoForkJoin: Component<DemoProps> = props => {
  const [getMessage, setMessage] = createSignal<MessageModel[]>([]);
  const log = new Log();

  onMount(() => {
    props.bindStart(() => {
      const observable = forkJoin([
        of(1, 2, 3, 4),
        Promise.resolve(8),
        timer(2000),
      ]);
      observable.subscribe({
        next: value => {
          log.info(String(value));
        },
        complete: () => {
          log.info('This is how it ends!');
          setMessage(log.all());
        },
      });
    });
  });

  onCleanup(() => {
    log.destroy();
  });

  return (
    <div>
      <LogElement name="Log" message={getMessage()} />
    </div>
  );
};

export default DemoForkJoin;
