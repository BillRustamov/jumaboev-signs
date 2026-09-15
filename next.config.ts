import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Cursor Preview (and other tunnels) load the shop from a different host
  // than 127.0.0.1. Without this, /_next scripts 403 and the page spins.
  allowedDevOrigins: [
    "127.0.0.1",
    "localhost",
    "*.localhost",
    "**.localhost",
    "*.cursor.com",
    "**.cursor.com",
    "*.cursor.sh",
    "**.cursor.sh",
    "*.cursorusercontent.com",
    "**.cursorusercontent.com",
  ],
};

export default nextConfig;
