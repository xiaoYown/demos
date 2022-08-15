import { Component, createSignal, onCleanup, onMount } from 'solid-js';
import { Observable } from 'rxjs';
import { MessageModel } from '../log/message';
import Log from '../log';
import LogElement from '../log/element';

const DemoObservable: Component<DemoProps> = props => {
  const [getMessage, setMessage] = createSignal<MessageModel[]>([]);
  const log = new Log();

  onMount(() => {
    props.bindStart(() => {
      const observable = new Observable(subscriber => {
        subscriber.next(1);
        subscriber.next(2);
        subscriber.next(3);
        setTimeout(() => {
          subscriber.next(4);
          subscriber.complete();
        }, 1000);
      });
      observable.subscribe({
        next: value => {
          log.info(String(value));
        },
        complete: () => {
          log.info('complete!');
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

export default DemoObservable;
