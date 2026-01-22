#  Analytics System

## Overview

A lightweight, privacy-focused analytics system with **zero external dependencies**. All data is stored locally in the browser's localStorage, giving you complete control and privacy.

---

##  Features

### Tracking Capabilities
 **Page Views** - Every page visited  
 **Click Tracking** - All user clicks with element details  
 **Downloads** - CSV and document downloads  
 **Navigation** - Internal link clicks  
 **Time Tracking** - Time spent on each page  
 **Scroll Depth** - How far users scroll (25%, 50%, 75%, 100%)  
 **Device Detection** - Desktop, mobile, tablet  
 **Session Management** - Groups events into sessions  

### Dashboard Features
 **Real-time Stats** - Sessions, page views, events  
 **Top Pages Chart** - Most visited pages  
 **Device Breakdown** - Desktop vs mobile vs tablet  
 **Recent Events** - Live event stream  
 **Event Filtering** - Filter by type  
 **Data Export** - Download all data as JSON  
 **Password Protected** - Simple authentication  

---

##  Quick Start

### 1. Analytics is Already Integrated!

The tracking script is already included in your Docsify site:
```html
<script src="analytics.js"></script>
```

### 2. Access the Dashboard

**Open the dashboard:**
```
http://localhost:3000/analytics-dashboard.html
```

**Or when deployed:**
```
https://YOUR_USERNAME.github.io/project-jupiter/analytics-dashboard.html
```

### 3. Login

**Default Password:** `jupiter2026`

️ **Important:** Change this password before deploying!

---

##  Security

### Change Dashboard Password

Edit `analytics-dashboard.html` (line 290):

```javascript
const PASSWORD = 'jupiter2026'; // Change this!
```

Change to a strong password:
```javascript
const PASSWORD = 'your_secure_password_here';
```

### Privacy Features

- **No external services** - All data stays in the browser
- **No cookies** - Uses localStorage only
- **No server-side tracking** - 100% client-side
- **No IP tracking** - No identifying information collected
- **User controlled** - Users can clear data anytime

---

##  What Gets Tracked

### Page Views
```javascript
{
  type: 'pageview',
  timestamp: 1705927200000,
  url: 'https://example.com/#/docs/report',
  path: '/',
  hash: '#/docs/report',
  title: 'Consolidated Report',
  referrer: 'https://google.com',
  viewport: { width: 1920, height: 1080 },
  screen: { width: 1920, height: 1080 },
  device: 'desktop',
  userAgent: '...'
}
```

### Clicks
```javascript
{
  type: 'click',
  timestamp: 1705927200000,
  element: 'a',
  id: 'nav-link',
  className: 'sidebar-link',
  text: 'Evidence Matrix',
  href: '#/evidence-matrix',
  position: { x: 150, y: 300 }
}
```

### Downloads
```javascript
{
  type: 'download',
  timestamp: 1705927200000,
  filename: 'evidence_matrix.csv',
  href: '/evidence_matrix.csv'
}
```

### Time Tracking
```javascript
{
  type: 'time_tick',
  timestamp: 1705927200000,
  timeOnPage: 60000,  // milliseconds
  activeTime: 300000
}
```

---

##  Dashboard Metrics

### Summary Stats

**Total Sessions**
- Number of unique visitor sessions
- Session = 30 minutes of inactivity threshold

**Total Page Views**
- Every page load/navigation
- Includes hash route changes (SPA)

**Total Events**
- All tracked events combined
- Clicks, downloads, scrolls, etc.

**Average Time on Site**
- Calculated from session durations
- Shows in minutes

### Charts

**Top Pages**
- Bar chart of most visited pages
- Shows page title and view count
- Top 10 pages displayed

**Device Types**
- Breakdown by desktop/mobile/tablet
- Helps understand your audience

**Recent Events**
- Live feed of last 50 events
- Filterable by event type
- Shows timestamp and details

---

##  Advanced Configuration

### Tracking Configuration

Edit `analytics.js` (lines 10-18):

```javascript
config: {
  sessionTimeout: 30 * 60 * 1000,  // 30 minutes
  storageKey: 'pj_analytics',       // localStorage key
  maxEvents: 10000,                 // Max events to keep
  trackClicks: true,                // Track click events
  trackTime: true,                  // Track time on page
  trackScrollDepth: true,           // Track scroll depth
  trackDownloads: true              // Track file downloads
}
```

### Disable Specific Tracking

```javascript
// Disable click tracking
trackClicks: false,

// Disable time tracking
trackTime: false,

// Disable scroll tracking
trackScrollDepth: false,
```

### Change Data Limits

```javascript
// Keep more events
maxEvents: 50000,  // Keep 50k events

// Shorter sessions
sessionTimeout: 15 * 60 * 1000,  // 15 minutes
```

---

##  Exporting Data

### From Dashboard

1. Click **" Export"** button
2. Downloads `analytics-[timestamp].json`
3. Contains all sessions and events

### Manual Export

Open browser console:
```javascript
// Get all data
const data = localStorage.getItem('pj_analytics');
console.log(JSON.parse(data));

// Copy to clipboard
copy(localStorage.getItem('pj_analytics'));
```

### Data Format

```json
{
  "sessions": [
    {
      "id": "abc123",
      "startTime": 1705927200000,
      "lastActivity": 1705927500000,
      "pageViews": 5,
      "eventCount": 23
    }
  ],
  "events": [
    {
      "type": "pageview",
      "timestamp": 1705927200000,
      "url": "...",
      ...
    }
  ],
  "lastSaved": 1705927500000
}
```

---

##  Analyzing Patterns

### Find Popular Content

Dashboard shows:
- Most visited pages
- Most clicked links
- Most downloaded files

### Understand User Behavior

Track:
- Entry pages (first pageview in session)
- Exit pages (last pageview before timeout)
- Navigation paths (sequence of pages)
- Time on each page

### Device Analysis

See breakdown:
- Desktop vs mobile usage
- Screen resolutions
- Viewport sizes

### Engagement Metrics

Monitor:
- Session duration
- Pages per session
- Scroll depth (how far users read)
- Return visits

---

##  Data Management

### Clear All Data

**From Dashboard:**
- Logout and data stays
- No built-in clear button (by design)

**Manually:**
```javascript
// Open browser console
localStorage.removeItem('pj_analytics');
```

**Programmatically:**
```javascript
// In analytics.js
window.PJAnalytics.clearData();
```

### Data Size

**Current limits:**
- Max 10,000 events stored
- Older events auto-deleted
- Typical size: 2-5MB
- localStorage limit: 5-10MB per domain

### Performance Impact

- **Minimal** - Runs in background
- **No blocking** - Async tracking
- **Efficient** - Saves every 30 seconds
- **Lightweight** - ~8KB script

---

##  API Reference

### Exposed Functions

```javascript
// Access analytics object
window.PJAnalytics

// Get all data
PJAnalytics.getAllData()

// Track custom event
PJAnalytics.trackEvent('custom_event', { 
  key: 'value' 
})

// Clear data
PJAnalytics.clearData()

// Force save
PJAnalytics.saveData()
```

### Custom Event Tracking

```javascript
// Track button click
PJAnalytics.trackEvent('cta_click', {
  button: 'Download Report',
  location: 'header'
});

// Track form submission
PJAnalytics.trackEvent('form_submit', {
  formId: 'contact-form',
  fields: 3
});

// Track video play
PJAnalytics.trackEvent('video_play', {
  videoId: 'intro-video',
  duration: 120
});
```

---

##  Troubleshooting

### Dashboard not loading
- Check `analytics-dashboard.html` exists
- Verify password is correct
- Check browser console for errors

### No data showing
- Visit main site first to generate data
- Check localStorage: `localStorage.getItem('pj_analytics')`
- Verify analytics.js is loaded

### Events not tracking
- Check browser console for errors
- Verify analytics.js is included in index.html
- Try in incognito mode (check localStorage)

### Dashboard shows 0 for everything
- No data has been collected yet
- Visit main site and click around
- Refresh dashboard

---

##  Deployment

### GitHub Pages

Analytics works automatically! Just deploy normally:

```bash
git add analytics.js analytics-dashboard.html
git commit -m "Add analytics system"
git push
```

**Dashboard URL:**
```
https://YOUR_USERNAME.github.io/project-jupiter/analytics-dashboard.html
```

### Security Considerations

1. **Change the password** before deploying
2. Don't share dashboard URL publicly
3. Consider adding `.htpasswd` for extra security
4. Use HTTPS (GitHub Pages does this automatically)

### Keeping Dashboard Private

**Option 1:** Don't link to it
- Dashboard only accessible if you know the URL

**Option 2:** Use different branch
- Keep dashboard in separate branch
- Don't deploy that branch

**Option 3:** Server-side auth
- Use Netlify/Vercel with password protection
- Requires moving beyond GitHub Pages

---

##  Example Insights

### Traffic Patterns

**Questions you can answer:**

- What pages get the most traffic?
- When do people visit (check timestamps)?
- How long do they stay?
- What do they click most?

### Content Performance

- Which documents are read completely? (scroll depth 100%)
- Which documents are skipped? (low time on page)
- What's the reading order? (navigation sequence)

### User Behavior

- Desktop vs mobile users
- Entry/exit pages
- Download patterns
- Search terms (if tracking search)

---

##  Future Enhancements

Potential additions (not included):

- **Real-time dashboard** - Live updating
- **Heatmaps** - Visual click maps
- **Session replay** - Video-like playback
- **A/B testing** - Compare variations
- **Goals tracking** - Conversion funnels
- **Email reports** - Scheduled summaries
- **Multi-user** - Different access levels

---

##  Pro Tips

1. **Check weekly** - Regular dashboard reviews
2. **Export data** - Backup before clearing
3. **Track custom events** - For specific actions
4. **Monitor patterns** - Look for trends
5. **Test changes** - See impact in analytics
6. **Privacy first** - Respect user data

---

##  Resources

- **localStorage docs:** https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage
- **Privacy by design:** https://www.smashingmagazine.com/2019/04/privacy-concerns-ux-web-forms/
- **Web analytics guide:** https://web.dev/vitals/

---

##  Checklist

Before going live:

- [ ] Changed dashboard password
- [ ] Tested tracking on localhost
- [ ] Verified dashboard loads
- [ ] Checked data exports
- [ ] Documented password securely
- [ ] Decided who has access
- [ ] Ready to deploy!

---

##  You're All Set!

Your analytics system is:
-  Fully functional
-  Privacy-focused
-  Zero dependencies
-  Easy to maintain
-  Ready to deploy!

**Start tracking:** Visit your site  
**View insights:** Open dashboard  
**Discover patterns:** Analyze data  

---

**Questions?** Check the dashboard or open browser console for debug info.

**Good luck understanding your audience! **
