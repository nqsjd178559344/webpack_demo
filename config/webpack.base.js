const path = require('path') // 处理路径 => 用import则需要对webpack进行babel处理
const HtmlWebpackPlugin = require('html-webpack-plugin') // 自动生成模板文件
const { CleanWebpackPlugin } = require('clean-webpack-plugin'); // 自动清除dist文件
const webpack = require('webpack');
// const BundleAnalyzer = require("webpack-bundle-analyzer").BundleAnalyzerPlugin
const argv = require("yargs").argv
const modeFlag = argv.env === 'production'

module.exports = {
    entry: {
        app: './src/index.js',
        demo: './src/demo.js',
        // jquery: 'jquery',
        // 其他库代码,eg:jquery
    },
    optimization: {
        splitChunks: {
            chunks: "all", // all:将共同代码打入一个新的包 | async | initial
            minSize: 30000,
            name: false, // 默认true => 表示默认生成名字
            /**
             * * 配置项
             *  minSize: 20000, // 抽取到的文件压缩前的最小大小
                maxSize: 20000, // 抽取到的文件压缩前的最大大小
                minChunks: 1, //! 引入后的最小引入次数, default = 1 => minChunks = 3则引入两次jquery时不采用压缩
                maxAsyncRequests: 30, // 最大按需加载次数
                maxInitialRequests: 30, // 最大初始化加载次数
                automaticNameDelimiter:'~', // 生成文件的分隔符
                automaticNameMaxLength:30, 
             */
            cacheGroups: {
                vendors: {
                    test: /[\\/]node_modules[\\/]/,
                    priority: -10, // 优先级配置
                    reuseExistingChunk: true,
                    filename: 'jquery.js' // ??? 为何指定filename报错,splitChunks.minSize 制定后就不报错了???
                },
                default: {
                    minChunks: 2,
                    priority: -20,
                    reuseExistingChunk: true, // 模块已打包的话则不再重新打包,默认复用
                    filename: 'common.js' //! splitChunks.name = false时需指定此处,否则默认为0
                },
            },
        }
    },
    output: {
        filename: '[name].[hash:8].js',
        path: path.resolve(__dirname, '../dist'), //! dist 路径更改
        // publicPath:'https://yideng.com/' // 自动注入地址更改: <script src="app.fafed529.js"> => <script src="https://yideng.com/app.fafed529.js"> //!如文件访问出错[图片等],首先排除这里
    },
    module: {
        rules: [
            {
                test: /\.js$/, // 指定检测文件类型
                use: {
                    loader: 'babel-loader',
                    options: { // ! .babelrc文件中
                        // ? 方法1
                        // presets:[["@babel/preset-env",{
                        //     /**
                        //      * You should also be sure that the version you pass to the `corejs` option matches the version specified in your `package.json`'s `dependencies` section. If it doesn't, you need to run one of the following commands:
                        //         npm install --save core-js@2    npm install --save core-js@3
                        //         yarn add core-js@2              yarn add core-js@3

                        //      */
                        // !    // ! 必须同时设置corejs 默认 corejs:2版本 => ES7/8等新特性只加于corejs:3版本中,且包含corejs:2内容
                        //     corejs:3,
                        //     useBuiltIns:'usage' // usage[仅引入需要的[自动引入]] | entry[只支持引入一次] | false[默认]
                        // }]], // 转换ES5+语法
                        // ? 方法2
                        // plugins:[
                        //     [
                        //         "@babel/plugin-transform-runtime",
                        //         { //@7.7.6
                        //             corejs:3,
                        //         }
                        //     ]
                        // ],
                        exclude: /node_modules/
                    }
                }
            },
            {
                test: /\.(jpg|png|gif)$/, // 指定检测文件类型
                use: {
                    loader: 'url-loader',
                    options: {
                        limit: 2048, // 小于此才会被直接打包进list.js,否则采用引入模式
                        // name: modeFlag ? 'assets/[name].[contenthash:5].[ext]' : 'assets/[name].[hash:5].[ext]', // ! 根据 modeFlag 不同使用不同配置
                        name: 'assets/[name].[hash:5].[ext]',
                    }
                }
            },
            {
                test: /\.ttf$/,
                use: {
                    loader: 'url-loader',
                    options: {
                        limit: 2048,
                        name: '[name].[hash:5].[ext]',
                        outputPath: 'fonts/'
                    }

                }
            },
            // {
            //     test: /\.less$/,
            //     // loader:['style-loader','css-loader','less-loader']
            //     use: [ // less从右至左||从下到上处理
            //         // !二者相同
            //         // 'style-loader', // 0.21.0 => 将在页面中使用[页面中新增style标签,将CSS注入HTML页面]
            //         // 'css-loader', // 0.28.1
            //         // 'postcss-loader', // 2.0.8
            //         // 'less-loader' // 4.1.0
            //         {
            //             loader: 'style-loader'
            //         },
            //         {
            //             loader: 'css-loader'
            //         },
            //         {
            //             loader: 'postcss-loader',
            //             options: { //! autoprefixer 需要配置浏览器版本
            //                 // plugins: [require("autoprefixer")],
            //                 // config:{
            //                 //     path:'postcss.config.js'
            //                 // }
            //                 // plugins: ()=>[require("autoprefixer")]
            //                 // postcssOptions: {
            //                 //     plugins: [
            //                 //       [
            //                 //         "autoprefixer",
            //                 //         {
            //                 //           // Options
            //                 //         },
            //                 //       ],
            //                 //     ],
            //                 //   },
            //             }
            //         },
            //         {
            //             loader: 'less-loader'
            //         }
            //     ]
            // }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: 'src/index.html', // 模板文件
        }), // ^4.0.0-beta.11
        new CleanWebpackPlugin(),
        // new webpack.ProvidePlugin({ // 全局注入[代码中无需import引入]
        //     $:'jquery',
        //     jQuery:'jquery'
        // })
        // new BundleAnalyzer()
    ]
}