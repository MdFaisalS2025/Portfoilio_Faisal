import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Next's default is WebP only; AVIF is typically 20-50% smaller at the
    // same visual quality and is listed first so it's preferred whenever a
    // visitor's browser sends it in `Accept` — WebP remains the fallback for
    // the browsers that don't.
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
