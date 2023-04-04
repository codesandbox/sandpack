/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: "/docs",
        destination: "https://sandpack.vercel.app/docs",
      },
      {
        source: "/theme",
        destination: "https://sandpack-theme.vercel.app/theme",
      },
      {
        source: "/docs/:path*",
        destination: "https://sandpack.vercel.app/docs/:path*",
      },
      {
        source: "/theme/:path*",
        destination: "https://sandpack-theme.vercel.app/theme/:path*",
      },
    ];
  },
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
