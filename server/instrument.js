const Sentry = require("@sentry/node");

Sentry.init({
  dsn: "https://c3d09b39cf7043b84cf754cf22ff377b@o4510636967460864.ingest.us.sentry.io/4510755782721536",
  // Setting this option to true will send default PII data to Sentry.
  // For example, automatic IP address collection on events
  sendDefaultPii: true,
});
