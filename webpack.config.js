const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: [
    'webpack-dev-server/client?http://localhost:8080',
    'webpack/hot/dev-server',
    'react-hot-loader/patch',
    './src/main.js'
  ],
  output: {
    filename: "[name].js",
    path: path.join(__dirname, '.tmp'),
    publicPath: "/js/"
  },
  devServer: {
    hot: true,
    contentBase: [
      path.join(__dirname, '.tmp'),
      path.join(__dirname, 'locales')
    ],
    watchContentBase: true,
    publicPath: '/js/',
    watchOptions: {
      aggregateTimeout: 300,
      poll: 300
    },
    overlay: {
      warnings: true,
      errors: true
    },
    // It suppress error shown in console, so it has to be set to false.
    quiet: false,
    // It suppress everything except error, so it has to be set to false as well
    // to see success build.
    noInfo: false,
    stats: {
      // Config for minimal console.log mess.
      assets: false,
      colors: true,
      version: false,
      hash: false,
      timings: true,
      chunks: false,
      chunkModules: false,
      warnings: true
    },
    historyApiFallback: true
  },
  resolve: {
    alias: {
      // Alias
      'config': __dirname + '/src/config',
      'components': __dirname + '/src/components/',
      'shared': __dirname + '/src/components/shared/',
      'actions': __dirname + '/src/actions/',
      'emitters': __dirname + '/src/emitters/',
      'stores': __dirname + '/src/stores/',

      // Libs
      'base': __dirname + '/src/bundles/base',
      'lazyload': __dirname + '/src/bundles/base/lazyload.js',
      'events': __dirname + '/node_modules/events/events.js',
      'async': __dirname + '/node_modules/async/lib/async.js',
      'jquery': __dirname + '/node_modules/jquery/dist/jquery.min.js',
      'values': __dirname + '/src/global/values.js',
      'raf': __dirname + '/src/vendors/al/raf.js',
      'resize': __dirname + '/src/vendors/al/resize.js',
      '_': __dirname + '/node_modules/lodash/index.js',
      'react': __dirname + '/node_modules/react/dist/react.min.js',
      'react-dom': __dirname + '/node_modules/react-dom/dist/react-dom.min.js',
      'page': __dirname + '/node_modules/page/page.js',
      'gsap': __dirname + '/node_modules/gsap/src/uncompressed/TweenMax.js',
      'webfont': __dirname + '/node_modules/webfontloader/webfontloader.js',
      'alt/utils': __dirname + '/node_modules/alt/utils/',
      'alt': __dirname + '/node_modules/alt/dist/alt.js',
      'signals': __dirname + '/node_modules/signals/dist/signals.js',
      'autobind': __dirname + '/node_modules/autobind-decorator/lib/index.js',
      'sniffer': __dirname + '/node_modules/sniffer/index.js'
    }
  },
  plugins: [
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery",
      "window.jQuery": "jquery"
    }),
    // new CopyWebpackPlugin([
    //         // Copy directory contents to {output}/
    //         { from: 'locales', to: 'test/locales' },
    //         // Copy directory contents to {output}/
    //         { from: resolve(__dirname, 'assets/index.html'), to: resolve(__dirname, 'test/index.html') }
    //
    //     ], {
    //         // By default, we only copy modified files during
    //         // a watch or webpack-dev-server build. Setting this
    //         // to `true` copies all files.
    //         copyUnmodified: true
    //     }),
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin()
  ],
  module: {
    rules: [
      {
        test: /\.json$/,
        loader: ['json-loader']
      },
      {
        test: /\.styl/,
        loader: ['style-loader', 'css-loader', 'stylus-loader', 'postcss-loader']
      },
      {
        test: /\.css$/,
        loader: ['style-loader', 'css-loader', 'postcss-loader']
      },
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: ['babel-loader']
      }
    ],
    noParse: [
      __dirname + '/node_modules/react/dist/react.min.js',
      __dirname + '/node_modules/page/page.js'
    ]
  },
  devtool: ''
};
