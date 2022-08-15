// const path = require('path');
// const WasmPackPlugin = require('@wasm-tool/wasm-pack-plugin');

module.exports = {
  // plugins: [
  //   new WasmPackPlugin({
  //     crateDirectory: path.join(__dirname, '.'),
  //   }),
  // ],
  // experiments: {
  //   asyncWebAssembly: true,
  // },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.json'],
  },
  module: {
    rules: [
      {
        test: /\.(ts)x?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            babelrc: false,
            configFile: false,
            presets: ['@babel/preset-env', 'solid', '@babel/preset-typescript'],
            plugins: [
              '@babel/plugin-syntax-dynamic-import',
              '@babel/plugin-proposal-class-properties',
              '@babel/plugin-proposal-object-rest-spread',
            ],
          },
        },
      },
    ],
  },
};
