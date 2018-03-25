const webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const extractCSS = new ExtractTextPlugin('aem-bundle.css');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = function(env) {
    return {
        entry: {
            components: './src/index.js'
        },
        output: {
            filename: '[name].bundle.js',
            path: path.resolve(__dirname + '/../', 'dist'),
            library: 'components',
            libraryTarget: 'var'
        },
        devServer: {
            contentBase: path.relative(__dirname, '../dist')
        },
        devtool: 'source-map', // || cheap-source-map
        module: {
            rules: [
                {
                    test: /\.html$/,
                    use: 'html-loader'
                },
                {
                    test: /\.css$/,
                    use: extractCSS.extract({
                        fallback: "style-loader",
                        use: 'css-loader?url=false'
                    })
                },
                {
                    test: /\.scss$/,
                    loader: ExtractTextPlugin.extract({
                        fallback: 'style-loader',
                        use: 'css-loader!resolve-url-loader!sass-loader'
                    })
                },
                {
                    test: /\.json$/,
                    use: 'json-loader'
                },
                {
                    test: /\.js$/,
                    exclude: /node_modules\/(?!(ns-test-app-elements|ns-test-util-elements|ns-test-util|ns-test-account|ns-auth|ns-test-shop|@polymer|@webcomponents)\/).*/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            presets: [
                                ['es2015']
                            ]
                        }
                    }
                },
                {
                  test: /\.(png|svg|jpg|gif)$/,
                  use: [
                      {
                        loader: 'url-loader',
                        options: {
                            limit: 5000,
                            name: '/img/[name].[ext]'
                        }
                      }
                  ]
                }
            ]
        },
        resolve: {
            alias: {
                '../marked': 'marked',
                '../prism': 'prismjs'
            }
        },
        plugins: [
            extractCSS,
            new webpack.optimize.CommonsChunkPlugin({
                name: "vendor",
                minChunks: function (module) {
                    return module.context && module.context.indexOf("node_modules") !== -1 && /\.css/.test(module.resource) !== true;
                }
            }),
            new CopyWebpackPlugin([
                {
                    from: '../../node_modules/@webcomponents/webcomponentsjs/webcomponents-hi.js',
                    to: path.resolve(__dirname + '/../', 'dist')
                },
                {
                    from: '../../node_modules/@webcomponents/webcomponentsjs/webcomponents-hi-sd-ce.js',
                    to: path.resolve(__dirname + '/../', 'dist')
                },
                {
                    from: '../../node_modules/@webcomponents/webcomponentsjs/webcomponents-hi-ce.js',
                    to: path.resolve(__dirname + '/../', 'dist')
                },
                {
                    from: '../../node_modules/@webcomponents/webcomponentsjs/webcomponents-hi-sd.js',
                    to: path.resolve(__dirname + '/../', 'dist')
                },
                {
                    from: '../../node_modules/@webcomponents/webcomponentsjs/webcomponents-sd-ce.js',
                    to: path.resolve(__dirname + '/../', 'dist')
                },
                {
                    from: '../../node_modules/@webcomponents/webcomponentsjs/webcomponents-lite.js',
                    to: path.resolve(__dirname + '/../', 'dist')
                },
                {
                    from: '../../node_modules/@webcomponents/webcomponentsjs/webcomponents-loader.js',
                    to: path.resolve(__dirname + '/../', 'dist')
                },
                {
                    from: '../../node_modules/@webcomponents/webcomponentsjs/custom-elements-es5-adapter.js',
                    to: path.resolve(__dirname + '/../', 'dist')
                },
                {
                    from: path.resolve(__dirname, '../../catalog.json'),
                    to: path.resolve(__dirname, '../dist')
                }
            ])
        ]
    }
};
