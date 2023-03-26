/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    API_KEY: process.env.NEXTAUTH_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
  },
  reactStrictMode: true,
};
module.exports = nextConfig;
