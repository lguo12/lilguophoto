import type { NextConfig } from "next";

// GitHub Pages serves this repo at https://lguo12.github.io/lilguophoto/,
// so all internal asset/route paths need the repo name as a base path.
const repoBasePath = "/lilguophoto";

const nextConfig: NextConfig = {
  output: "export",
  basePath: repoBasePath,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
