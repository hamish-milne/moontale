const path = require('path');
const webpack = require('webpack');
const fs = require('fs')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const HTMLInlineCSSWebpackPlugin = require("html-inline-css-webpack-plugin").default
const HtmlWebpackInlineSVGPlugin = require('html-webpack-inline-svg-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

function isProduction(options) { return options.mode === 'production' }

module.exports = (env, options) => { return {
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
            },
            {
                test: /\.(ttf|eot|svg|png|jpg|gif|ico|woff|woff2)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                type: 'asset/resource'
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
        new CopyWebpackPlugin({'patterns': [
            {
                from:'./node_modules/@fortawesome/fontawesome-free/svgs/solid',
                to:'icons'
            }
        ]}),
        new MiniCssExtractPlugin(),
        new HtmlWebpackPlugin({
            template: "src/index.html",
            inject: "body"
        }),
        new HTMLInlineCSSWebpackPlugin(),
        new HtmlWebpackInlineSVGPlugin({
            runPreEmit: true
        }),
        {
            apply: function(compiler) {
                compiler.hooks.done.tap('BuildStoryFormat', function() {

                    let package = JSON.parse(fs.readFileSync("package.json", "utf-8"))
                    let html = fs.readFileSync(`${__dirname}/dist/index.html`, "utf-8")
                    let js = fs.readFileSync(`${__dirname}/dist/bundle.js`, "utf-8")
                    let scriptTag = `<script defer="defer" src="bundle.js"></script>`;
                    [
                        ['offline', package.version, html.replace(scriptTag, `<script defer="defer">${js}</script>`)],
                        ['dev', '0.0.0', html.replace(scriptTag, `<script defer="defer" src="http://localhost:9000/bundle.js"></script>`)],
                        ['latest', '1.0.0', html.replace(scriptTag, `<script defer="defer" src="https://moontale.hmilne.cc/bundle.js"></script>`)]
                    ].map(tuple => {
                        let outputJson = {
                            name: "Moontale",
                            version: tuple[1],
                            author: package.author,
                            description: package.description,
                            proofing: false,
                            url: package.repository.url,
                            license: package.license,
                            image: 'icon.svg',
                            source: tuple[2]
                        }
                        let outputString = `window.storyFormat(${JSON.stringify(outputJson)});`
                        fs.writeFileSync(`build/format-${tuple[0]}.js`, outputString)
                    })
                    fs.copyFileSync("dist/bundle.js.map", "build/bundle.js.map")
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
        hot: true,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
            "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization"
        }
    },
    ignoreWarnings: [{
        message: /size limit/
    }, {
        message: /You can limit the size of your bundles/
    }],
    devtool: 'source-map'
} };