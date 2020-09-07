const path = require('path');
const externals = require('webpack-node-externals');
const NodemonPlugin = require('nodemon-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const DotenvWebpackPlugin = require('dotenv-webpack');

/**
 * Scripts configuration
 */
function configureScripts() {
    return {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
            loader: 'babel-loader',
        }
    }
}

/**
 * Bundle configuration for sizes and optimizations
 *
 * @param {boolean} isProduction removes checking of vendors size when not on production
 */
function configureBundle(isProduction) {
    const KB = 1024;
    const bundleConfig = {
        resolve: {
            extensions: [ ".js", ".css", ".scss" ],
            // modules: [ "node_modules" ],
        },
        // optimization: { splitChunks: { chunks: "all" } },
        performance: {
            hints: (isProduction) ? "warning" : false,
            maxEntrypointSize: 320 * KB,
            maxAssetSize: 300 * KB,
            assetFilter: (file) => !(/\.map$/.test(file))
        },
        stats: {
            children: false, // Disable children information
            chunks: false,   // Disable chunk information
            colors: true,    // Enable colored output on terminal
            hash: false,     // Disable compilation hash
            modules: false,  // Disable module information
            version: false   // Disable printing of webpack version
        },
    }

    if (!isProduction) {
        bundleConfig.performance.assetFilter = (file) => !(/\.map$|vendors/.test(file));
    }

    return bundleConfig;
}


/**
 * Webpack Configuration
 */
module.exports = (env, arg) => {
    const isProduction = arg.mode == 'production';

    const config = {
        target: 'node',
        externals: [ externals() ],
        entry: './index.js',
        output: {
            path: path.resolve(__dirname, "dist"),
            filename: '[name].js'
        },
        module: {
            rules: [
                {
                    test: /\.twig$/,
                    use: { loader: 'twig-loader' }
                },
                configureScripts(),
            ]
        },
        node: {
            fs: 'empty',
            net: 'empty',
            __dirname: false,
            __filename: false,
        },
        ...configureBundle(isProduction),
        plugins: [
            new DotenvWebpackPlugin({
                systemvars: true,
                safe: true,
            }),
            new CleanWebpackPlugin(),
            new CopyPlugin({
                patterns: [
                    { from: "src/views", to: "views" },
                    { from: "public/images", to: "public/images" },
                ]
            })
        ]
    };

    /**
     * Extra Development-specific Config
     */
    if (!isProduction) {
        config.devtool = 'source-map';
        config.plugins.push(new NodemonPlugin({
            watch: [ "src/", "public/scss/", "index.js" ],
            ext: "js,scss,twig",
            events: {
              start: "node-sass --output-style compressed public/scss/index.scss dist/public/css/index.css"
            }
        }));
    }

    /**
     * Extra Production-specific Config
     */
    if (isProduction) {

    }

    return config;
}
