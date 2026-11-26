/** @type {import('next').NextConfig} */
const nextConfig = {
    /* config options here */
    images: {
        remotePatterns: [
            new URL('https://3iswh1q5zc.ufs.sh/**'),
            { protocol: 'https', hostname: '**.supabase.co' },
            { protocol: 'https', hostname: '3iswh1q5zc.ufs.sh' },
        ],
    },
};

export default nextConfig;
