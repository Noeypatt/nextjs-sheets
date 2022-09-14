/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        child_process: false,
        fs: false,
        http2: false,
        net: false,
        tls: false,
      }
    }

    return config
  },
}

module.exports = nextConfig
