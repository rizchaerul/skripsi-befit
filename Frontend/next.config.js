const withPwa = require("next-pwa");
const runtimeCaching = require("next-pwa/cache");

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
    swcMinify: true,
};

module.exports = withPwa({
    ...nextConfig,
    pwa: {
        disable: process.env.NODE_ENV === "development",
        dest: "public",
        runtimeCaching,
        // Reference: https://github.com/shadowwalker/next-pwa/issues/288#issuecomment-955777098
        // buildExcludes: [
        //     /middleware-manifest\.json$/,
        //     /_middleware\.js$/,
        //     /_middleware\.js\.map$/,
        //     /middleware-runtime\.js$/,
        // ],
    },
});
