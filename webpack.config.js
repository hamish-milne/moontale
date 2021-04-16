const path = require('path');
const webpack = require('webpack');
const fs = require('fs')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const HtmlInlineScriptPlugin = require('html-inline-script-webpack-plugin')
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const HTMLInlineCSSWebpackPlugin = require("html-inline-css-webpack-plugin").default

module.exports = {
    mode: 'development',
    devtool: "source-map",
    entry: './src/index.ts',
    module: {
        rules: [{
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /mdurl/,
                use: 'null-loader',
            },
            {
                test: /\.lua$/,
                type: 'asset/source',
            },
            {
                test: /\.css$/i,
                use: [MiniCssExtractPlugin.loader, 'css-loader'],
            }
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },
    node: false,
    plugins: [
        // Excludes nodejs-specific stuff from Fengari
        new webpack.DefinePlugin({
            "process.env.FENGARICONF": "void 0",
            "typeof process": JSON.stringify("undefined")
        }),
        new MiniCssExtractPlugin(),
        new HtmlWebpackPlugin({
            template: "src/index.html",
            inject: "body"
        }),
        new HtmlInlineScriptPlugin(),
        new HTMLInlineCSSWebpackPlugin(),
        {
            apply: function(compiler) {
                compiler.hooks.done.tap('BuildStoryFormat', function() {

                    let package = JSON.parse(fs.readFileSync("package.json", "utf-8"))
                    let html = fs.readFileSync("dist/index.html", "utf-8")
                    let outputJson = {
                        name: package.name,
                        version: package.version,
                        author: package.author,
                        description: package.description,
                        proofing: false,
                        url: package.repository.url,
                        license: package.license,
                        image: 'icon.svg',
                        source: html
                    }
                    let outputString = `window.storyFormat(${JSON.stringify(outputJson)});`
                    fs.writeFileSync("dist/format.js", outputString)
                })
            },
        },
    ],
    optimization: {
        minimizer: [
            `...`,
            new CssMinimizerPlugin(),
        ],
    },
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        compress: true,
        port: 9000,
        inline: true,
        hot: true
    },
};