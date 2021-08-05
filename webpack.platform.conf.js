const path = require('path');
const webpack = require('webpack');
// const HtmlWebpackPlugin = require("html-webpack-plugin");
const GenerateAssetPlugin = require('generate-asset-webpack-plugin');
// const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const FileManagerWebpackPlugin = require('filemanager-webpack-plugin');
//////////////////////////////////////////////////////////////////////////
//资源输出目录
let zipSourceDic = "./build";
let zipOutDic = "./dist/sdk_production.zip";
let packagePlatDic = "../../dist/";

let createJson = function (compilation) {
    let date = new Date();
    return JSON.stringify({
        "sdkVersion": compilation.hash,
        "creatTimes": date.toLocaleDateString() + " " + date.toLocaleTimeString(),
    });
};

module.exports = {
    mode: 'development',
    entry: './SDK/ZMSDK.ts',
    output: {
        filename:  'SDK-min.js', //出口文件
        path: path.resolve(__dirname, './build/libs')
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

    plugins: [
        new GenerateAssetPlugin({
            filename: packagePlatDic + "version.json",
            fn: (compilation, cb) => {
                cb(null, createJson(compilation));
            },
            extraFiles: []
        }),
        new FileManagerWebpackPlugin({
            onEnd: {
                archive: [
                    {
                        //打包成zip
                        source: zipSourceDic, destination: zipOutDic, complete: () => {
                            console.log("打包完成");
                            // onUpOss();
                        }
                    },
                ],
                copy: [
                    {source: './cd.json', destination: './dist'},
                    {source: zipSourceDic, destination: './dist/web-mobile'},
                ],
            },
        }),
    ],

    // optimization: {
    //     minimizer: [
    //         new UglifyJSPlugin({
    //             uglifyOptions: {
    //                 comments: false,
    //                 minimize: true,
    //                 nodeEnv: 'production',
    //                 mangleWasmImports: true,
    //                 compress: {
    //                     drop_console: true
    //                 }
    //             }
    //         }),
    //     ]
    // },
};