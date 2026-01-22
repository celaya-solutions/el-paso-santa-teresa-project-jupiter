/**
 * Client-Side Router
 * Hash-based routing for single-page application
 */

const Router = {
  routes: {},
  currentRoute: null,
  
  /**
   * Initialize router
   */
  init() {
    // Define routes
    this.routes = {
      '': this.renderHome,
      'docs/:docId': this.renderDocument,
      'evidence-matrix': this.renderEvidenceMatrix,
      'timeline': this.renderTimeline,
      'search': this.renderSearch
    };
    
    // Listen for hash changes
    window.addEventListener('hashchange', () => this.handleRoute());
    
    // Handle initial route
    this.handleRoute();
    
    // Update active nav links
    this.updateActiveNav();
  },
  
  /**
   * Handle route change
   */
  handleRoute() {
    const hash = window.location.hash.slice(2) || ''; // Remove #/
    const [path, queryString] = hash.split('?');
    
    const params = Utils.parseQueryString(queryString);
    
    // Find matching route
    let matchedRoute = null;
    let routeParams = {};
    
    for (const [pattern, handler] of Object.entries(this.routes)) {
      const match = this.matchRoute(pattern, path);
      if (match) {
        matchedRoute = handler;
        routeParams = match;
        break;
      }
    }
    
    // Execute route handler
    if (matchedRoute) {
      this.currentRoute = {
        path,
        params: { ...routeParams, ...params }
      };
      matchedRoute.call(this, this.currentRoute.params);
    } else {
      this.render404();
    }
    
    // Update active navigation
    this.updateActiveNav();
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  },
  
  /**
   * Match route pattern against path
   */
  matchRoute(pattern, path) {
    const patternParts = pattern.split('/');
    const pathParts = path.split('/');
    
    if (patternParts.length !== pathParts.length) {
      return null;
    }
    
    const params = {};
    
    for (let i = 0; i < patternParts.length; i++) {
      if (patternParts[i].startsWith(':')) {
        const paramName = patternParts[i].slice(1);
        params[paramName] = pathParts[i];
      } else if (patternParts[i] !== pathParts[i]) {
        return null;
      }
    }
    
    return params;
  },
  
  /**
   * Navigate to a route
   */
  navigate(path) {
    window.location.hash = '#/' + path;
  },
  
  /**
   * Update active navigation links
   */
  updateActiveNav() {
    document.querySelectorAll('.sidebar-nav a').forEach(link => {
      const href = link.getAttribute('href');
      if (href && href.startsWith('#/')) {
        const linkPath = href.slice(2);
        const currentHash = window.location.hash.slice(2);
        
        if (linkPath === currentHash || currentHash.startsWith(linkPath + '?')) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      }
    });
  },
  
  /**
   * Render home page
   */
  async renderHome() {
    const content = document.getElementById('app-content');
    
    try {
      // Show loading
      content.innerHTML = '<div class="loading-container"><div class="spinner"></div></div>';
      
      // Load document index
      const index = await Utils.fetchJSON('data/documents.json');
      
      // Generate home page HTML
      const html = `
        <div class="home-hero">
          <h1>${I18n.t('site.title')}</h1>
          <p>Evidence-Grade Accountability System for Community Advocacy</p>
          <a href="#/docs/CONSOLIDATED_PUBLIC_REPORT" class="btn btn-lg btn-accent">
            📄 ${I18n.t('docs.consolidatedReport')} 
          </a>
        </div>
        
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-value">${index.totalDocuments}</div>
            <div class="stat-label">Documents</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">70</div>
            <div class="stat-label">Evidence Items</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">82</div>
            <div class="stat-label">Timeline Events</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">15</div>
            <div class="stat-label">Contradictions</div>
          </div>
        </div>
        
        <h2>Featured Documents</h2>
        <div class="featured-docs">
          ${index.featured.map(doc => `
            <a href="#/docs/${doc.id}" class="doc-card">
              <div class="doc-card-icon">${this.getDocIcon(doc.icon)}</div>
              <h3 class="doc-card-title">${doc.title}</h3>
              <p class="doc-card-description">${doc.description}</p>
              <span class="badge badge-${doc.category}">${doc.category}</span>
            </a>
          `).join('')}
        </div>
        
        <h2>Quick Actions</h2>
        <div class="grid grid-3">
          <a href="#/evidence-matrix" class="card">
            <h3>📊 Evidence Matrix</h3>
            <p>Explore 70 evidence items with filtering and sorting</p>
          </a>
          <a href="#/timeline" class="card">
            <h3>📅 Timeline</h3>
            <p>Visual timeline of 82 key events and decisions</p>
          </a>
          <a href="#/search" class="card">
            <h3>🔍 Search</h3>
            <p>Full-text search across all documents</p>
          </a>
        </div>
      `;
      
      content.innerHTML = html;
      
    } catch (error) {
      console.error('Error rendering home:', error);
      content.innerHTML = `<div class="alert alert-error">Error loading home page: ${error.message}</div>`;
    }
  },
  
  /**
   * Render document page
   */
  async renderDocument(params) {
    const content = document.getElementById('app-content');
    const docId = params.docId;
    
    try {
      // Show loading
      content.innerHTML = '<div class="loading-container"><div class="spinner"></div></div>';
      
      // Load document HTML
      const htmlPath = `docs/html/${docId}.html`;
      const docHTML = await Utils.fetchHTML(htmlPath);
      
      // Extract content from HTML file (it's a complete HTML document)
      const parser = new DOMParser();
      const doc = parser.parseFromString(docHTML, 'text/html');
      const articleContent = doc.querySelector('.document-content').innerHTML;
      
      // Generate TOC
      const { toc, content: processedContent } = Utils.generateTOC(articleContent);
      
      // Render page
      const html = `
        <div class="page-header">
          <nav class="breadcrumbs" aria-label="Breadcrumb">
            <a href="#/">Home</a>
            <span class="breadcrumbs-separator">›</span>
            <span>${this.getDocTitle(docId)}</span>
          </nav>
          <h1 class="page-title">${this.getDocTitle(docId)}</h1>
        </div>
        
        ${toc.length > 0 ? `
          <div class="document-toc">
            <h3>Table of Contents</h3>
            <ul>
              ${toc.map(item => `
                <li style="margin-left: ${(item.level - 2) * 20}px">
                  <a href="#${item.id}">${item.text}</a>
                </li>
              `).join('')}
            </ul>
          </div>
        ` : ''}
        
        <div class="document-content">
          ${processedContent}
        </div>
        
        <div class="mt-2xl">
          <button class="btn btn-primary" onclick="window.print()">
            🖨️ ${I18n.t('actions.print')}
          </button>
          <button class="btn btn-secondary" onclick="Router.shareCurrentPage()">
            🔗 ${I18n.t('actions.share')}
          </button>
        </div>
      `;
      
      content.innerHTML = html;
      
      // Setup TOC click handlers
      document.querySelectorAll('.document-toc a').forEach(link => {
        link.addEventListener('click', (e) => {
          e.preventDefault();
          const id = link.getAttribute('href').slice(1);
          Utils.scrollToElement(id);
        });
      });
      
    } catch (error) {
      console.error('Error rendering document:', error);
      content.innerHTML = `
        <div class="alert alert-error">
          <h3>Document Not Found</h3>
          <p>The document "${docId}" could not be loaded.</p>
          <a href="#/" class="btn btn-primary">Return to Home</a>
        </div>
      `;
    }
  },
  
  /**
   * Render evidence matrix page (placeholder - actual implementation in evidence-matrix.js)
   */
  async renderEvidenceMatrix(params) {
    const content = document.getElementById('app-content');
    content.innerHTML = '<div class="loading-container"><div class="spinner"></div></div>';
    
    if (typeof EvidenceMatrix !== 'undefined') {
      await EvidenceMatrix.render(params);
    } else {
      content.innerHTML = '<div class="alert alert-error">Evidence Matrix module not loaded</div>';
    }
  },
  
  /**
   * Render timeline page (placeholder - actual implementation in timeline.js)
   */
  async renderTimeline(params) {
    const content = document.getElementById('app-content');
    content.innerHTML = '<div class="loading-container"><div class="spinner"></div></div>';
    
    if (typeof Timeline !== 'undefined') {
      await Timeline.render(params);
    } else {
      content.innerHTML = '<div class="alert alert-error">Timeline module not loaded</div>';
    }
  },
  
  /**
   * Render search page (placeholder - actual implementation in search.js)
   */
  async renderSearch(params) {
    const content = document.getElementById('app-content');
    content.innerHTML = '<div class="loading-container"><div class="spinner"></div></div>';
    
    if (typeof SearchEngine !== 'undefined') {
      await SearchEngine.render(params);
    } else {
      content.innerHTML = '<div class="alert alert-error">Search module not loaded</div>';
    }
  },
  
  /**
   * Render 404 page
   */
  render404() {
    const content = document.getElementById('app-content');
    content.innerHTML = `
      <div class="text-center" style="padding: var(--spacing-4xl)">
        <h1 style="font-size: var(--font-size-5xl); margin-bottom: var(--spacing-lg)">404</h1>
        <h2>Page Not Found</h2>
        <p>The page you're looking for doesn't exist.</p>
        <a href="#/" class="btn btn-primary mt-xl">Return to Home</a>
      </div>
    `;
  },
  
  /**
   * Share current page
   */
  async shareCurrentPage() {
    const url = window.location.href;
    const success = await Utils.copyToClipboard(url);
    
    if (success) {
      Utils.showToast('Link copied to clipboard!', 'success');
    } else {
      Utils.showToast('Failed to copy link', 'error');
    }
  },
  
  /**
   * Get document title from ID
   */
  getDocTitle(docId) {
    return docId.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  },
  
  /**
   * Get icon for document
   */
  getDocIcon(iconName) {
    const icons = {
      'document': '📄',
      'table': '📊',
      'alert': '⚠️',
      'map': '🗺️',
      'megaphone': '📣',
      'microphone': '🎤',
      'users': '👥',
      'timeline': '📅',
      'file': '📃',
      'list': '📋',
      'briefcase': '💼',
      'chat': '💬',
      'quote': '💭',
      'search': '🔍',
      'phone': '📞',
      'info': 'ℹ️'
    };
    return icons[iconName] || '📄';
  }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Router;
}
