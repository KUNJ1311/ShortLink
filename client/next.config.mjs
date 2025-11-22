/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  async rewrites() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

    return [
      {
        source:
          "/:path((?!_next/|static/|favicon.ico|apple-touch-icon|manifest|site|api/|healthz|code).*)",
        destination: `${apiUrl}/:path`,
      },
    ];
  },
};

export default nextConfig;
