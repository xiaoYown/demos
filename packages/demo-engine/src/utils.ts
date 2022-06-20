import { existsSync, readFileSync } from 'fs';
import { resolve } from 'path';

import { formatWebpackConfig } from './webpack-main';

const systemjsInterop = require('systemjs-webpack-interop/webpack-config');
const { merge } = require('webpack-merge');

export const getPackage = () =>
  JSON.parse(
    readFileSync(resolve('./package.json'), { encoding: 'utf8' }) as string
  );

export const getCustomWebpackConfig = (): any => {
  const customConfigPath = resolve('webpack.config.merge.js');
  const config = {};
  if (existsSync(customConfigPath)) {
    const webpackConfigCustom = require(customConfigPath);
    Object.assign(config, webpackConfigCustom);
  }
  return config;
};

export const handlePluginCompileConfig = (): any => {
  const { name, version } = getPackage();
  return formatWebpackConfig({
    mode: 'development',
    publicPath: name,
    classPrefix: name,
    name,
    version,
    output: resolve('dist'),
    entry: resolve('src/main'),
  });
};

export const createWebpackConfig = (...configs: any[]): any => {
  const webpackConfig = merge(...configs);

  return systemjsInterop.modifyWebpackConfig(webpackConfig);
};
