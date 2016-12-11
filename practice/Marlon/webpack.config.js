/**
 * Created by Administrator on 2016/12/11.
 */
var webpack = require('webpack');

/*
* entry 入口文件 让webpack用哪个文件作为项目的入口
 output 出口 让webpack把处理完成的文件放在哪里
 module 模块 要用什么不同的模块来处理各种类型的文件
* */
module.exports = {
    entry: './entry.js',
    output: {
        path: __dirname,
        filename: 'bundle.js',

        /* 故障处理webpack提供的参数 建议使用绝对路径以匹配windows 环境 */
        /* 使用webpack --display-error-details 命令也可以查询*/
        resolve: { fallback: path.join(__dirname, "app/folder") },
        resolveLoader: { fallback: path.join(__dirname, "app/folder") }
    },
    module: {
        loaders: [
            {test: /\.css$/, loader: 'style!css'}
        ]
    },
    plugins: [
        new webpack.BannerPlugin('This file is created by Marlon!!')
    ]
};