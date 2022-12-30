const path = require("path");

module.exports = {
  entry: {
    main: path.resolve("./dashboard/src/ts/index.ts"),
    ticketLoader: path.resolve("./dashboard/src/ts/ticketLoader.ts"),
    staffPlaytime: path.resolve("./dashboard/src/ts/staffPlaytime.ts"),
    permissions: path.resolve("./dashboard/src/ts/permissions.ts"),
    form : path.resolve("./dashboard/src/ts/form.ts"),
    debug: path.resolve("./dashboard/src/ts/debug.ts"),
    config: path.resolve("./dashboard/src/ts/config.ts"),
  },
  devtool: "inline-source-map",
  output: {
    path: path.resolve("./dashboard/dist/"),
    filename: "[name].js",
    sourceMapFilename: "[name].js.map",
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: [
          {
            loader: "ts-loader",
          },
        ],
      },
    ],
  },
  mode: "development",
};
