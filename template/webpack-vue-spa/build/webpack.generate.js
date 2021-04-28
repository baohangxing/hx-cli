const path = require('path');
const merge = require('webpack-merge');
const webpack = require('webpack');
const webpackConfig = require('./webpack.config');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
var PrerenderSpaPlugin = require('prerender-spa-plugin');

module.exports = function(env, arg) {
  const config = merge(webpackConfig, {
    mode: 'production',
    entry: {
      main: path.resolve(__dirname, '../src/views/main.js')
    },
    output: {
      // 配置打包文件输出的目录
      path: path.resolve(__dirname, `../dist-seo`),
      // 生成的 js 文件名称
      filename: 'js/[name].[contenthash:8].js',
      // 生成的 chunk 名称
      chunkFilename: 'js/[name].[contenthash:8].js',
      // 资源引用的路径
      publicPath: `/`
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
        template: path.resolve(__dirname, '../public/index.html')
      }),
      new MiniCssExtractPlugin({
        filename: 'css/[name].[contenthash:8].css',
        chunkFilename: 'css/[name].[contenthash:8].css'
      }),
      new CopyWebpackPlugin([
        {
          from: path.resolve(__dirname, '../public'),
          to: path.resolve(__dirname, `../dist-seo`)
        }
      ]),
      new CleanWebpackPlugin(),

      new PrerenderSpaPlugin({
        // 生成文件的路径，也可以与webpack打包的一致。
        staticDir: path.resolve(__dirname, `../dist-seo`),
        outputDir: path.resolve(__dirname, `../dist-seo`),
        indexPath: path.resolve(__dirname, `../dist-seo/index.html`),

        // html压缩的配置
        minify: {
          // collapseBooleanAttributes: true,
          // collapseWhitespace: true,
          // decodeEntities: true,
          // keepClosingSlash: true,
          // sortAttributes: true,
        },
        // 对应自己的路由文件，比如index有参数，就需要写成 /index/param1。
        routes: [`/home`, `/about`].map(val => {
          return `${val}`;
        }),

        // 这个很重要，如果没有配置这段，也不会进行预编译
        renderer: new PrerenderSpaPlugin.PuppeteerRenderer({
          renderAfterTime: 5000, // 触发渲染的时间，用于获取数据后再保存渲染结果
          headless: false, // 是否打开浏览器，false 是打开。可用于 debug 检查渲染结果
          // inject: {},
          // renderAfterElementExists: '#app',
          renderAfterDocumentEvent: 'render-event'
          // args: ['--no-sandbox', '--disable-setuid-sandbox']
        })
      })
    ]
  });

  return config;
};
