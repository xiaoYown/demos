export interface DemoAdapterOptions {
  publicPath: string;
  container: string;
}

class DemoAdapter {
  constructor(options: DemoAdapterOptions) {
    this.publicPath = options.publicPath;
    this.container = options.container;
  }

  public publicPath = '';

  public container = '';

  public mount = () => {};

  public unmount = () => {};
}

export default DemoAdapter;
