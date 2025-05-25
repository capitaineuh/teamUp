const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: './index.web.js',
  output: {
    filename: '[name].[contenthash].js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
    chunkFilename: '[name].[contenthash].js',
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
      minSize: 20000,
      maxSize: 244000,
      cacheGroups: {
        firebase: {
          test: /[\\/]node_modules[\\/]@?firebase[\\/]/,
          name: 'firebase',
          priority: 20,
          chunks: 'all',
        },
        react: {
          test: /[\\/]node_modules[\\/](react|react-dom|react-native-web)[\\/]/,
          name: 'react',
          priority: 10,
          chunks: 'all',
        },
        navigation: {
          test: /[\\/]node_modules[\\/]@react-navigation[\\/]/,
          name: 'navigation',
          priority: 15,
          chunks: 'all',
        },
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          priority: 5,
          chunks: 'all',
        },
      },
    },
    runtimeChunk: 'single',
  },
  performance: {
    hints: false,
    maxEntrypointSize: 512000,
    maxAssetSize: 512000,
  },
  resolve: {
    extensions: ['.web.js', '.js', '.web.tsx', '.tsx', '.web.ts', '.ts', '.web.jsx', '.jsx'],
    alias: {
      'react-native$': 'react-native-web',
    },
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'images/',
            },
          },
        ],
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, 'public'),
    },
    port: 3001,
    hot: true,
  },
};