var webpack = require('webpack');
var zlib = require('zlib');

var CleanWebpackPlugin = require('clean-webpack-plugin');
var CompressionPlugin = require('compression-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var WebpackMd5Hash = require('webpack-md5-hash');

module.exports = {
    metadata: {ENV: 'prod'},
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
    devtool: 'source-map',
    module: {
        preLoaders: [
            {
                test: /\.js$/,
                loader: 'source-map-loader',
                exclude: [/angular2-infinite-scroll/],
            }
        ],
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
                loader: 'url?limit=5000'
            },
            {
                test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
                loader: 'url?limit=5000'
            },
            {
                test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
                loader: 'url?limit=5000'
            },
            {
                test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
                loader: 'url?limit=5000'
            },
            {
                test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
                loader: 'url?limit=5000'
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
        new webpack.optimize.OccurenceOrderPlugin(),
        // removes deduped code
        new webpack.optimize.DedupePlugin(),
        // separate our vendor chunk into its own files.
        new webpack.optimize.CommonsChunkPlugin({name: ['main', 'vendor', 'polyfills'], minChunks: Infinity}),
        // creates an html file with our cache busted filenames
        new HtmlWebpackPlugin({
            template: 'src/index.html',
            chunksSortMode: 'dependency',
            favicon: 'asset/image/favicon.ico',
            hash: true
        }),
        // defines metadata for our builds
        new webpack.DefinePlugin({
            ENV: JSON.stringify('prod'),
            GUARDIAN_API: JSON.stringify('http://api.guardian.gg'),
            BUNGIE_API: JSON.stringify('http://proxy.guardian.gg')
        }),
        new webpack.optimize.UglifyJsPlugin({
            beautify: false,
            mangle: {
                screw_ie8: true,
                keep_fnames: true
            },
            compress: {
                warnings: false,
                screw_ie8: true
            },
            comments: false,
            drop_console: true
        })/*,
        new CompressionPlugin({
            algorithm: function(buffer, callback) {
                return zlib['gzip'](buffer, {level: 9}, callback);
            },
            regExp: /\.css$|\.html$|\.js$|\.map$/,
            threshold: 2 * 1024
        })*/
    ]
};
