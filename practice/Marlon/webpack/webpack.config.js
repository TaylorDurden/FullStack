/**
 * Created by Administrator on 2016/12/11.
 */
var path = require('path');
var HtmlwebpackPlugin = require('html-webpack-plugin');
var ROOT_PATH = path.resolve(__dirname);
var APP_PATH = path.resolve(ROOT_PATH, 'app');
var BUILD_PATH = path.resolve(ROOT_PATH, 'build');

module.exports = {
    // 项目的文件夹 可以直接用文件夹名称 默认会找index.js 也可以确定哪个文件的名字
    entry: APP_PATH,
    // 输出的文件名 合并以后的js 会命名为bundle.js
    output: {
        path: BUILD_PATH,
        filename: 'bundle.js'
    },
    // 添加我们的插件 会自动生成一个html文件
    plugins: [
        new HtmlwebpackPlugin({
            title: 'Hello World app'
        })
    ],
    devServer: {
        historyApiFallback: true,
        hot: true,
        inline: true,
        progress: true
    },
    // 配置loader
    module: {
        loaders: [
            {
                // 规则 css scss
                test: /\.scss$/,
                // loaders的处理顺序是从右到左的，这里就是先运行css-loader然后是style-loader.
                loaders: ['style', 'css', 'sass'],
                include: APP_PATH
            }
        ]
    }
};