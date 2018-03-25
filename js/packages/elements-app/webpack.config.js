var webpack = require('webpack');
var path = require('path');

module.exports = function(env) {
    return {
        entry: {
            main: './src/application.js'
        },
        output: {
            filename: 'application-bundle.js',
            path: path.resolve(__dirname + '/../', 'dist')
        },
        devServer: {
            contentBase: path.relative(__dirname, './dist')
        },
        module: {
            rules: [{
                test: /\.html$/,
                use: [ {
                    loader: 'html-loader'
                }],
            }]
        }
    }
};
