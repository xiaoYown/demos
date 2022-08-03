import { Component, createSignal, For, onMount } from 'solid-js';
import { Observable, observeOn, asyncScheduler } from 'rxjs';
import { MessageModel } from '../log/message';
import Log from '../log';

const LogElement = (props: { name: string; message: MessageModel[] }) => (
  <div>
    {
      <For each={props.message}>
        {item => (
          <div>
            <span>[{props.name}]: </span>
            <span class={item.type}>{item.text}</span>
          </div>
        )}
      </For>
    }
  </div>
);

const Schedulers: Component = () => {
  const [getMessage, setMessage] = createSignal<MessageModel[]>([]);
  const log = new Log();

  onMount(() => {
    const observable = new Observable<number>(observer => {
      observer.next(1);
      observer.next(2);
      observer.next(3);
      observer.complete();
    }).pipe(observeOn(asyncScheduler));

    console.log('just before subscribe');
    log.info('just before subscribe');

    observable.subscribe({
      next(x) {
        console.log(`got value ${x.toString()}`);
        log.info(`got value ${x.toString()}`);
      },
      error(err) {
        console.error(`something wrong occurred: ${err}`);
        log.error(`something wrong occurred: ${err}`);
      },
      complete() {
        console.log('done');
        log.info('done');
        setMessage(log.all());
        console.log(log.all());
      },
    });
    console.log('just after subscribe');
    log.info('just after subscribe');
  });

  return (
    <div>
      <LogElement name="SCHEDULERS" message={getMessage()} />
    </div>
  );
};

export default Schedulers;
