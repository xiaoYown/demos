import { createSignal, onCleanup, onMount } from 'solid-js';

const formatShowContent = (_event: any) => `
Orientation of the device: ${window.screen.orientation?.angle}
`;

const OrientationEvent = () => {
  const [getContent, setContent] = createSignal(formatShowContent({}));
  const action = (event: any) => {
    console.log(event);
    setContent(formatShowContent(event));
  };

  onMount(() => {
    window.addEventListener('orientationchange', action);
  });
  onCleanup(() => {
    window.removeEventListener('orientationchange', action);
  });

  return (
    <div>
      <pre>{getContent()}</pre>
    </div>
  );
};

export default OrientationEvent;
