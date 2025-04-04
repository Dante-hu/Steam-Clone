/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'firebasestorage.googleapis.com',
          pathname: '/**',
        },

        {
          protocol: 'https',
          hostname: 'storage.googleapis.com',
          pathname: '/steam-clone-b3cbb.firebasestorage.app/**',
        },
      ],
    },
  };
  
  export default nextConfig;