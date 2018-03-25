var webpack = require('webpack');
var path = require('path');
var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = function(env) {
    return {
        entry: {
            shop: './src/shop.js'
        },
        output: {
            filename: '[name].bundle.js',
            path: path.resolve(__dirname + '/../', 'dist')
        },
        devServer: {
            contentBase: path.relative(__dirname, './dist')
        },
        module: {
            rules: [
                {
                    test: /\.html$/,
                    use: [ {
                        loader: 'html-loader'
                    }]
                },
                {
                    test: /\.json$/,
                    use: 'json-loader'
                },
                {
                    test: /\.js$/,
                    exclude: /node_modules\/(?!(ns-util|ns-account|ns-auth|ns-shop|ns-cart|ns-checkout-common|ns-checkout|ns-checkout-mobile|ns-agelocme-core|ns-agelocme-web|@polymer|@webcomponents\/webcomponentsjs\/web*|@webcomponents\/shadycss)\/).*/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            presets: [
                                ['es2015', { modules: false} ]
                            ]
                        }
                    }
                },
            ]
        },
        resolve: {
            alias: {
                Polymer: path.resolve(__dirname, '../aem/node_modules/@polymer'),
                Moment: path.resolve(__dirname, '../aem/node_modules/moment'),
                firebase: path.resolve(__dirname, '../aem/node_modules/firebase')
            }
        },
        plugins: [
            new webpack.optimize.CommonsChunkPlugin({
                name: "vendor",
                minChunks: function (module) {
                return module.context && module.context.indexOf("node_modules") !== -1;
              }
            })
        ],
        // externals: {
        //     nuskinjquery: 'jQuery',
        //     moment: 'moment',
        //     angular: 'angular'
        // }
    }
}

