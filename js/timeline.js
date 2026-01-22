/**
 * Timeline Visualization
 * SVG-based interactive timeline of events
 */

const Timeline = {
  events: [],
  filteredEvents: [],
  
  /**
   * Initialize timeline
   */
  async init() {
    try {
      this.events = await Utils.fetchJSON('data/timeline.json');
      this.filteredEvents = [...this.events];
    } catch (error) {
      console.error('Error loading timeline:', error);
    }
  },
  
  /**
   * Render timeline page
   */
  async render(params) {
    const content = document.getElementById('app-content');
    
    // Category counts
    const categoryCounts = {};
    this.events.forEach(event => {
      categoryCounts[event.category] = (categoryCounts[event.category] || 0) + 1;
    });
    
    const html = `
      <div class="page-header">
        <h1 class="page-title">${I18n.t('timeline.title')}</h1>
        <p class="page-description">
          ${this.events.length} events from ${Utils.formatDateShort(this.events[0]?.date)} to ${Utils.formatDateShort(this.events[this.events.length - 1]?.date)}
        </p>
      </div>
      
      <div class="timeline-legend">
        <strong>${I18n.t('timeline.legend')}:</strong>
        ${Object.entries(categoryCounts).map(([cat, count]) => `
          <div class="timeline-legend-item">
            <div class="timeline-legend-dot" style="background-color: ${Utils.getCategoryColor(cat)}"></div>
            <span>${cat} (${count})</span>
          </div>
        `).join('')}
      </div>
      
      <div class="timeline-container">
        <div id="timeline-list">
          ${this.renderEventsList()}
        </div>
      </div>
      
      <div class="mt-lg">
        <a href="#/docs/decision_network_timeline" class="btn btn-primary">
          📄 View Full Timeline Document
        </a>
      </div>
    `;
    
    content.innerHTML = html;
  },
  
  /**
   * Render events as list (simplified version)
   */
  renderEventsList() {
    return this.events.map(event => `
      <div class="timeline-event card mb-md" style="border-left: 4px solid ${Utils.getCategoryColor(event.category)}">
        <div class="flex-between mb-sm">
          <strong>${Utils.formatDate(event.date)}</strong>
          <span class="badge" style="background-color: ${Utils.getCategoryColor(event.category)}">${event.category}</span>
        </div>
        <p>${event.title}</p>
        ${event.section ? `<small class="text-muted">${event.section}</small>` : ''}
      </div>
    `).join('');
  }
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = Timeline;
}
