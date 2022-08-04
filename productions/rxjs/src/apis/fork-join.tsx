import { Component, createSignal, onCleanup, onMount } from 'solid-js';
import { forkJoin, of, timer } from 'rxjs';
import { MessageModel } from '../log/message';
import Log from '../log';
import LogElement from '../log/element';

// const data1 = '0001';
// const data2 = '0010';
// const data3 = '0100';

// function step1(duration: number) {
//   return new Observable(observer => {
//     setTimeout(() => {
//       // if (err) observer.error(err);
//       observer.next(data1);
//     }, duration);
//   });
// }

const ForkJoin: Component<DemoProps> = props => {
  const [getMessage, setMessage] = createSignal<MessageModel[]>([]);
  const log = new Log();

  onMount(() => {
    props.bindStart(() => {
      const observable = forkJoin([
        of(1, 2, 3, 4),
        Promise.resolve(8),
        timer(4000),
      ]);
      observable.subscribe({
        next: value => {
          log.info(String(value));
          setMessage(log.all());
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

export default ForkJoin;
