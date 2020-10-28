const path = require('path');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpack = require('webpack');
const ESLintPlugin = require('eslint-webpack-plugin');

const isProd = process.env.NODE_ENV === 'production';
const isDev = !isProd;

const filename = ext => isDev ? `bundle.${ext}` : `bundle.[hash].${ext}`;

module.exports = {
  context: path.resolve(__dirname, 'src'),
  mode: 'development',
  entry: ['@babel/polyfill', './index.js'], // точка входа приложения
  output: {
    filename: filename('js'), // точка выхода приложения
    path: path.resolve(__dirname, 'dist'),
  },
  resolve: {
    extensions: ['.js'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@core': path.resolve(__dirname, 'src/core'),
    },
  },
  devtool: isDev ? 'source-map' : false,
  devServer: {
    open: true,
    compress: true,
    hot: true,
    port: 8080,
  },
  plugins: [
    // Очищает директорию «dist» при каждой сборке проекта
    new CleanWebpackPlugin(),
    // Создает HTML-файл на основе шаблона
    new HtmlWebpackPlugin({
      title: 'Pure JavaScript Excel',
      template: 'index.html', // шаблон
      filename: 'index.html', // название выходного файла
      minify: {
        removeComments: isProd,
        collapseWhitespace: isProd,
      },
    }),
    // eslint-disable-next-line max-len
    // Копирует отдельные файлы или целые каталоги, которые уже существуют, в каталог сборки.
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, 'src/favicon.ico'),
          to: path.resolve(__dirname, 'dist'),
        },
      ],
    }),
    // Этот плагин извлекает CSS из javascript в отдельные файлы.
    new MiniCssExtractPlugin({
      filename: filename('css'),
    }),
    // Применять изменения только при горячей перезагрузке
    new webpack.HotModuleReplacementPlugin(),
    // eslint
    new ESLintPlugin(),
  ],
  module: {
    rules: [
      // Изображения
      {
        test: /\.(?:ico|gif|png|jpg|jpeg)$/i,
        type: 'asset/resource',
      },
      // CSS, Sass
      {
        test: /\.s[ac]ss$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
      },
      // Babel(JavaScript)
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['babel-loader', 'eslint-loader'],
      },
      // html-loader
      {
        test: /\.html$/i,
        loader: 'html-loader',
      },
    ],
  },
};
