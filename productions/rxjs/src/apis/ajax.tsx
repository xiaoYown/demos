import { Component, createSignal, onCleanup, onMount } from 'solid-js';
import { switchMap, of, catchError } from 'rxjs';
import { fromFetch } from 'rxjs/fetch';

import { MessageModel } from '../log/message';
import Log from '../log';
import LogElement from '../log/element';
import { store } from '../store';

const DemoAjax: Component<DemoProps> = props => {
  const [getMessage, setMessage] = createSignal<MessageModel[]>([]);
  const log = new Log();

  const func = () => {
    const dataURL = `${store.publicPath}data-01.json`;

    const fetch1 = fromFetch(dataURL).pipe(
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
  };

  onMount(() => {
    props.bindStart(() => {
      log.clean();
      func();
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

export default DemoAjax;
