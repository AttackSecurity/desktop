/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    output: "export",
    distDir: "dist",
    compress: false,
    images: {
        unoptimized: true
    }
};

export default nextConfig;