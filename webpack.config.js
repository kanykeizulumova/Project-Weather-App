

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: './src/index.js',
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'dist'),
        clean: true,
    },
    devServer: {
        static: './dist', // Откуда раздавать статику
        open: true,       // Автоматически открывать браузер при запуске
        hot: true,        // "Горячая" замена модулей (обновление без перезагрузки)
    },


    mode: 'development',

    plugins: [
        new HtmlWebpackPlugin({
            title: 'Project: Weather App',
            template: './src/template.html',
        }),
    ],

    // --- ДОБАВЛЯЕМ ЭТУ ЧАСТЬ ---
    module: {
        rules: [
            {
                test: /\.css$/i, // Регулярное выражение: найти все файлы заканчивающиеся на .css
                use: ['style-loader', 'css-loader'], // Использовать эти лоадеры (читается справа налево!)
            },
        ],
    },
    // ---------------------------
};