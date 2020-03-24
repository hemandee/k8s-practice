const CompressionPlugin = require('compression-webpack-plugin');

module.exports = {
    publicPath: process.env.NODE_ENV === 'production'
    ? '/k8s-practice'
        : '/',
    "transpileDependencies": [
        "vuetify"
    ]
};