const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

const isDevelopment = process.env.NODE_ENV === 'development';
const isProduction = process.env.NODE_ENV === 'production';

const getStyleLoaders = (cssModules) => {
  const loaders = [
    isDevelopment && 'style-loader',
    isProduction && MiniCssExtractPlugin.loader,
    {
      loader: 'css-loader',
      options: {
        modules: cssModules,
        sourceMap: isDevelopment,
      },
    },
  ].filter(Boolean);

  return loaders;
};

module.exports = {
  mode: process.env.NODE_ENV,
  entry: './src/web/client/src/index.tsx',
  output: {
    path: path.resolve(__dirname, '../build'),
    filename: 'js/[name].[contenthash:8].js',
    chunkFilename: 'js/[name].[contenthash:8].chunk.js',
    publicPath: '/',
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
    alias: {
      '@': path.resolve(__dirname, '../src'),
    },
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: getStyleLoaders(false),
        exclude: /\.module\.css$/,
      },
      {
        test: /\.module\.css$/,
        use: getStyleLoaders(true),
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/web/client/public/index.html',
    }),
    new MiniCssExtractPlugin({
      filename: 'css/[name].[contenthash:8].css',
      chunkFilename: 'css/[name].[contenthash:8].chunk.css',
    }),
  ],
  optimization: {
    minimize: isProduction,
    minimizer: [
      new TerserPlugin(),
      new OptimizeCSSAssetsPlugin(),
    ],
    splitChunks: {
      chunks: 'all',
    },
  },
  devServer: {
    contentBase: './build',
    port: 3000,
    hot: true,
    historyApiFallback: true,
  },
  devtool: isDevelopment ? 'inline-source-map' : false,
};