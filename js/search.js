/**
 * Search Engine
 * Full-text search across all documents
 */

const SearchEngine = {
  index: null,
  documents: null,
  
  /**
   * Initialize search engine
   */
  async init() {
    try {
      // Load documents index
      const docsIndex = await Utils.fetchJSON('data/documents.json');
      this.documents = docsIndex.documents;
      
      // Build search index from HTML files
      await this.buildIndex();
      
    } catch (error) {
      console.error('Error initializing search:', error);
    }
  },
  
  /**
   * Build search index
   */
  async buildIndex() {
    this.index = {};
    
    for (const doc of this.documents) {
      try {
        const htmlPath = `docs/html/${doc.filename}`;
        const html = await Utils.fetchHTML(htmlPath);
        
        // Extract text from HTML
        const parser = new DOMParser();
        const parsed = parser.parseFromString(html, 'text/html');
        const text = parsed.body.textContent.toLowerCase();
        
        // Tokenize
        const words = text.match(/\b\w+\b/g) || [];
        
        // Add to inverted index
        words.forEach(word => {
          if (word.length > 2) {  // Ignore very short words
            if (!this.index[word]) {
              this.index[word] = [];
            }
            if (!this.index[word].includes(doc.id)) {
              this.index[word].push(doc.id);
            }
          }
        });
        
      } catch (error) {
        console.error(`Error indexing ${doc.id}:`, error);
      }
    }
  },
  
  /**
   * Search for query
   */
  search(query) {
    if (!query || query.length < 2) return [];
    
    const terms = query.toLowerCase().match(/\b\w+\b/g) || [];
    const results = new Map();
    
    terms.forEach(term => {
      const docIds = this.index[term] || [];
      docIds.forEach(docId => {
        const score = results.get(docId) || 0;
        results.set(docId, score + 1);
      });
    });
    
    // Convert to array and sort by relevance
    return Array.from(results.entries())
      .map(([docId, score]) => ({
        document: this.documents.find(d => d.id === docId),
        relevance: score / terms.length
      }))
      .sort((a, b) => b.relevance - a.relevance);
  },
  
  /**
   * Render search results page
   */
  async render(params) {
    const content = document.getElementById('app-content');
    const query = params.q || '';
    
    const html = `
      <div class="page-header">
        <h1 class="page-title">${I18n.t('search.results')}</h1>
      </div>
      
      <div class="search-box mb-xl">
        <input 
          type="search" 
          class="search-input" 
          id="search-query" 
          placeholder="${I18n.t('search.placeholder')}"
          value="${Utils.escapeHtml(query)}"
        >
        <button class="search-button" onclick="SearchEngine.performSearch()">
          🔍
        </button>
      </div>
      
      <div id="search-results-container"></div>
    `;
    
    content.innerHTML = html;
    
    if (query) {
      this.performSearch(query);
    }
    
    // Setup search input
    document.getElementById('search-query').addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        this.performSearch();
      }
    });
  },
  
  /**
   * Perform search and display results
   */
  performSearch(query = null) {
    const input = document.getElementById('search-query');
    const searchQuery = query || input.value;
    
    if (!searchQuery) return;
    
    // Update URL
    if (!query) {
      Router.navigate(`search?q=${encodeURIComponent(searchQuery)}`);
      return;
    }
    
    const results = this.search(searchQuery);
    const container = document.getElementById('search-results-container');
    
    if (results.length === 0) {
      container.innerHTML = `
        <div class="search-no-results">
          <div class="search-no-results-icon">🔍</div>
          <h3>${I18n.t('search.noResults')}</h3>
          <p>Try different keywords or check the spelling</p>
        </div>
      `;
      return;
    }
    
    const html = `
      <p class="text-muted mb-lg">
        ${I18n.t('search.resultsCount', { count: results.length })}
      </p>
      
      <ul class="search-results">
        ${results.map(result => `
          <li class="search-result-item">
            <h3 class="search-result-title">
              <a href="#/docs/${result.document.id}">${result.document.title}</a>
            </h3>
            <p class="search-result-snippet">${result.document.description}</p>
            <div class="search-result-meta">
              <span class="badge badge-${result.document.category}">${result.document.category}</span>
              <span>${Math.round(result.relevance * 100)}% relevant</span>
              <span>${result.document.wordCount} words</span>
            </div>
          </li>
        `).join('')}
      </ul>
    `;
    
    container.innerHTML = html;
  }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SearchEngine;
}
