/* eslint-disable */
var webpack = require('webpack')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var ExtractTextPlugin = require('extract-text-webpack-plugin')

var isProduction = function () {
    return process.env.NODE_ENV === 'production';
};

module.exports = {
    entry: {
        app: './src/app.js'
    },
    output: {
        path: `${__dirname}/dist`,
        filename: '/[hash]-[name].js'
    },
    cache: true,
    module: {
        loaders: [
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract('style', 'css'),
                exclude:"/node_modules/"
            },
            {
                test: /\.less$/i, 
                loader: ExtractTextPlugin.extract(['css','less']),
                exclude:"/node_modules/"
            },
            {
                test: /\.json$/,
                loader: 'json'
            }, {
                test: /\.jsx?$/,
                include: /src/,
                loader: 'babel',
                query: {
                    presets: ['es2015', 'stage-0', 'react'],
                    plugins: ['transform-runtime'],
                    cacheDirectory: true
                }
            }, {
                test: /\.(png|jpg)$/,
                loader: 'url-loader?limit=10000&name=/[path][name].[ext]'
            }, {
                test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: 'url-loader?limit=10000&minetype=application/font-woff&name=/[path][name].[ext]'
            }, {
                test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: 'file-loader?name=/[path][name].[ext]'
            }
        ]
    },
    plugins: [
        new webpack.NoErrorsPlugin(),
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.UglifyJsPlugin({
            include: /\.min\.js$/,
            minimize: isProduction() ? true : false
        }),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: 'src/index.html',
            chunks: [ 'app' ]
        }),
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify(process.env.NODE_ENV)
            }
        }),
        // new ExtractTextPlugin('icon.css')
        new ExtractTextPlugin('/[hash]-[name].css')
    ],
    devServer: {
        host: '0.0.0.0',
        port: 8888,
        historyApiFallback: true
    },
    // devtool: isProduction() ? null : 'source-map'
    devtool: null
}
