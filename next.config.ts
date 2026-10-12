// FAMZI FILE GUIDE: Next.js configuration, including development origins allowed for LAN testing.
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["10.166.191.211", "192.168.1.8"],
};

export default nextConfig;
