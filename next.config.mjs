const nextConfig = {
  webpack: (config, { _isServer }) => {
    config.resolve.extensions.push('.graphql');

    config.module.rules.push({
      test: /\.(graphql|gql)$/,
      exclude: /node_modules/,
      use: [{ loader: 'graphql-tag/loader' }],
    });

    return config;
  },
};

export default nextConfig;
