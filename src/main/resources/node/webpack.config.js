const debug = process.env.NODE_ENV === 'development'
const webpack = require('webpack')
const path = require('path')
const TerserPlugin = require("terser-webpack-plugin")

module.exports = {
  entry: {
    index: path.join(__dirname, 'src', 'main.js')
  },
  output: {
    path: path.join(__dirname, '../public'),
    filename: 'main.js'
  },
  module: {
    rules: [{
      test: /\.jsx?$/,
      exclude: /(node_modules|bower_components)/,
      use: [{
        loader: 'babel-loader',
        options: {
          presets: [
            '@babel/preset-react',
            '@babel/preset-env',
            '@emotion/babel-preset-css-prop'
          ],
          retainLines: debug
        }
      }]
    }, {
      test: /\.svg$/,
      use: ['@svgr/webpack', 'url-loader']
    }]
  },
  optimization: debug ? {} : {
    minimize: true,
    minimizer: [new TerserPlugin()],
    moduleIds: 'named',
  },
  plugins: [
    new webpack.EnvironmentPlugin({
      API_BASE_URL: "",
    }),
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, '../public'),
    },
    allowedHosts: 'all',
    historyApiFallback: {
      disableDotRule: true,
    },
    port: process.env.PORT ? process.env.PORT : 'auto',
  },
}
