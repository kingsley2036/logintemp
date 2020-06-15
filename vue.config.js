const HtmlWebpackInlinePlugin = require('html-webpack-inline-plugin');

module.exports = {
  baseUrl: './',
  lintOnSave: false,
  outputDir: 'docs',
  configureWebpack: {
    plugins: [
      new HtmlWebpackInlinePlugin({
        compress: false
      })
    ]
  },
}
