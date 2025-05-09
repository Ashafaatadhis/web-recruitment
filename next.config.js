/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        os: false,
        path: false,
        stream: false,
        "aws-sdk": false,
        "mock-aws-s3": false,
        nock: false,
      };
    }
    return config;
  },
};

module.exports = nextConfig;
