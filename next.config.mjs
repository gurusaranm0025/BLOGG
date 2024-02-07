/** @type {import('next').NextConfig} */
import million from "million/compiler";

const nextConfig = {
  reactStrictMode: false,
  trailingSlash: true,
  output: 'export'
  
};

export default million.next(nextConfig);
