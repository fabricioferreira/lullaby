var path = require('path');
var CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
	entry: './src/index.js',
	target: 'node',
	node: {
		__dirname: true,
		__filename: true
	},
	output: {
		filename: 'lullaby.js',
		path: path.resolve(__dirname, 'dist/')
	},
	resolve: {
		extensions: [".js"]
	},
	plugins: [
		new CopyWebpackPlugin([
			{
				from: path.resolve(__dirname, 'src/config.json'),
				to: path.resolve(__dirname, 'dist/config.json')
			}
		])
	]
};