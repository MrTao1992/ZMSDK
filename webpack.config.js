const path = require('path');
//const webpack = require('webpack'); //访问内置的插件
//const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
    mode: 'development',
    entry: './SDK/ZMSDK.ts',
    output: {
        filename: 'SDK.js',
        // filename: 'main.[chunkhash].js', //出口文件
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
};