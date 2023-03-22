const nextConfig = {
  reactStrictMode: true,
};

module.exports = {
  ...nextConfig,
  webpack: (config) => {
    // For mp3 files
    config.module.rules.push({
      test: /\.mp3$/,
      use: [
        {
          loader: 'url-loader',
          options: {
            limit: 8192, // You can set any number of bytes as the limit
            fallback: 'file-loader',
            publicPath: '/_next',
            outputPath: `public/sounds/`,
            name: '[name].[hash].[ext]',
          },
        },
      ],
    });

    return config;
  },
};
