const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: './js/client.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
  },
  devtool: 'eval-source-map',
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
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html',
      filename: 'index.html',
      // Убедитесь, что указанный путь существует, или уберите эту строку
      // favicon: './path/to/favicon.ico',
    }),
    new HtmlWebpackPlugin({
      template: './hall.html',
      filename: 'hall.html',
    }),
    new HtmlWebpackPlugin({
      template: './login.html',
      filename: 'login.html',
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: 'images', to: 'images', noErrorOnMissing: true },
        { from: 'css', to: 'css', noErrorOnMissing: true },
        { from: 'js', to: 'js', noErrorOnMissing: true },
      ],
    }),
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    compress: true,
    port: 9000,
    hot: true,
    historyApiFallback: true,
  },
};
