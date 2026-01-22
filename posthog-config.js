/**
 * PostHog Analytics Configuration
 *
 * This file contains the PostHog setup for Project Jupiter Evidence Portal.
 * PostHog is used for product analytics, feature flags, and session recordings.
 */

// PostHog Configuration
window.POSTHOG_CONFIG = {
  apiKey: 'phc_FHAcCX8OXdgcCrWcThblrmlRdb9uDyMWmlGdy869F1P',
  apiHost: 'https://us.i.posthog.com',

  // Feature flags
  loaded: function(posthog) {
    console.log('PostHog loaded successfully');
  },

  // Advanced options
  autocapture: true, // Automatically capture clicks, form submissions, etc.
  capture_pageview: true, // Automatically capture pageviews
  capture_pageleave: true, // Capture when users leave pages

  // Session recording (optional - can be disabled for privacy)
  disable_session_recording: false,

  // Privacy settings
  respect_dnt: true, // Respect Do Not Track browser setting
  opt_out_capturing_by_default: false,

  // Performance
  persistence: 'localStorage+cookie',

  // Cross-domain tracking (if needed)
  cross_subdomain_cookie: false,

  // Debug mode (set to false in production)
  debug: false
};

// Initialize PostHog
(function() {
  // Load PostHog library from CDN
  !function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.async=!0,p.src=s.api_host+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+".people (stub)"},o="capture identify alias people.set people.set_once set_config register register_once unregister opt_out_capturing has_opted_out_capturing opt_in_capturing reset isFeatureEnabled onFeatureFlags getFeatureFlag getFeatureFlagPayload reloadFeatureFlags group updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures getActiveMatchingSurveys getSurveys onSessionId".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);

  // Initialize with configuration
  posthog.init(
    window.POSTHOG_CONFIG.apiKey,
    {
      api_host: window.POSTHOG_CONFIG.apiHost,
      loaded: window.POSTHOG_CONFIG.loaded,
      autocapture: window.POSTHOG_CONFIG.autocapture,
      capture_pageview: window.POSTHOG_CONFIG.capture_pageview,
      capture_pageleave: window.POSTHOG_CONFIG.capture_pageleave,
      disable_session_recording: window.POSTHOG_CONFIG.disable_session_recording,
      respect_dnt: window.POSTHOG_CONFIG.respect_dnt,
      opt_out_capturing_by_default: window.POSTHOG_CONFIG.opt_out_capturing_by_default,
      persistence: window.POSTHOG_CONFIG.persistence,
      cross_subdomain_cookie: window.POSTHOG_CONFIG.cross_subdomain_cookie,
      debug: window.POSTHOG_CONFIG.debug
    }
  );

  // Custom event tracking for documentation portal
  document.addEventListener('DOMContentLoaded', function() {
    // Track document views (Docsify specific)
    if (window.$docsify) {
      // Track initial page view
      posthog.capture('documentation_view', {
        page: window.location.hash || '#/',
        title: document.title
      });

      // Track navigation within documentation
      window.addEventListener('hashchange', function() {
        posthog.capture('documentation_navigation', {
          from: document.referrer,
          to: window.location.hash,
          title: document.title
        });
      });
    }
  });
})();
