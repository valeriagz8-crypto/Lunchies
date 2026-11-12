/** @type {import('next').NextConfig} */
const nextConfig = {
  /**
   * /about, /how-it-works, /plans and /roadmap were placeholder pages that
   * nothing linked to. Their routes now send a visitor to the real page that
   * covers the subject, permanently, so old links and bookmarks keep working.
   */
  async redirects() {
    return [
      { source: "/about", destination: "/", permanent: true },
      { source: "/how-it-works", destination: "/#how-it-works", permanent: true },
      { source: "/plans", destination: "/product", permanent: true },
      { source: "/roadmap", destination: "/demo#version-2", permanent: true },
    ];
  },
};

module.exports = nextConfig;
