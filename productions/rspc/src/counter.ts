export function setupCounter(element: HTMLButtonElement): void {
  let counter = 0;
  const setCounter = (count: number) => {
    counter = count;
    // eslint-disable-next-line no-param-reassign
    element.innerHTML = `count is ${counter}`;
  };
  element.addEventListener('click', () => setCounter(counter + 1));
  setCounter(0);
}
