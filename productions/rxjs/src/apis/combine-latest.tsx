import { Component, createSignal, onCleanup, onMount } from 'solid-js';
import { switchMap, of, catchError, combineLatest } from 'rxjs';
import { fromFetch } from 'rxjs/fetch';

import { MessageModel } from '../log/message';
import Log from '../log';
import LogElement from '../log/element';
import { store } from '../store';

const DemoCombineLatest: Component<DemoProps> = props => {
  const [getMessage, setMessage] = createSignal<MessageModel[]>([]);
  const log = new Log();

  const func = () => {
    const data1URL = `${store.publicPath}data-01.json`;
    const fetch1 = fromFetch(data1URL).pipe(
      switchMap(response => {
        if (response.ok) {
          return response.json();
        }
        return of({ error: true, message: `Error ${response.status}` });
      }),
      catchError(err => {
        log.error(JSON.stringify(err));
        return of({ error: true, message: err.message });
      })
    );

    fetch1.subscribe({
      next: result => log.info(JSON.stringify(result)),
      complete: () => {
        log.info('done 1');
        setMessage(log.all());
      },
    });

    const data2URL = `${store.publicPath}data-03.json`;
    const fetch2 = fromFetch(data2URL).pipe(
      switchMap(response => {
        if (response.ok) {
          return response.json();
        }
        return of({ error: true, message: `Error ${response.status}` });
      }),
      catchError(err => {
        log.error(JSON.stringify(err));
        return of({ error: true, message: err.message });
      })
    );

    fetch2.subscribe({
      next: result => log.info(JSON.stringify(result)),
      complete: () => {
        log.info('done 1');
        setMessage(log.all());
      },
    });

    const combinedFetcher = combineLatest([fetch1, fetch2]);
    combinedFetcher.subscribe(value => console.log('value', value));
  };

  onMount(() => {
    props.bindStart(func);
  });

  onCleanup(() => {
    log.destroy();
  });

  return (
    <div>
      <h3>[Promise.All 替换方案]</h3>
      <LogElement name="Log" message={getMessage()} />
    </div>
  );
};

export default DemoCombineLatest;
