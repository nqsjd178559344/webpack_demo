const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
const baseConfig = require('./webpack.base')

const devConfig = {
    mode:'development',
    devtool:'cheap-module-eval-source-map',
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
    plugins: [
        new webpack.HotModuleReplacementPlugin(), // vue中已自动配置module.hot.accept等,可不写
    ]
}

module.exports = merge(baseConfig,devConfig)