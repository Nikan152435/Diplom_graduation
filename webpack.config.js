const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: './js/client.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        type: 'asset/resource',
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html',
      filename: 'index.html', // файл будет сохранен как index.html в папке dist
    }),
    new HtmlWebpackPlugin({
      template: './hall.html',
      filename: 'hall.html', // файл будет сохранен как hall.html в папке dist
    }),
    new CopyWebpackPlugin({
      patterns: [
          { from: 'images', to: 'images' },
          { from: 'css', to: 'css' },
          { from: 'js', to: 'js' },
      ],
    }),
  ],
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    port: 9000,
  },
};