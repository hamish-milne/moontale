const path = require('path');
const webpack = require('webpack');
const fs = require('fs')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const HTMLInlineCSSWebpackPlugin = require("html-inline-css-webpack-plugin").default
const HtmlWebpackInlineSVGPlugin = require('html-webpack-inline-svg-plugin')

function isProduction(options) { return options.mode === 'production' }

function stringReplace(haystack, needle, replacement) {
    let idx = haystack.indexOf(needle)
    return haystack.substring(0, idx) + replacement + haystack.substring(idx + needle.length)
}

module.exports = (env, options) => { return {
    mode: 'development',
    devtool: "source-map",
    entry: {
        bundle: './src/index.ts',
        editor: './src/setup.js'
    },
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
        filename: '[name].js',
        publicPath: '',
        path: path.resolve(__dirname, 'dist'),
    },
    node: false,
    plugins: [
        new webpack.DefinePlugin({
            // Excludes nodejs-specific stuff from Fengari
            "process.env.FENGARICONF": "void 0",
            "typeof process": JSON.stringify("undefined"),

            // Force CodeMirror modes to use the 'plain browser env', rather than
            //   importing a new CodeMirror instance.
            // NOTE: This is terrible! It basically hacks around CodeMirror's own hack.
            // NOTE: This will probably break other things!!!
            "typeof exports": JSON.stringify("undefined"),
            "typeof define": JSON.stringify("undefined")
        }),
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
                    let scriptTag = `<script defer="defer" src="bundle.js"></script>`
                    let formats = [
                        ['', package.version, stringReplace(html, scriptTag, `<script defer="defer">${stringReplace(js, 'bundle.js.map', 'https://moontale.hmilne.cc/bundle.js.map')}</script>`)],
                        ['-dev', '0.0.0', stringReplace(html, scriptTag, `<script defer="defer" src="http://localhost:9000/bundle.js"></script>`)],
                        ['-latest', '1.0.0', stringReplace(html, scriptTag, `<script defer="defer" src="https://moontale.hmilne.cc/bundle.js"></script>`)]
                    ]
                    formats.map(tuple => {
                        // TODO: Use a Webpack entry point for format.js?
                        let outputJson = {
                            name: "Moontale",
                            version: tuple[1],
                            author: package.author,
                            description: package.description,
                            proofing: false,
                            url: package.repository.url,
                            license: package.license,
                            image: 'icon.svg',
                            source: tuple[2],
                            setup: '%SETUP%'
                        }
                        let jsonString = stringReplace(
                            JSON.stringify(outputJson),
                            "\"%SETUP%\"",
                            `function(){${fs.readFileSync(`${__dirname}/dist/editor.js`, "utf-8")}\n}`
                        )
                        let outputString = `window.storyFormat(${jsonString});`
                        fs.writeFileSync(`build/format${tuple[0]}.js`, outputString)
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