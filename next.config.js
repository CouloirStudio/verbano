module.exports = {
  pageExtensions: ['tsx'],
  webpack: (config) => {
    config.resolve.modules.push(__dirname); // Add this line
    return config;
  },
  experimental: {
    serverDirectory: './client'
  }
};
