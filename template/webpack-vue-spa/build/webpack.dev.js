const path = require('path');
const merge = require('webpack-merge');
const webpackConfig = require('./webpack.config');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = function(arg) {
  return merge(webpackConfig, {
    mode: 'development',
    devtool: 'cheap-module-eval-source-map',
    entry: {
      main: path.resolve(__dirname, `../src/views/main.js`)
    },

    output: {
      // 配置打包文件输出的目录
      path: path.resolve(__dirname, '../dist'),
      // 生成的 js 文件名称
      filename: 'js/[name].[hash:8].js',
      // 生成的 chunk 名称
      chunkFilename: 'js/[name].[hash:8].js',
      // 资源引用的路径
      publicPath: `/`
    },

    devServer: {
      hot: true,
      quiet: true,
      overlay: true,
      port: 8008,
      contentBase: './dist',
      // open: true,
      host: '0.0.0.0',
      // openPage: 'cn/',
      compress: true,
      disableHostCheck: true,
      historyApiFallback: true,
      proxy: {
        '/api': {
          target: '',
          pathRewrite: { '^/api': '' },
          changeOrigin: true
        }
      }
    },

    module: {
      rules: [
        {
          test: /\.css$/,
          use: [
            {
              loader: 'style-loader'
            },
            {
              loader: 'css-loader'
            },
            {
              loader: 'postcss-loader'
            }
          ]
        },
        {
          test: /\.(scss|sass)$/,
          use: [
            {
              loader: 'style-loader'
            },
            {
              loader: 'css-loader',
              options: {
                importLoaders: 2
              }
            },
            {
              loader: 'postcss-loader'
            },
            {
              loader: 'sass-loader',
              options: {
                implementation: require('dart-sass')
              }
            }
          ]
        },
        {
          test: /\.less$/,
          use: [
            {
              loader: 'style-loader'
            },
            'css-loader',
            {
              loader: 'postcss-loader'
            },
            'less-loader'
          ]
        }
      ]
    },
    plugins: [
      new webpack.HotModuleReplacementPlugin(),
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, '../public/index.html')
      })
    ]
  });
};
