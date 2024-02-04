/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  /*async rewrites() {
    return [
      {
        source: "/ws/",
        destination: `http://localhost:5057/`,
      },
    ]
  },*/
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
}

export default nextConfig
