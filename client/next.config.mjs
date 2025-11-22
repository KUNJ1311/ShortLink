/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  async rewrites() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

    return [
      {
        source: "/:path((?!code|healthz|_next|api|\\.swa|site|favicon|apple-touch-icon).*)",
        destination: `${apiUrl}/:path`,
      },
    ];
  },
};

export default nextConfig;
