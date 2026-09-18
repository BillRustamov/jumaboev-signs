import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["stripe"],
  // Cursor Preview (and other tunnels) load the shop from a different host
  // than 127.0.0.1. Without this, /_next scripts 403 and the page spins.
  // "null" covers sandboxed iframe Origin: null.
  allowedDevOrigins: [
    "127.0.0.1",
    "localhost",
    "null",
    "*.localhost",
    "**.localhost",
    "*.cursor.com",
    "**.cursor.com",
    "*.cursor.sh",
    "**.cursor.sh",
    "*.cursorusercontent.com",
    "**.cursorusercontent.com",
    "*.cfworkspace.com",
    "**.cfworkspace.com",
  ],
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: "frame-ancestors *",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
