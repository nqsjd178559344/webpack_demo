const webpack = require('webpack')
const merge = require('webpack-merge')
const baseConfig = require('./webpack.base')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCss = require("optimize-css-assets-webpack-plugin")
const OptimizeJs = require("terser-webpack-plugin")

const prodConfig = {
    mode: 'production',
    devtool: 'none',
    optimization: {
        minimizer: [new OptimizeCss(), new OptimizeJs()]
    },
    module: {
        rules: [
            {
                test: /\.less$/,
                use: [
                    // MiniCssExtractPlugin.loader, // 同下
                    {
                        loader: MiniCssExtractPlugin.loader
                    },
                    {
                        loader: 'css-loader'
                    },
                    {
                        loader: 'postcss-loader',
                        options: { //! autoprefixer 需要配置浏览器版本

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
        new MiniCssExtractPlugin({
            filename: "[name].[hash:5].css"
        }),
    ]
}
module.exports = merge(baseConfig, prodConfig)