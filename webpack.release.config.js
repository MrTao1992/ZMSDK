const path = require('path');
//const webpack = require('webpack'); //访问内置的插件
//const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
    mode: 'development',
    entry: './SDK/ZMSDK.ts',
    output: {
        filename: 'SDK-min.js',
        path: path.resolve(__dirname, './bin')
    },

    module: {
        rules: [{
            test: /\.ts$/,
            use: [
            {
                loader: 'babel-loader'
            },
            {
                loader: 'ts-loader'
            }
            ]
        }]
    },
    resolve: {
        extensions: [
            '.ts'
        ]
    },

    //关闭 webpack 的性能提示
    performance: {
        hints:false
    },
};