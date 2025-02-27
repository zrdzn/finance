/** @type {import('next').NextConfig} */

const nextConfig = {
    reactStrictMode: true,
    staticPageGenerationTimeout: 180,
    i18n: {
        locales: ['en', 'pl'],
        defaultLocale: 'en',
        localeDetection: false,
    }
}

module.exports = nextConfig