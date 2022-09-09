import { Component, onCleanup } from 'solid-js';

// import { io, Socket } from 'socket.io-client';

type SocketStatus = 'connecting' | 'success' | 'failed' | 'close';

const App: Component = () => {
  // const sockets: WebSocket[] = [];
  // const sockets: {
  //   status: 'success' | 'failed';
  //   io: WebSocket;
  // }[] = [];
  const sockets = new Map<
    string,
    {
      status: SocketStatus;
      socket: WebSocket;
    }
  >();
  let stamp = 0;
  let input: HTMLInputElement | null = null;

  onCleanup(() => {});

  const getSocketByUrl = (url: string) => {
    const currentStamp = url.match(/stamp=(\d+)/)?.[1];
    return sockets.get(currentStamp as string);
  };

  const updateSocketStatusByUrl = (url: string, status: SocketStatus) => {
    const currentSocket = getSocketByUrl(url as string);
    currentSocket && (currentSocket.status = status);
  };

  const start = () => {
    const value = Number.parseInt(input?.value as string, 10);
    const num = !Number.isNaN(value) ? value : 1;
    let socket: WebSocket | null = null;

    for (let i = 0; i < num; i += 1) {
      stamp += 1;
      socket = new WebSocket(`ws://127.0.0.1:8000/ws?stamp=${stamp}`);
      socket.onopen = (e: any) => {
        updateSocketStatusByUrl(e?.target?.url as string, 'success');

        console.log('与服务器成功建立连接');
      };
      socket.onmessage = e => {
        console.log(e.data);
      };
      socket.onerror = (e: any) => {
        updateSocketStatusByUrl(e?.target?.url as string, 'failed');
        console.log('连接错误', e);
      };
      socket.onclose = (e: any) => {
        updateSocketStatusByUrl(e?.target?.url as string, 'close');
        console.log('连接关闭');
      };
      sockets.set(String(stamp), {
        status: 'connecting',
        socket,
      });
    }
  };

  const cleanup = () => {
    sockets.forEach(({ status, socket }) => {
      status === 'success' && socket?.close();
    });
  };

  const sendMsg = () => {
    sockets.forEach(({ status, socket }) => {
      status === 'success' && socket.send('我是客户端发送的数据');
    });
  };

  return (
    <div>
      <input
        ref={el => {
          input = el;
        }}
        type="text"
        style={{ border: '1px solid #000' }}
      />
      <br />
      <button onClick={start}>启动连接</button>
      <br />
      <button onClick={cleanup}>断开连接</button>
      <br />
      <button onClick={sendMsg}>发送信息</button>
    </div>
  );
};

export default App;
