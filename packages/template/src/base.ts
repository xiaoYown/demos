class VisComponent<T> {
  // eslint-disable-next-line no-useless-constructor
  constructor(_props: T) {}

  public mount = (): void => {};

  public unmount = (): void => {};
}

export default VisComponent;
