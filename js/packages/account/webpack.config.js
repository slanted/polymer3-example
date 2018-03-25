var webpack = require('webpack');
var path = require('path');

module.exports = function(env) {
    return {
        entry: {
            main: './src/account.js'
        },
        output: {
            filename: 'account-bundle.js',
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
        },
        resolve: {
            alias: {
                Polymer: path.resolve(__dirname, '../aem/node_modules/@polymer'),
                Moment: path.resolve(__dirname, '../aem/node_modules/moment'),
                firebase: path.resolve(__dirname, '../aem/node_modules/firebase')
            }
        },
        externals: {
            nuskinjquery: 'jQuery',
            moment: 'moment',
            angular: 'angular'
        }
    }
};
