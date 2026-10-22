import type { NextConfig } from "next";
import { withPayload } from "@payloadcms/next/withPayload";
import { fileURLToPath } from "node:url";

const nextConfig: NextConfig = {
  turbopack: { root: fileURLToPath(new URL(".", import.meta.url)) },
};

export default withPayload(nextConfig);
