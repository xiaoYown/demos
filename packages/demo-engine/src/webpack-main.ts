import path from 'path';
// import webpack from 'webpack';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';

const SimpleProgressWebpackPlugin = require('simple-progress-webpack-plugin');

const cssRegex = /\.(css)$/;

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const formatWebpackConfig = (config: PluginCompileConfigModel) => {
  const isProd = config.mode === 'production';
  const plugins = [
    new MiniCssExtractPlugin({
      filename: '[name].css',
    }),
    new SimpleProgressWebpackPlugin(),
  ];
  // if (!isProd) {
  //   plugins.push(
  //     new webpack.SourceMapDevToolPlugin({
  //       append: `\n//# sourceMappingURL=${config.publicPath}/[url]`,
  //       filename: '[name][ext].map',
  //     })
  //   );
  // }
  return {
    mode: 'production',
    entry: config.entry,
    devServer: {
      // compress: true,
      allowedHosts: 'all',
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': '*',
        'Access-Control-Allow-Headers':
          'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild',
      },
      port: 9000,
      static: {
        directory: path.resolve('public'),
      },
    },
    output: {
      filename: '[name].js',
      path: config.output,
      libraryTarget: 'system',
    },
    optimization: {
      minimize: isProd,
    },
    devtool: false,
    plugins,
    performance: {
      maxEntrypointSize: 2000000,
      maxAssetSize: 2000000,
    },
    resolve: {
      extensions: ['.ts'],
    },
    module: {
      rules: [
        {
          test: /\.(js|mjs)$/,
          loader: require.resolve('babel-loader'),
          options: {
            cacheDirectory: true,
            cacheCompression: false,
            compact: false,
            // sourceMap: !isProd(config.mode),
          },
        },
        {
          test: /\.ts?$/,
          use: [require.resolve('babel-loader'), require.resolve('ts-loader')],
          // options: {
          //   sourceMap: !isProd(config.mode),
          // },
        },
        {
          test: cssRegex,
          sideEffects: true,
          use: [
            MiniCssExtractPlugin.loader,
            {
              loader: require.resolve('css-loader'),
              options: {
                esModule: true,
                importLoaders: 1,
                // sourceMap: !isProd(config.mode),
                modules: {
                  mode: 'local',
                  localIdentName: `${config.classPrefix.replace(
                    /\\/g,
                    '_'
                  )}_[local]`,
                },
              },
            },
            {
              loader: require.resolve('postcss-loader'),
              options: {
                postcssOptions: {
                  plugins: [require.resolve('postcss-preset-env')],
                },
              },
            },
          ],
        },
      ],
    },
  };
};
