import webpack from 'webpack';

import {
  createWebpackConfig,
  getCustomWebpackConfig,
  handlePluginCompileConfig,
} from './utils';

function build(): Promise<string> {
  return new Promise((resolve, reject) => {
    const webpackConfig = createWebpackConfig(
      getCustomWebpackConfig(),
      handlePluginCompileConfig()
    );

    const compiler = webpack(webpackConfig);

    compiler.run((error: any, stats: any) => {
      if (error) {
        // let errMessage = error.message;
        reject(error);
        return;
      }
      if (stats?.hasErrors()) {
        reject(stats?.toString({ all: false, warnings: false, errors: true }));
        return;
      }
      resolve('complete');
    });
  });
}

export const compile = (): Promise<string> =>
  new Promise((resolve, reject) => {
    build()
      .then(message => {
        resolve(message);
      })
      .catch(error => {
        console.log('[DEMO ENGINE]:', error);
        reject(error);
      });
  });
