/**
 * Main Application
 * Project Jupiter Evidence Portal
 */

const App = {
  /**
   * Initialize application
   */
  async init() {
    console.log('Initializing Project Jupiter Evidence Portal...');
    
    try {
      // Initialize i18n system
      await I18n.init();
      console.log('✓ i18n initialized');
      
      // Initialize search engine
      await SearchEngine.init();
      console.log('✓ Search engine initialized');
      
      // Initialize evidence matrix
      await EvidenceMatrix.init();
      console.log('✓ Evidence matrix initialized');
      
      // Initialize timeline
      await Timeline.init();
      console.log('✓ Timeline initialized');
      
      // Initialize router (this will render the initial page)
      Router.init();
      console.log('✓ Router initialized');
      
      // Setup global event listeners
      this.setupEventListeners();
      console.log('✓ Event listeners setup');
      
      console.log('✅ Application ready!');
      
    } catch (error) {
      console.error('Error initializing application:', error);
      this.showError('Failed to initialize application. Please refresh the page.');
    }
  },
  
  /**
   * Setup global event listeners
   */
  setupEventListeners() {
    // Mobile menu toggle
    const menuToggle = document.getElementById('menu-toggle');
    const sidebar = document.getElementById('sidebar');
    
    if (menuToggle && sidebar) {
      menuToggle.addEventListener('click', () => {
        sidebar.classList.toggle('open');
        const isOpen = sidebar.classList.contains('open');
        menuToggle.setAttribute('aria-expanded', isOpen);
      });
      
      // Close sidebar when clicking outside on mobile
      document.addEventListener('click', (e) => {
        if (window.innerWidth <= 768 && 
            sidebar.classList.contains('open') && 
            !sidebar.contains(e.target) && 
            e.target !== menuToggle) {
          sidebar.classList.remove('open');
          menuToggle.setAttribute('aria-expanded', 'false');
        }
      });
    }
    
    // Header search
    const headerSearch = document.getElementById('header-search');
    const searchButton = document.getElementById('search-button');
    
    if (headerSearch && searchButton) {
      headerSearch.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          const query = headerSearch.value.trim();
          if (query) {
            Router.navigate(`search?q=${encodeURIComponent(query)}`);
          }
        }
      });
      
      searchButton.addEventListener('click', () => {
        const query = headerSearch.value.trim();
        if (query) {
          Router.navigate(`search?q=${encodeURIComponent(query)}`);
        }
      });
    }
    
    // Print button
    const printButton = document.getElementById('print-button');
    if (printButton) {
      printButton.addEventListener('click', () => {
        window.print();
      });
    }
    
    // Language change event
    window.addEventListener('languageChanged', (e) => {
      console.log('Language changed to:', e.detail.lang);
      // Re-render current route if needed
      Router.handleRoute();
    });
    
    // Handle browser back/forward buttons
    window.addEventListener('popstate', () => {
      Router.handleRoute();
    });
    
    // Update last modified date
    this.updateLastModified();
  },
  
  /**
   * Update last modified date in header
   */
  updateLastModified() {
    const lastUpdatedElement = document.getElementById('last-updated');
    if (lastUpdatedElement) {
      const date = new Date('2026-01-22');
      lastUpdatedElement.textContent = Utils.formatDate(date.toISOString());
    }
  },
  
  /**
   * Show error message
   */
  showError(message) {
    const content = document.getElementById('app-content');
    if (content) {
      content.innerHTML = `
        <div class="alert alert-error">
          <h3>Error</h3>
          <p>${message}</p>
        </div>
      `;
    }
  }
};

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => App.init());
} else {
  App.init();
}

// Export for debugging
window.App = App;
window.Router = Router;
window.I18n = I18n;
window.SearchEngine = SearchEngine;
window.EvidenceMatrix = EvidenceMatrix;
window.Timeline = Timeline;
window.Utils = Utils;
