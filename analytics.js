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
      trackDownloads: true,
      trackInputs: true,
      trackForms: true,
      trackClipboard: true,
      trackErrors: true,
      trackResize: true,
      trackFocus: true,
      trackPointer: true,
      trackKeyboard: true,
      remoteEndpoint: (typeof window !== 'undefined' && window.PJ_ANALYTICS_ENDPOINT) ? window.PJ_ANALYTICS_ENDPOINT : '',
      remoteApiKey: (typeof window !== 'undefined' && window.PJ_ANALYTICS_KEY) ? window.PJ_ANALYTICS_KEY : '',
      remoteEnabled: true,
      remoteBatchSize: 25,
      remoteFlushInterval: 15000,
      remoteMaxQueued: 2000
    },
    
    // Session data
    session: {
      id: null,
      startTime: null,
      pageViews: 0,
      events: []
    },

    clientId: null,
    remoteQueue: [],
    remoteInFlight: false,
    
    // Initialize analytics
    init() {
      this.ensureClientId();
      this.getOrCreateSession();
      this.trackPageView();
      this.setupEventListeners();
      this.startTimeTracking();
      this.startRemoteFlush();
      
      // Save data periodically
      setInterval(() => this.saveData(), 30000); // Every 30 seconds
      
      // Save on page unload
      window.addEventListener('beforeunload', () => this.saveData());
      
      console.log('Analytics initialized:', this.session.id);
    },

    // Ensure stable client id
    ensureClientId() {
      try {
        const key = 'pj_client_id';
        const existing = localStorage.getItem(key);
        if (existing) {
          this.clientId = existing;
          return;
        }
        const id = this.generateId();
        localStorage.setItem(key, id);
        this.clientId = id;
      } catch (error) {
        this.clientId = this.generateId();
      }
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

      if (this.config.trackPointer) {
        document.addEventListener('dblclick', (e) => this.trackPointerEvent('dblclick', e), true);
        document.addEventListener('contextmenu', (e) => this.trackPointerEvent('contextmenu', e), true);
        document.addEventListener('pointerdown', (e) => this.trackPointerEvent('pointerdown', e), true);
        document.addEventListener('pointerup', (e) => this.trackPointerEvent('pointerup', e), true);
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

      // Track focus/blur
      if (this.config.trackFocus) {
        window.addEventListener('focus', () => this.trackEvent('window_focus'));
        window.addEventListener('blur', () => this.trackEvent('window_blur'));
        document.addEventListener('focusin', (e) => this.trackFocusEvent('focusin', e), true);
        document.addEventListener('focusout', (e) => this.trackFocusEvent('focusout', e), true);
      }

      // Track input changes
      if (this.config.trackInputs) {
        document.addEventListener('input', (e) => this.trackInputEvent('input', e), true);
        document.addEventListener('change', (e) => this.trackInputEvent('change', e), true);
      }

      // Track form submissions
      if (this.config.trackForms) {
        document.addEventListener('submit', (e) => this.trackFormEvent(e), true);
      }

      // Track clipboard events
      if (this.config.trackClipboard) {
        document.addEventListener('copy', (e) => this.trackClipboardEvent('copy', e), true);
        document.addEventListener('cut', (e) => this.trackClipboardEvent('cut', e), true);
        document.addEventListener('paste', (e) => this.trackClipboardEvent('paste', e), true);
      }

      // Track keyboard events (avoid capturing actual typed content)
      if (this.config.trackKeyboard) {
        document.addEventListener('keydown', (e) => this.trackKeyboardEvent(e), true);
      }

      // Track window resize/orientation
      if (this.config.trackResize) {
        window.addEventListener('resize', () => {
          this.trackEvent('resize', {
            viewport: { width: window.innerWidth, height: window.innerHeight }
          });
        });
        window.addEventListener('orientationchange', () => {
          this.trackEvent('orientation_change', {
            orientation: screen.orientation?.type || 'unknown'
          });
        });
      }

      // Track JS errors and promise rejections
      if (this.config.trackErrors) {
        window.addEventListener('error', (e) => {
          this.trackEvent('error', {
            message: e.message,
            filename: e.filename,
            lineno: e.lineno,
            colno: e.colno
          });
        });
        window.addEventListener('unhandledrejection', (e) => {
          this.trackEvent('unhandled_rejection', {
            message: e.reason?.message || String(e.reason || 'unknown')
          });
        });
      }
    },
    
    // Track click events
    trackClick(e) {
      const target = e.target;
      const event = {
        type: 'click',
        timestamp: Date.now(),
        ...this.getElementContext(target),
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

    // Track pointer events
    trackPointerEvent(type, e) {
      const target = e.target;
      const event = {
        type,
        timestamp: Date.now(),
        ...this.getElementContext(target),
        position: {
          x: e.clientX,
          y: e.clientY
        }
      };

      this.addEvent(event);
    },

    // Track focus events
    trackFocusEvent(type, e) {
      const target = e.target;
      const event = {
        type,
        timestamp: Date.now(),
        ...this.getElementContext(target)
      };

      this.addEvent(event);
    },

    // Track input/change events without storing sensitive values
    trackInputEvent(type, e) {
      const target = e.target;
      if (!target || !(target instanceof HTMLElement)) return;

      const inputType = target.getAttribute?.('type') || target.type || null;
      const isTextLike = ['text', 'email', 'password', 'search', 'url', 'tel', 'number'].includes(String(inputType).toLowerCase());
      const valueLength = typeof target.value === 'string' ? target.value.length : null;

      const event = {
        type,
        timestamp: Date.now(),
        ...this.getElementContext(target),
        inputType,
        valueLength: isTextLike ? valueLength : null,
        checked: typeof target.checked === 'boolean' ? target.checked : null
      };

      this.addEvent(event);
    },

    // Track form submits
    trackFormEvent(e) {
      const target = e.target;
      if (!target || !(target instanceof HTMLFormElement)) return;

      const fields = Array.from(target.elements || []).map((el) => {
        const fieldType = el.getAttribute?.('type') || el.type || null;
        return {
          name: el.name || null,
          id: el.id || null,
          type: fieldType || el.tagName?.toLowerCase() || null
        };
      });

      const event = {
        type: 'form_submit',
        timestamp: Date.now(),
        ...this.getElementContext(target),
        fieldCount: fields.length,
        fields
      };

      this.addEvent(event);
    },

    // Track clipboard events
    trackClipboardEvent(type, e) {
      const target = e.target;
      const event = {
        type,
        timestamp: Date.now(),
        ...this.getElementContext(target)
      };

      this.addEvent(event);
    },

    // Track keyboard events without content
    trackKeyboardEvent(e) {
      const target = e.target;
      const isInput = target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable);
      const isShortcut = e.ctrlKey || e.metaKey || e.altKey;
      const keyLabel = isShortcut || !isInput ? e.key : null;

      const event = {
        type: 'keydown',
        timestamp: Date.now(),
        ...this.getElementContext(target),
        key: keyLabel,
        code: e.code || null,
        ctrlKey: e.ctrlKey,
        metaKey: e.metaKey,
        altKey: e.altKey,
        shiftKey: e.shiftKey,
        isInput
      };

      this.addEvent(event);
    },
    
    // Check if link is a download
    isDownloadLink(url) {
      const downloadExtensions = ['.pdf', '.csv', '.zip', '.doc', '.docx', '.xls', '.xlsx'];
      return downloadExtensions.some(ext => url.toLowerCase().endsWith(ext));
    },

    // Standardized element metadata
    getElementContext(target) {
      if (!target || !(target instanceof HTMLElement)) {
        return { element: null, id: null, className: null, text: null, href: null };
      }

      const text = target.innerText?.substring(0, 100) || null;
      const href = target.href || target.closest?.('a')?.href || null;

      return {
        element: target.tagName.toLowerCase(),
        id: target.id || null,
        className: target.className || null,
        text,
        href
      };
    },

    // Resolve remote endpoint for collect or analytics
    resolveRemoteUrl(pathSuffix) {
      if (!this.config.remoteEndpoint || !this.config.remoteEnabled) return '';
      const base = String(this.config.remoteEndpoint).trim();
      if (!base) return '';
      if (base.endsWith('/collect') || base.endsWith('/analytics')) {
        return base.replace(/\/(collect|analytics)$/, pathSuffix);
      }
      return base.replace(/\/$/, '') + pathSuffix;
    },

    // Queue event for remote collection
    enqueueRemote(event) {
      if (!this.config.remoteEnabled) return;
      const url = this.resolveRemoteUrl('/collect');
      if (!url) return;

      const enriched = {
        ...event,
        sessionId: this.session.id,
        clientId: this.clientId
      };

      this.remoteQueue.push(enriched);

      if (this.remoteQueue.length > this.config.remoteMaxQueued) {
        this.remoteQueue = this.remoteQueue.slice(-this.config.remoteMaxQueued);
      }

      if (this.remoteQueue.length >= this.config.remoteBatchSize) {
        this.flushRemote();
      }
    },

    // Start periodic remote flush
    startRemoteFlush() {
      if (!this.config.remoteEnabled) return;
      const url = this.resolveRemoteUrl('/collect');
      if (!url) return;
      setInterval(() => this.flushRemote(), this.config.remoteFlushInterval);
      window.addEventListener('beforeunload', () => this.flushRemote(true));
      window.addEventListener('pagehide', () => this.flushRemote(true));
    },

    // Flush events to remote server
    async flushRemote(useBeacon = false) {
      if (this.remoteInFlight) return;
      const url = this.resolveRemoteUrl('/collect');
      if (!url || this.remoteQueue.length === 0) return;

      const batch = this.remoteQueue.splice(0, this.config.remoteBatchSize);
      if (batch.length === 0) return;

      const payload = {
        clientId: this.clientId,
        session: {
          id: this.session.id,
          startTime: this.session.startTime,
          lastActivity: this.session.lastActivity,
          pageViews: this.session.pageViews
        },
        events: batch,
        sentAt: Date.now()
      };

      const body = JSON.stringify(payload);

      try {
        if (useBeacon && navigator.sendBeacon) {
          const blob = new Blob([body], { type: 'application/json' });
          navigator.sendBeacon(url, blob);
          return;
        }

        this.remoteInFlight = true;
        const headers = { 'Content-Type': 'application/json' };
        if (this.config.remoteApiKey) {
          headers['x-analytics-key'] = this.config.remoteApiKey;
        }

        const response = await fetch(url, {
          method: 'POST',
          headers,
          body,
          keepalive: true
        });

        if (!response.ok) {
          throw new Error(`Remote analytics error: ${response.status}`);
        }
      } catch (error) {
        this.remoteQueue = batch.concat(this.remoteQueue);
      } finally {
        this.remoteInFlight = false;
      }
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
      this.enqueueRemote(event);
      
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
        this.flushRemote();
        
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
