# PostHog Analytics Setup

## Overview

PostHog has been integrated into the Project Jupiter Evidence Portal to provide comprehensive product analytics, feature flags, and session recordings.

## Configuration

### Files Modified
- `index.html` - Added PostHog script reference
- `posthog-config.js` - PostHog configuration and initialization
- `.gitignore` - Updated to protect sensitive data

### PostHog Settings

**API Key**: `phc_FHAcCX8OXdgcCrWcThblrmlRdb9uDyMWmlGdy869F1P`
**API Host**: `https://us.i.posthog.com` (US region)

### Features Enabled

1. **Autocapture**: Automatically tracks clicks, form submissions, and other user interactions
2. **Pageview Tracking**: Captures all page views automatically
3. **Page Leave Tracking**: Tracks when users leave pages
4. **Session Recording**: Records user sessions for playback (can be disabled for privacy)
5. **Privacy Respecting**: Respects browser Do Not Track settings
6. **Custom Events**:
   - `documentation_view` - Tracks when users view documentation pages
   - `documentation_navigation` - Tracks navigation between documentation pages

## Dual Analytics Setup

This project now runs two analytics systems in parallel:

### 1. Custom Analytics (`analytics.js`)
- Lightweight, zero-dependency tracking system
- Local data persistence with remote sync
- Tracks detailed user interactions (clicks, scrolls, forms, etc.)
- Data stored at: `https://el-paso-santa-teresa-project-jupiter.fly.dev`

### 2. PostHog Analytics (`posthog-config.js`)
- Full-featured product analytics platform
- Session recordings and heatmaps
- Feature flags and A/B testing capabilities
- Funnel and retention analysis

Both systems complement each other and provide comprehensive insights into user behavior.

## How to Use PostHog

### Viewing Analytics

1. Log into PostHog dashboard at https://app.posthog.com
2. Use the provided API key to access the project
3. View insights, recordings, and user behavior

### Custom Event Tracking

To track custom events in your code:

```javascript
// Track a simple event
posthog.capture('button_clicked', {
  button_name: 'download_document',
  document_id: 'doc-123'
});

// Identify users (optional)
posthog.identify('user-id', {
  email: 'user@example.com',
  name: 'User Name'
});

// Set user properties
posthog.people.set({
  preferred_language: 'en'
});
```

### Feature Flags

PostHog supports feature flags for gradual rollouts:

```javascript
if (posthog.isFeatureEnabled('new-feature')) {
  // Show new feature
} else {
  // Show old version
}
```

## Privacy Considerations

- Session recording is enabled by default but respects user privacy settings
- Do Not Track browser settings are respected
- No personal data is captured without explicit consent
- All data is stored in PostHog's US region

To disable session recording completely, update `posthog-config.js`:

```javascript
disable_session_recording: true
```

## Testing the Integration

1. Open the portal in a browser: `http://localhost:8080`
2. Open browser DevTools Console
3. Look for the message: "PostHog loaded successfully"
4. Navigate between pages and check PostHog dashboard for events

## Troubleshooting

### PostHog Not Loading

1. Check browser console for errors
2. Verify the API key is correct in `posthog-config.js`
3. Ensure there are no ad blockers interfering
4. Check network tab to see if requests to `us.i.posthog.com` are blocked

### Events Not Showing Up

1. Events may take a few minutes to appear in the dashboard
2. Verify debug mode: Set `debug: true` in `posthog-config.js`
3. Check browser console for PostHog debug messages

## Documentation

- PostHog Documentation: https://posthog.com/docs
- JavaScript SDK: https://posthog.com/docs/libraries/js
- Feature Flags: https://posthog.com/docs/feature-flags
- Session Recordings: https://posthog.com/docs/session-replay

## Support

For PostHog-related issues:
- PostHog Community: https://posthog.com/questions
- GitHub Issues: https://github.com/PostHog/posthog-js/issues
