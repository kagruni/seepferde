import type { NextConfig } from "next";

const isDevelopment = process.env.NODE_ENV === "development";

const nextConfig: NextConfig = {
  // Emit clean routes as /route/index.html. This matches Apache's native
  // DirectoryIndex behavior and avoids a route.html file competing with the
  // React Server Component directory emitted for the same route.
  // Development serves the CMS through its literal /admin/index.html asset;
  // forcing a trailing slash there creates a redirect loop. Production keeps
  // the directory-style routes required by Apache's DirectoryIndex handling.
  trailingSlash: !isDevelopment,
  skipTrailingSlashRedirect: isDevelopment,
  ...(isDevelopment
    ? {
        async rewrites() {
          return [
            {
              source: "/admin",
              destination: "/admin/index.html",
            },
            {
              source: "/admin/",
              destination: "/admin/index.html",
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
