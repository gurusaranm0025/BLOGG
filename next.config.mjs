/** @type {import('next').NextConfig} */
import million from "million/compiler";

const nextConfig = {
  reactStrictMode: false,
  trailingSlash: true,
  
};

export default million.next(nextConfig);
