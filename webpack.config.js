const path = require('path');
const externals = require('webpack-node-externals');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

/**
 * Stylesheept configuration
 *
 * @param {boolean} sourceMap generates a source map for the stylesheets
 */
function configureStyles(isProduction) {
    return {
        test: /global\.scss$/,
        loader: [MiniCssExtractPlugin.loader, {
            loader: "css-loader",
            options: { sourceMap: !isProduction }
        }, {
            loader: "sass-loader",
            options: { sourceMap: !isProduction }
        }]
    }
}

/**
 * Scripts configuration
 */
function configureScripts() {
    return {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
            loader: 'babel-loader',
            options: {
                presets: ['@babel/preset-env']
            }
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
        resolve: { extensions: [".js"] },
        optimization: { splitChunks: { chunks: "all" } },
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
            filename: "[name].bundle.[contenthash:5].js"
        },
        module: {
            rules: [
                configureStyles(isProduction),
                configureScripts(),
            ]
        },
        node: {
            fs: 'empty',
            net: 'empty'
        },
        devServer: {
            port: 3000,
            historyApiFallback: true
        },
        ...configureBundle(isProduction),
        plugins: [
            new MiniCssExtractPlugin({ filename: "[name].bundle.[contenthash:5].css" })
        ]
    };

    /**
     * Extra Development-specific Config
     */
    if (!isProduction) {
        config.devtool = 'source-map';
    }

    /**
     * Extra Production-specific Config
     */
    if (isProduction) {

    }

    return config;
}
