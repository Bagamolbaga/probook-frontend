// // This file configures the initialization of Sentry on the client.
// // The added config here will be used whenever a users loads a page in their browser.
// // https://docs.sentry.io/platforms/javascript/guides/nextjs/

// import * as Sentry from "@sentry/nextjs";

// Sentry.init({
//   enabled: process.env.NEXT_PUBLIC_SENTRY_ENABLE === "true",
//   dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
//   environment: process.env.NEXT_PUBLIC_APP_ENV,

//   // Add optional integrations for additional features
//   integrations: [
//     Sentry.replayIntegration(),
//   ],
//   ignoreErrors: ["NonCriticalError", "BackgroundTaskError"],

//   // Define how likely traces are sampled. Adjust this value in production, or use tracesSampler for greater control.
//   tracesSampleRate: 1,
//   // Enable logs to be sent to Sentry
//   enableLogs: true,

//   // Define how likely Replay events are sampled.
//   // This sets the sample rate to be 10%. You may want this to be 100% while
//   // in development and sample at a lower rate in production
//   replaysSessionSampleRate: 0.1,

//   // Define how likely Replay events are sampled when an error occurs.
//   replaysOnErrorSampleRate: 1.0,

//   // Setting this option to true will print useful information to the console while you're setting up Sentry.
//   debug: false,

//   beforeSend: function(event, hint) {
//     // filter out UnhandledRejection errors that have no information
//     if (event !== undefined && event.exception !== undefined && event.exception.values !== undefined
//         && event.exception.values.length === 1) {
//         const e = event.exception.values[0]
//         if (e.type === "UnhandledRejection" && e.value === "Non-Error promise rejection captured with value: ") {
//             return null
//         }

//         if (e.value?.includes("Non-Error promise rejection captured with value:")) {
//           return null
//         }
//     }

//     // Customize this to detect background errors.
//     //@ts-ignore
//     const isBackgroundError = hint.originalException && hint.originalException?.message === "BackgroundError"

//     if (isBackgroundError) {
//       return null  // Skip this error
//     }

//     // If adblock or extension blocked loading Stripe.js
//     const isScriptBlocked = event.exception?.values?.some(exception => {
//       return (
//         exception.value?.includes("Stripe.js") ||
//         exception.value?.includes("blocked by extension") ||
//         exception.value?.includes("adblock") ||
//         exception.value?.includes("loadStripe failed")
//       )
//     })

//     if (isScriptBlocked) {
//       event.tags = {...event.tags, blocked_by_extension: true}
//     }

//     return event
//   }
// });

// export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;