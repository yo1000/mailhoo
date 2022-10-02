const debug = process.env.NODE_ENV === 'development'
const webpack = require('webpack')
const path = require('path')

module.exports = {
  entry: {
    index: path.join(__dirname, 'src', 'index.js')
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
          ]
        }
      }]
    }, {
      test: /\.svg$/,
      use: ['@svgr/webpack', 'url-loader']
    }]
  },
  plugins: [
    new webpack.EnvironmentPlugin({
      API_BASE_URL: ""
    }),
  ].concat(debug ? [] : [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({
      mangle: false,
      sourcemap: false
    }),
  ]),
  devServer: {
    static: {
      directory: path.join(__dirname, '../public'),
    },
    allowedHosts: 'all',
    port: process.env.PORT ? process.env.PORT : 'auto',
  },
}
