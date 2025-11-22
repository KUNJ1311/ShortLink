/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  async rewrites() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

    // Only add rewrite if apiUrl is properly set
    if (!apiUrl || apiUrl === "") {
      return [];
    }

    return [
      {
        source: "/:path((?!code|healthz|_next).*)",
        destination: `${apiUrl}/:path`,
      },
    ];
  },
};

export default nextConfig;
