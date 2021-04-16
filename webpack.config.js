const path = require('path');
const webpack = require('webpack');

module.exports = {
    mode: 'development',
    devtool: "source-map",
    entry: './src/index.ts',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /mdurl/,
                use: 'null-loader',
            },
            {
                test: /\.lua/,
                type: 'asset/source',
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
    ],
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        compress: true,
        port: 9000,
        inline: true,
        hot: true
    },
};