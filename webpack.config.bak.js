const path = require('path') // 处理路径 => 用import则需要对webpack进行babel处理
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin') // 自动生成模板文件
const { CleanWebpackPlugin } = require('clean-webpack-plugin'); // 自动清除dist文件

module.exports = {
    mode: 'production', // production 默认[打包文件压缩] development[不被压缩]
    // mode: 'production',
    // entry:'./src/index.js', //! 相对位置 简写
    entry: {
        // main: './src/index.js',// 单一入口
        app: './src/index.js',
        demo: './src/demo.js'
    },
    devtool:'none', // 默认 none
    // devtool:'source-map',  // 生成一个同名的map文件 // eval:复杂代码下提示不够详细
    // devtool: 'cheap-module-eval-source-map', // 定位至源码的第几行[开发模式下推荐]
    // devtool:'cheap-module-source-map', // 不显示源码[生产模式下推荐]
    devServer:{ 
        // 定义服务访问目录
        // 预安装 webpack-dev-server@3.9.0 // 监听本地更改
        contentBase: path.join(__dirname,'dist'),
        port:8888,
        // proxy:{ // 代理
        //     '/api':'localhost:8081'
        // },
        hot:true
    },
    output: {
        // filename: 'dist.js', // 自定义打包文件名[单一入口]
        filename: '[name].[hash:8].js', // 自定义打包文件名[不要指定为ext类型]
        // 绝对路径
        path: path.resolve(__dirname, 'dist'), // __dirname=> 项目根路径
        // publicPath:'https://yideng.com/' // 自动注入地址更改: <script src="app.fafed529.js"> => <script src="https://yideng.com/app.fafed529.js"> //!如文件访问出错[图片等],首先排除这里
    },
    module: {
        rules: [
            {
                test: /\.js$/, // 指定检测文件类型
                use: {
                    loader: 'babel-loader',
                    options:{ // ! .babelrc文件中
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
                        exclude:/node_modules/
                    }
                }
            },
            {
                test: /\.(jpg|png|gif)$/, // 指定检测文件类型
                use: {
                    loader: 'url-loader',
                    options: {
                        limit: 2048, // 小于此才会被直接打包进list.js,否则采用引入模式
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
            {
                test: /\.less$/,
                // loader:['style-loader','css-loader','less-loader']
                use: [ // less从右至左||从下到上处理
                    // !二者相同
                    // 'style-loader', // 0.21.0 => 将在页面中使用[页面中新增style标签,将CSS注入HTML页面]
                    // 'css-loader', // 0.28.1
                    // 'postcss-loader', // 2.0.8
                    // 'less-loader' // 4.1.0
                    {
                        loader: 'style-loader'
                    },
                    {
                        loader: 'css-loader'
                    },
                    {
                        loader: 'postcss-loader',
                        options: { //! autoprefixer 需要配置浏览器版本
                            // plugins: [require("autoprefixer")],
                            // config:{
                            //     path:'postcss.config.js'
                            // }
                            // plugins: ()=>[require("autoprefixer")]
                            // postcssOptions: {
                            //     plugins: [
                            //       [
                            //         "autoprefixer",
                            //         {
                            //           // Options
                            //         },
                            //       ],
                            //     ],
                            //   },
                        }
                    },
                    {
                        loader: 'less-loader'
                    }
                ]
            }
        ]
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(), // vue中已自动配置module.hot.accept等,可不写
        new HtmlWebpackPlugin({
            template: 'src/index.html', // 模板文件
        }), // ^4.0.0-beta.11
        new CleanWebpackPlugin(),
    ]
}

 // 读取指定配置: npx webpack --config webpack.config.js
 // 检测生成的dist文件是否可用: 创建index.html文件并引入
/**
 * !执行 build 后的显示
   > webpack_demo@1.0.0 build G:\work\github\webpack_demo
   > webpack

   Hash: 9b73685ba1c71c12e449 // 对应每次打包后的唯一值
   Version: webpack 4.16.1 // webpack 版本号
   Time: 100ms // 打包时间
   Built at: 2021/09/05 上午10:59:52
   打包后文件名  打包后文件大小 [Chunk Id: 根据打包后文件数量累加]  入口文件名[默认 main.js]
   Asset:        Size:             Chunks                          Chunk Names
   dist.js       983 bytes         0  [emitted]                     main

   Entrypoint main = dist.js
   [0] ./src/index.js + 1 modules 102 bytes {0} [built]
       | ./src/index.js 35 bytes [built]
       | ./src/list.js 67 bytes [built]

 */

/**
 * !file-loader流程:
 *  1. 发现 图片文件
 *  2. 改名字[可指定]后打包入dist文件,然后移入dist文件后得到图片名称,作为返回值返回给引入的变量
 * !url-loader:file-loader 高配版[转为base64格式]
 */
/**
 * postcss-loader:处理css兼容问题
 * ? 如不是webpack官方包,则可去npm官网查找
 */
/**
 * !webpack4中使用autoprefixer失效的问题 => 需要设置支持的浏览器
 * 1. package.json: ( 与 devDependencies 同级 )
"browserslist": [
    "defaults",
    "not ie <= 8",
    "last 2 versions",
    "> 1%",
    "iOS >= 7",
    "Android >= 4.0"
  ]
  2. postcss.config:
  module.exports = {
  plugins: [
    require('autoprefixer')({
      browsers: ['Android >= 4.0', 'iOS >= 7']
    })
  ]

  ** 3. .browserslistrc文件
}
 */

/**
 * ! webpack-dev-server => 仅保存于内存中,不会生成dist文件
 * ! Uncaught TypeError: Cannot read property 'call' of undefined => webpack@^4.16.1版本特有错误,重新安装其他版本的webpack
 */
/**
 * !已使用@babel/preset-env,为何还不会转义map?
 * 标准引入的语法: 箭头函数 let、const等,可转换
 * 标准引入的全局变量/部分原生对象的新增的原型链上的方法 Promise Symbol Set 等 不会转换 => 用polyfill
 * ! @babel/polyfill: 
 *   1. 默认引入全部,引入部分则需要配置[@babel/preset-env]
 * * 2. 以全局变量方法引入,开发类库|组件库时可能造成全局变量的污染
 *   3. 配套使用: corejs
 * ! @babel/plugin-transform-runtime: 以闭包形式注入,保证全局变量不被污染
 *      1. 配套使用: @babel/runtime-corejs3
 * 
 */

/**
 * !webpack默认打包全部代码[包括未使用的代码]
 * 解决方式:
 *  1. webpack3: 插件:uglifyjsWebpackPlugins
 *  2. webpack4: mode:production
 */

/**
 * 总结:需要什么安什么
 * ?注意:版本匹配<webpack4时尽量选择安装2年前的插件>
 * !webpack文档更新不及时,loader更新太快,只能安装低版本loader
 */

/** 
 * ! 用 lodash-es 替换 lodash 后 
 *    mode = development : 使用 lodash-es 的打包后的体积为使用 lodash 的打包后的体积的2倍
 *    mode = production : 使用 lodash-es 的打包后的体积为使用 lodash 的打包后的体积的1/4↓倍
 */

/**
 * ! webpack 报错: 无效配置
 * Invalid configuration object. Webpack has been initialised using a configuration object that does not match the API schema.
 - configuration.optimization.minimize should be a boolean.
   -> Enable minimizing the output. Uses optimization.minimizer.
 */

/**
 * !devServer 在生产环境不需要 => 查看oms,的确是的
 */

/**
 * ! webpack --watch 与 HtmlWebpackPlugin不可同时使用???
 */

/**
 * !optimization.splitChunks.cacheGroups.vendors 指定 filename会报错??? => 配置minSize后就不报错了...
 */