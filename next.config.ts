import type { NextConfig } from "next";

const isDevelopment = process.env.NODE_ENV === "development";

const nextConfig: NextConfig = {
  ...(isDevelopment
    ? {
        async redirects() {
          return [
            {
              source: "/admin",
              destination: "/admin/index.html",
              permanent: false,
            },
          ];
        },
      }
    : { output: "export" as const }),
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
