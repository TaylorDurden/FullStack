/**
 * Created by taylor on 10/12/2016.
 */
var webpack = require('webpack');

module.exports = {
	entry: './entry.js',
	output: {
		path: __dirname,
		filename: 'bundle.js'
	},
	module: {
		loaders: [
			{test: /\.css$/, loader: 'style!css'}
		]
	},
	plugins: [
		new webpack.BannerPlugin('This file is created by taylor')
	]
	//resolve: { fallback: path.join(__dirname, "node_modules") },
	//resolveLoader: { fallback: path.join(__dirname, "node_modules") }
};