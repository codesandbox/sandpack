/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  webpack: (config) => {
    config.module.rules.push({
      test: /\.woff/,
      use: {
        loader: "url-loader",
      },
    });

    return config;
  },
};
