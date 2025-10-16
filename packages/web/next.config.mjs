const nextConfig = {
  output: "standalone",
  productionBrowserSourceMaps: false,
  transpilePackages: ["packages/*", "@t3-oss/env-nextjs"],
  eslint: {
    ignoreDuringBuilds: true,
  },
}

export default nextConfig
