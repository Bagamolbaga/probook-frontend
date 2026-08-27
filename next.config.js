/** @type {import('next').NextConfig} */

const withNextIntl = require("next-intl/plugin")("./src/i18n/index.ts");
// const { withSentryConfig } = require("@sentry/nextjs");

const config = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "3.23.103.32",
      },
      {
        protocol: "http",
        hostname: "api.bowers.app",
      },
      {
        protocol: "https",
        hostname: "api.bowers.app",
      },
      {
        protocol: "https",
        hostname: "bowers-prod-bucket.s3.ap-southeast-1.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "flagsapi.com",
      },
      {
        protocol: "https",
        hostname: "*",
      },
    ],
  },
};

// Injected content via Sentry wizard below
// const configWithSentry = withSentryConfig(config, {
//   // For all available options, see:
//   // https://www.npmjs.com/package/@sentry/webpack-plugin#options

//   org: "bowers-ww",
//   project: "frontend-main",
//   authToken: process.env.NEXT_PUBLIC_SENTRY_AUTH_TOKEN,

//   // Only print logs for uploading source maps in CI
//   silent: !process.env.CI,
//   deploy: {
//     env: process.env.NEXT_PUBLIC_APP_ENV,
//   }
// });

// module.exports = withNextIntl(configWithSentry)
module.exports = withNextIntl(config)
