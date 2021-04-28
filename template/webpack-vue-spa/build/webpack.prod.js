const path = require('path');
const merge = require('webpack-merge');
const webpackConfig = require('./webpack.config');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssnanoPlugin = require('@intervolga/optimize-cssnano-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin;

const Analyze = false;

module.exports = function(env, arg) {
  const config = merge(webpackConfig, {
    mode: 'production',
    entry: {
      mainD: path.resolve(__dirname, '../src/views/main.js')
    },
    output: {
      // 配置打包文件输出的目录
      path: path.resolve(__dirname, `../dist`),
      // 生成的 js 文件名称
      filename: 'js/[name].[contenthash:8].js',
      // 生成的 chunk 名称
      chunkFilename: 'js/[name].[contenthash:8].js',
      // 资源引用的路径
      publicPath: `/`
    },
    optimization: {
      splitChunks: {
        cacheGroups: {
          vendors: {
            name: 'chunk-vendors',
            test: /[\\\/]node_modules[\\\/]/,
            priority: -10,
            chunks: 'initial'
          },
          commons: {
            name: 'chunk-common',
            minChunks: 2,
            // maxSize: 100,
            minSize: 1,
            priority: -20,
            chunks: 'all',
            reuseExistingChunk: true
          }
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
              loader: MiniCssExtractPlugin.loader
            },
            {
              loader: 'postcss-loader'
            },
            {
              loader: 'css-loader'
            }
          ]
        },
        {
          test: /\.(scss|sass)$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader
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
                implementation: require('dart-sass'),
                sourceMap: true,
                config: {
                  path: 'postcss.config.js' // 这个得在项目根目录创建此文件
                }
              }
            }
          ]
        },
        {
          test: /\.less$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader
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
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, `../public/index.html`),
        filename: 'index.html',
        chunks: ['chunk-vendors', 'chunk-common', 'mainDesktop']
      }),
      new MiniCssExtractPlugin({
        filename: 'css/[name].[contenthash:8].css',
        chunkFilename: 'css/[name].[contenthash:8].css'
      }),
      new OptimizeCssnanoPlugin({
        sourceMap: true,
        cssnanoOptions: {
          preset: [
            'default',
            {
              mergeLonghand: false,
              cssDeclarationSorter: false
            }
          ]
        }
      }),
      new CopyWebpackPlugin([
        {
          from: path.resolve(__dirname, `../public`),
          to: path.resolve(__dirname, `../dist`)
        }
      ]),
      new CleanWebpackPlugin()
    ]
  });

  if (Analyze === true) {
    config.plugins.push(
      new BundleAnalyzerPlugin({
        analyzerMode: 'static'
      })
    );
  }

  return config;
};
