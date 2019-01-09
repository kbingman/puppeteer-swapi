const webpack = require('webpack');
const path = require('path');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

const { version } = require('./package.json');

const DEV_PORT = 9191;

const config = {
  entry: [
    `webpack-dev-server/client?http://localhost:${DEV_PORT}`,
    'webpack/hot/dev-server',
    path.resolve(__dirname, 'src', 'index.tsx')
  ],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/',
    sourceMapFilename: 'bundle.js.map'
  },
  module: {
    rules: [
      { test: /\.tsx?$/, loader: 'awesome-typescript-loader' },
      {
        test: /\.svg$/,
        use: [
          {
            loader: 'react-svg-loader',
            options: {
              jsx: false
            }
          }
        ]
      },
      {
        test: /\.(png|jpg)$/,
        loader: 'url-loader',
        include: [path.resolve(__dirname, 'src')]
      },
      // {
      //   test: /\.css$/,
      //   // exclude: /node_modules/,
      //   use: [
      //     {
      //       loader: require.resolve('style-loader')
      //     },
      //     {
      //       loader: require.resolve('css-loader'),
      //       options: {
      //         localIdentName: '[name]__[local]--[hash:base64:5]',
      //         modules: true
      //       }
      //     }
      //   ]
      // },
      {
        test: /\.html$/,
        use: 'html-loader?attrs[]=video:src'
      }
    ]
  },
  resolve: {
    mainFields: ['module', 'main'],
    modules: ['node_modules', path.resolve(__dirname, 'src')],
    extensions: ['.ts', '.tsx', '.js', '.css']
  },
  devtool: 'source-map',
  target: 'web',
  stats: 'verbose',

  plugins: [
    new webpack.EnvironmentPlugin(['NODE_ENV']),
    new webpack.DefinePlugin({
      'process.env': {
        VERSION: `v${version}`
      }
    })
  ],

  devServer: {
    port: DEV_PORT,
    hot: true,
    hotOnly: true,
    publicPath: '/',
    headers: { 'Access-Control-Allow-Origin': '*' },
    https: false
  }
};

if (process.env.NODE_ENV === 'development') {
  config.devtool = 'eval';
  config.output.publicPath = config.devServer.publicPath = `https://localhost:${DEV_PORT}/`;

  config.entry.bundle = ['react-hot-loader/patch'].concat(config.entry.bundle);

  config.plugins = config.plugins.concat([
    // new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new ForkTsCheckerWebpackPlugin(),
    new webpack.WatchIgnorePlugin([/css\.d\.ts$/])
  ]);
}

module.exports = config;
