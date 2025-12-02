/** @type {import('next').NextConfig} */

const isExtensionBuild = process.env.EXTENSION_MODE === 'true';

const nextConfig = {
    output: isExtensionBuild ? 'export' : undefined,
    
    distDir: 'build',
    
    images: { 
        unoptimized: true 
    },

    assetPrefix: isExtensionBuild ? './' : undefined,
};

export default nextConfig;