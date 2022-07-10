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
    if (idx < 0) {
        throw Error("Not found!")
    }
    return haystack.substring(0, idx) + replacement + haystack.substring(idx + needle.length)
}

let package = JSON.parse(fs.readFileSync("package.json", "utf-8"));

const undef = JSON.stringify("undefined");

module.exports = (env, options) => { return {
    mode: 'development',
    devtool: "source-map",
    entry: {
        bundle: './src/index.ts',
        editor: './src/setup.ts',
        editor_test: './src/editor_test.ts'
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
                exclude: /(editor|lint).css$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader'],
            },
            {
                test: /(editor|lint).css$/,
                type: 'asset/source'
            },
            {
                test: /\.(ttf|eot|svg|png|jpg|gif|ico|woff|woff2)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                type: 'asset/resource'
            },
            {
                test: /editor_test\.html/,
                type: 'asset/resource',
                generator: {
                    filename: '[name][ext]'
                }
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
            "typeof process": undef,

            // Force CodeMirror modes to use the 'plain browser env', rather than
            //   importing a new CodeMirror instance.
            // NOTE: This is terrible! It basically hacks around CodeMirror's own hack.
            // NOTE: This might break other things!!!
            "typeof exports": undef,
            "typeof define": undef
        }),
        new MiniCssExtractPlugin(),
        new HtmlWebpackPlugin({
            template: "src/index.html",
            inject: "body",
            chunks: ['bundle']
        }),
        new HTMLInlineCSSWebpackPlugin({
            leaveCSSFile: true
        }),
        new HtmlWebpackInlineSVGPlugin({
            runPreEmit: true
        }),
        {
            apply: function(compiler) {
                compiler.hooks.done.tap('BuildStoryFormat', function() {

                    let webRoot = isProduction(options) ? "https://hamish-milne.github.io/moontale" : "http://localhost:9000"
                    let html = fs.readFileSync(`${__dirname}/dist/index.html`, "utf-8")
                    let bundleJs = fs.readFileSync(`${__dirname}/dist/bundle.js`, "utf-8")
                    let editorJs = fs.readFileSync(`${__dirname}/dist/editor.js`, "utf-8")

                    // Set source mapping URLs to the remote URLs, so they work in the Twine editor
                    bundleJs = stringReplace(bundleJs, 'bundle.js.map', `${webRoot}/bundle.js.map`)
                    editorJs = stringReplace(editorJs, 'editor.js.map', `${webRoot}/editor.js.map`)

                    // TODO: Use PostHTML here instead of this garbage!
                    let scriptTag = isProduction(options) ? `<script defer="defer" src="bundle.js"></script>` : `<script defer src="bundle.js"></script>`
                    let formats = [
                        ['', package.version, stringReplace(html, scriptTag, `<script defer="defer">${bundleJs}</script>`)],
                        ['-dev', '0.0.0', stringReplace(html, scriptTag, `<script defer="defer" src="${webRoot}/bundle.js"></script>`)],
                        ['-latest', '1.0.0', stringReplace(html, scriptTag, `<script defer="defer" src="${webRoot}/bundle.js"></script>`)]
                    ]
                    formats.map(tuple => {
                        let output = 
`window.storyFormat({
    name: "Moontale",
    version: ${JSON.stringify(tuple[1])},
    author: ${JSON.stringify(package.author)},
    description: ${JSON.stringify(package.description)},
    proofing: false,
    url: ${JSON.stringify(package.repository.url)},
    license: ${JSON.stringify(package.license)},
    image: 'icon.svg',
    source: ${JSON.stringify(tuple[2])},
    setup: function(){${editorJs}\n}
});`
                        fs.writeFileSync(`build/format${tuple[0]}.js`, output)
                    })

                    // Copy source maps to the build, so they're visible in the site
                    fs.copyFileSync("dist/bundle.js.map", "build/bundle.js.map")
                    fs.copyFileSync("dist/editor.js.map", "build/editor.js.map")
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
        static: {
            directory: path.join(__dirname, 'dist'),
        },
        compress: true,
        port: 9000,
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