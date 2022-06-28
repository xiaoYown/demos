import { createSignal, onCleanup, onMount } from 'solid-js';

const WheelEvent = () => {
  const [getZoom, setZoom] = createSignal(1);
  const action = (event: WheelEvent) => {
    // 缩放处理
    if (event.wheelDelta % 240 === 0) {
      event.preventDefault();
      let zoom = getZoom() + event.wheelDelta / 100 / 240;

      if (zoom < 0.1) zoom = 0.1;
      if (zoom > 2) zoom = 2;
      setZoom(zoom);
    }
  };

  onMount(() => {
    document
      .getElementById('wheel-event')
      ?.addEventListener('wheel', action, { passive: false });
  });
  onCleanup(() => {
    document
      .getElementById('wheel-event')
      ?.removeEventListener('wheel', action);
  });

  return (
    <div>
      <div
        id="wheel-event"
        style={{
          width: '800px',
          height: '800px',
          background: '#cccccc',
          'touch-action': 'none',
          transform: `scale(${getZoom()})`,
        }}
      ></div>
    </div>
  );
};

export default WheelEvent;
