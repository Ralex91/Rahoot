const nextConfig = {
  output: "standalone",
  productionBrowserSourceMaps: false,
  transpilePackages: ["packages/*", "@t3-oss/env-nextjs"],
}

export default nextConfig
