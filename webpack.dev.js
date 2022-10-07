const { merge } = require("webpack-merge");
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");

const commonConfig = require("./webpack.config");

module.exports = merge(commonConfig(), {
  mode: "development",
  devtool: "inline-source-map",
  devServer: {
    contentBase: "./dist",
    historyApiFallback: true,
    port: 4001,
    compress: true,
    hot: true,
  },
  plugins: [new ReactRefreshWebpackPlugin()],
});
