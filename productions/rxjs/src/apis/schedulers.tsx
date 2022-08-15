import { Component, createSignal, onCleanup, onMount } from 'solid-js';
import { Observable, observeOn, asyncScheduler } from 'rxjs';
import { MessageModel } from '../log/message';
import Log from '../log';
import LogElement from '../log/element';

const DemoSchedulers: Component<DemoProps> = props => {
  const [getMessage, setMessage] = createSignal<MessageModel[]>([]);
  const log = new Log();

  onMount(() => {
    props.bindStart(() => {
      const observable = new Observable<number>(observer => {
        observer.next(1);
        observer.next(2);
        observer.next(3);
        observer.complete();
      }).pipe(observeOn(asyncScheduler));

      log.info('just before subscribe');

      observable.subscribe({
        next(x) {
          log.info(`got value ${x.toString()}`);
        },
        error(err) {
          log.error(`something wrong occurred: ${err}`);
        },
        complete() {
          log.info('done');
          setMessage(log.all());
        },
      });
      log.info('just after subscribe');
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

export default DemoSchedulers;
