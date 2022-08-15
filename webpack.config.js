const path = require( 'path' );
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const IgnoreEmitPlugin = require('ignore-emit-webpack-plugin');

const projectFiles = {
    // SCSS & JScript Compile lists
    scss: [
        {
            filename: 'admin',
        	entry: [ './assets/src/admin/scss/admin.scss' ],
        	path: 'assets/dist/admin/css',
        },
    ],
    js: [
        {
            filename: 'admin',
        	entry: [ './assets/src/admin/js/admin.js' ],
        	path: 'assets/dist/admin/js',
        },
        {
            filename: 'template',
        	entry: [ './assets/src/admin/js/templateScript.js' ],
        	path: 'assets/dist/admin/js',
        }
    ]
};


var config = {
    watch: true,
    mode: 'production'
};

let scssConfig = projectFiles.scss.map(item => (
    Object.assign({}, config, {
        entry: {
            [item.filename]: item.entry
        },
        output: {
            path: path.resolve(__dirname, item.path)
        },
        module: {
            rules: [
              {
                test: /\.scss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    "css-loader",
                    "sass-loader"
                ]
              },
            ]
        },
        plugins: [
            new MiniCssExtractPlugin({
                filename: "[name].css",
                chunkFilename: "[id].css",
            }),
            new IgnoreEmitPlugin(/\.js$/), // in case of css, a new admn.js file is craeted, that's why we are ignoring here
        ],
    })
));

let jsConfig = projectFiles.js.map(item => (
    Object.assign({}, config, {
        entry: {
            [item.filename]: item.entry
        },
        output: {
            path: path.resolve(__dirname, item.path)
        },
        module: {
            rules: [
                {
                    test: /\.m?(js|jsx)$/,
                    exclude: /(node_modules)/,
                    loader: 'babel-loader',
                },
                {
                    test: /\.css$/i,
                    use: ['style-loader', 'css-loader'],
                },
                {
                    test: /\.(png|jpe?g|gif)$/i,
                    loader: 'file-loader',
                    options: {
                        name: '[path][name].[ext]',
                    },
                }
            ],
        },
        performance: { hints: false },
        optimization: {
            minimize: false,
        },
		resolve: {
			fallback: { fs: false },
		},
        externals: {
			react: 'React',
			'react-dom': 'ReactDOM',
            lodash: '_'
		},
		
    })
));

let configModule = [...scssConfig, ...jsConfig]

// Return Array of Configurations
module.exports = configModule;