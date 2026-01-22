/**
 * Lightweight Analytics Tracker
 * Zero external dependencies - uses localStorage for client-side storage
 * Tracks: page views, clicks, time spent, downloads, patterns
 */

(function() {
  'use strict';
  
  const Analytics = {
    // Configuration
    config: {
      sessionTimeout: 30 * 60 * 1000, // 30 minutes
      storageKey: 'pj_analytics',
      maxEvents: 10000, // Keep last 10k events
      trackClicks: true,
      trackTime: true,
      trackScrollDepth: true,
      trackDownloads: true
    },
    
    // Session data
    session: {
      id: null,
      startTime: null,
      pageViews: 0,
      events: []
    },
    
    // Initialize analytics
    init() {
      this.getOrCreateSession();
      this.trackPageView();
      this.setupEventListeners();
      this.startTimeTracking();
      
      // Save data periodically
      setInterval(() => this.saveData(), 30000); // Every 30 seconds
      
      // Save on page unload
      window.addEventListener('beforeunload', () => this.saveData());
      
      console.log('Analytics initialized:', this.session.id);
    },
    
    // Get or create session
    getOrCreateSession() {
      const now = Date.now();
      const saved = this.loadData();
      
      // Check if we have a valid session
      if (saved && saved.session && (now - saved.session.startTime < this.config.sessionTimeout)) {
        this.session = saved.session;
        console.log('Resumed session:', this.session.id);
      } else {
        // Create new session
        this.session.id = this.generateId();
        this.session.startTime = now;
        console.log('New session:', this.session.id);
      }
      
      this.session.lastActivity = now;
    },
    
    // Generate unique ID
    generateId() {
      return Date.now().toString(36) + Math.random().toString(36).substr(2);
    },
    
    // Track page view
    trackPageView() {
      const event = {
        type: 'pageview',
        timestamp: Date.now(),
        url: window.location.href,
        path: window.location.pathname,
        hash: window.location.hash,
        title: document.title,
        referrer: document.referrer,
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight
        },
        screen: {
          width: window.screen.width,
          height: window.screen.height
        },
        device: this.getDeviceType(),
        userAgent: navigator.userAgent
      };
      
      this.session.pageViews++;
      this.addEvent(event);
      console.log('Page view tracked:', event.path);
    },
    
    // Setup event listeners
    setupEventListeners() {
      // Track clicks
      if (this.config.trackClicks) {
        document.addEventListener('click', (e) => this.trackClick(e), true);
      }
      
      // Track hash changes (SPA navigation)
      window.addEventListener('hashchange', () => this.trackPageView());
      
      // Track scroll depth
      if (this.config.trackScrollDepth) {
        let maxScroll = 0;
        window.addEventListener('scroll', () => {
          const scrollPercent = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
          if (scrollPercent > maxScroll) {
            maxScroll = Math.round(scrollPercent);
            if (maxScroll % 25 === 0) { // Track at 25%, 50%, 75%, 100%
              this.trackEvent('scroll', { depth: maxScroll });
            }
          }
        });
      }
      
      // Track visibility changes
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
          this.trackEvent('page_hide', { duration: Date.now() - this.session.lastActivity });
          this.saveData();
        } else {
          this.session.lastActivity = Date.now();
          this.trackEvent('page_show');
        }
      });
    },
    
    // Track click events
    trackClick(e) {
      const target = e.target;
      const event = {
        type: 'click',
        timestamp: Date.now(),
        element: target.tagName.toLowerCase(),
        id: target.id || null,
        className: target.className || null,
        text: target.innerText?.substring(0, 100) || null,
        href: target.href || target.closest('a')?.href || null,
        position: {
          x: e.clientX,
          y: e.clientY
        }
      };
      
      // Check if it's a download link
      if (event.href && this.isDownloadLink(event.href)) {
        event.type = 'download';
        event.filename = event.href.split('/').pop();
      }
      
      // Check if it's a navigation link
      if (event.href && event.href.includes('#')) {
        event.type = 'navigation';
        event.destination = event.href.split('#')[1];
      }
      
      this.addEvent(event);
    },
    
    // Check if link is a download
    isDownloadLink(url) {
      const downloadExtensions = ['.pdf', '.csv', '.zip', '.doc', '.docx', '.xls', '.xlsx'];
      return downloadExtensions.some(ext => url.toLowerCase().endsWith(ext));
    },
    
    // Track custom event
    trackEvent(type, data = {}) {
      const event = {
        type,
        timestamp: Date.now(),
        ...data
      };
      
      this.addEvent(event);
    },
    
    // Add event to session
    addEvent(event) {
      this.session.events.push(event);
      this.session.lastActivity = Date.now();
      
      // Limit events in memory
      if (this.session.events.length > 100) {
        this.saveData();
        this.session.events = [];
      }
    },
    
    // Start time tracking
    startTimeTracking() {
      setInterval(() => {
        if (!document.hidden) {
          this.trackEvent('time_tick', {
            timeOnPage: Date.now() - this.session.lastActivity,
            activeTime: Date.now() - this.session.startTime
          });
        }
      }, 60000); // Every minute
    },
    
    // Get device type
    getDeviceType() {
      const ua = navigator.userAgent;
      if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
        return 'tablet';
      }
      if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
        return 'mobile';
      }
      return 'desktop';
    },
    
    // Save data to localStorage
    saveData() {
      try {
        const data = this.loadData() || { sessions: [], events: [] };
        
        // Add current session events to global events
        data.events = data.events.concat(this.session.events);
        
        // Keep only recent events
        if (data.events.length > this.config.maxEvents) {
          data.events = data.events.slice(-this.config.maxEvents);
        }
        
        // Update session info
        const sessionIndex = data.sessions.findIndex(s => s.id === this.session.id);
        const sessionInfo = {
          id: this.session.id,
          startTime: this.session.startTime,
          lastActivity: this.session.lastActivity,
          pageViews: this.session.pageViews,
          eventCount: this.session.events.length
        };
        
        if (sessionIndex >= 0) {
          data.sessions[sessionIndex] = sessionInfo;
        } else {
          data.sessions.push(sessionInfo);
        }
        
        // Keep only recent sessions (last 100)
        if (data.sessions.length > 100) {
          data.sessions = data.sessions.slice(-100);
        }
        
        data.session = this.session;
        data.lastSaved = Date.now();
        
        localStorage.setItem(this.config.storageKey, JSON.stringify(data));
        
        // Clear session events after saving
        this.session.events = [];
        
      } catch (error) {
        console.error('Failed to save analytics data:', error);
      }
    },
    
    // Load data from localStorage
    loadData() {
      try {
        const data = localStorage.getItem(this.config.storageKey);
        return data ? JSON.parse(data) : null;
      } catch (error) {
        console.error('Failed to load analytics data:', error);
        return null;
      }
    },
    
    // Get all data (for dashboard)
    getAllData() {
      return this.loadData();
    },
    
    // Clear all data
    clearData() {
      localStorage.removeItem(this.config.storageKey);
      this.session.events = [];
      console.log('Analytics data cleared');
    }
  };
  
  // Auto-initialize on page load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => Analytics.init());
  } else {
    Analytics.init();
  }
  
  // Expose to window for dashboard access
  window.PJAnalytics = Analytics;
  
})();
