var webpack = require('webpack');

var CleanWebpackPlugin = require('clean-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var WebpackMd5Hash = require('webpack-md5-hash');

module.exports = {
    metadata: {ENV: 'dev'},
    debug: true,
    devServer: {
        historyApiFallback: true,
        publicPath: '/'
    },
    entry: {
        'polyfills': './src/polyfills',
        'vendor': './src/vendor',
        'main': './src/main.browser.ts'
    },
    output: {
        path: 'dist',
        publicPath: '/',
        filename: '[name].bundle.js',
        sourceMapFilename: '[name].map',
        chunkFilename: '[id].chunk.js'
    },
    resolve: {
        extensions: ['', '.webpack.js', '.web.js', '.ts', '.tsx', '.js', '.html']
    },
    devtool: 'cheap-module-eval-source-map',
    cache: true,
    module: {
        // preLoaders: [
        //     {test: /\.js$/, loader: 'source-map-loader', exclude: [
        // these packages have problems with their sourcemaps
        // 'node_modules/rxjs',
        // 'node_modules/@angular2-material'
        // ]}
        // ],
        loaders: [
            {
                test: /\.ts$/,
                loader: 'awesome-typescript-loader',
                exclude: [/\.(spec|e2e)\.ts$/]
            },
            {
                test: /\.scss$/,
                // convert file to sass, then css, then stringify it so we can include it directly in angular2 components
                loader: 'exports?module.exports.toString()!css?-minimize&root=../../!resolve-url!sass?sourceMap'
            },
            {
                test: /\.html$/,
                loader: 'exports?module.exports.toString()!html?-minimize&root=../../'
            },
            {
                test: /\.(png|jpg|jpeg)$/,
                loader: 'url?limit=10000'
            },
            {
                test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
                loader: 'url?limit=10000'
            },
            {
                test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
                loader: 'url?limit=10000'
            },
            {
                test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
                loader: 'url?limit=10000'
            },
            {
                test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
                loader: 'url?limit=10000'
            }
        ]
    },
    plugins: [
        // clean our build dir/
        new CleanWebpackPlugin(['dist'], {
            verbose: true,
            dry: false
        }),
        // replace standard chunk hashes with md5 hashes
        new WebpackMd5Hash(),
        // varies distribution ids to get smallest id length
        new webpack.optimize.OccurenceOrderPlugin(true),
        // separate our vendor chunk into its own files.
        new webpack.optimize.CommonsChunkPlugin({name: ['main', 'vendor', 'polyfills']}),
        // creates an html file with our cache busted filenames
        new HtmlWebpackPlugin({
            template: 'src/index.html',
            chunksSortMode: 'dependency',
            favicon: 'asset/image/favicon.ico'
        }),
        // defines metadata for our builds
        new webpack.DefinePlugin({
            ENV: JSON.stringify('dev'),
            GUARDIAN_API: JSON.stringify(
                process.env.GUARDIAN_API ? process.env.GUARDIAN_API : 'http://api.guardian.gg'
            ),
        })
    ]
};