module.exports = {
  pageExtensions: ['tsx'],
  webpack: (config) => {
    config.resolve.modules.push(__dirname);
    return config;
  },
  experimental: {
    serverDirectory: './client'
  }
};
