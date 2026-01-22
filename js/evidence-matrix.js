/**
 * Evidence Matrix Viewer
 * Interactive data table with filtering and sorting
 */

const EvidenceMatrix = {
  data: [],
  filteredData: [],
  sortColumn: null,
  sortDirection: 'asc',
  currentPage: 1,
  rowsPerPage: 25,
  
  /**
   * Initialize evidence matrix
   */
  async init() {
    try {
      this.data = await Utils.fetchJSON('data/evidence_matrix.json');
      this.filteredData = [...this.data];
    } catch (error) {
      console.error('Error loading evidence matrix:', error);
    }
  },
  
  /**
   * Render evidence matrix page
   */
  async render(params) {
    const content = document.getElementById('app-content');
    
    const html = `
      <div class="page-header">
        <h1 class="page-title">${I18n.t('evidence.title')}</h1>
        <p class="page-description">
          ${this.data.length} evidence items with atomic facts, sources, and verification status
        </p>
      </div>
      
      <div class="evidence-filters">
        <h3>${I18n.t('evidence.filters')}</h3>
        <div class="filter-grid">
          <div class="form-group">
            <label class="form-label">${I18n.t('evidence.status')}</label>
            <select class="form-select" id="status-filter">
              <option value="">${I18n.t('evidence.showAll')}</option>
              <option value="verified_primary">Verified Primary</option>
              <option value="verified_secondary">Verified Secondary</option>
              <option value="needs_verification">Needs Verification</option>
              <option value="as_captured_in_user_matrix">As Captured</option>
            </select>
          </div>
          
          <div class="form-group">
            <label class="form-label">${I18n.t('actions.search')}</label>
            <input type="search" class="form-input" id="table-search" placeholder="${I18n.t('evidence.searchTable')}">
          </div>
          
          <div class="form-group">
            <label class="form-label">&nbsp;</label>
            <button class="btn btn-secondary btn-block" onclick="EvidenceMatrix.clearFilters()">
              ${I18n.t('actions.clear')}
            </button>
          </div>
        </div>
      </div>
      
      <div class="table-wrapper">
        <table class="evidence-matrix-table table-responsive" id="evidence-table">
          <thead>
            <tr>
              <th onclick="EvidenceMatrix.sortBy('id')">ID</th>
              <th onclick="EvidenceMatrix.sortBy('type')">Type</th>
              <th onclick="EvidenceMatrix.sortBy('timestamp')">Date</th>
              <th onclick="EvidenceMatrix.sortBy('actor')">Actor</th>
              <th>Statement/Action</th>
              <th>Source</th>
              <th onclick="EvidenceMatrix.sortBy('verification_status')">Status</th>
            </tr>
          </thead>
          <tbody id="evidence-tbody">
            ${this.renderTableBody()}
          </tbody>
        </table>
      </div>
      
      <div class="evidence-matrix-pagination">
        <div>
          Showing ${((this.currentPage - 1) * this.rowsPerPage) + 1}-${Math.min(this.currentPage * this.rowsPerPage, this.filteredData.length)} of ${this.filteredData.length}
        </div>
        <div class="flex gap-sm">
          <button class="btn btn-sm btn-secondary" onclick="EvidenceMatrix.previousPage()" ${this.currentPage === 1 ? 'disabled' : ''}>
            ← Previous
          </button>
          <button class="btn btn-sm btn-secondary" onclick="EvidenceMatrix.nextPage()" ${this.currentPage * this.rowsPerPage >= this.filteredData.length ? 'disabled' : ''}>
            Next →
          </button>
        </div>
      </div>
      
      <div class="mt-lg">
        <button class="btn btn-accent" onclick="EvidenceMatrix.exportCSV()">
          💾 ${I18n.t('actions.export')} CSV
        </button>
      </div>
    `;
    
    content.innerHTML = html;
    
    // Setup event listeners
    document.getElementById('status-filter').addEventListener('change', () => this.applyFilters());
    document.getElementById('table-search').addEventListener('input', Utils.debounce(() => this.applyFilters(), 300));
  },
  
  /**
   * Render table body
   */
  renderTableBody() {
    const start = (this.currentPage - 1) * this.rowsPerPage;
    const end = start + this.rowsPerPage;
    const pageData = this.filteredData.slice(start, end);
    
    return pageData.map(row => `
      <tr>
        <td>${row.id || ''}</td>
        <td>${row.type || ''}</td>
        <td>${row.timestamp ? Utils.formatDateShort(row.timestamp) : ''}</td>
        <td>${row.actor || ''}</td>
        <td>${Utils.truncate(row.statement_or_action || '', 100)}</td>
        <td>${Utils.truncate(row.source || '', 50)}</td>
        <td><span class="badge ${Utils.getVerificationBadgeClass(row.verification_status)}">${row.verification_status || ''}</span></td>
      </tr>
    `).join('');
  },
  
  /**
   * Apply filters
   */
  applyFilters() {
    const status = document.getElementById('status-filter').value;
    const search = document.getElementById('table-search').value.toLowerCase();
    
    this.filteredData = this.data.filter(row => {
      if (status && row.verification_status !== status) return false;
      
      if (search) {
        const searchStr = Object.values(row).join(' ').toLowerCase();
        if (!searchStr.includes(search)) return false;
      }
      
      return true;
    });
    
    this.currentPage = 1;
    this.updateTable();
  },
  
  /**
   * Clear filters
   */
  clearFilters() {
    document.getElementById('status-filter').value = '';
    document.getElementById('table-search').value = '';
    this.applyFilters();
  },
  
  /**
   * Sort by column
   */
  sortBy(column) {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    
    this.filteredData.sort((a, b) => {
      const aVal = a[column] || '';
      const bVal = b[column] || '';
      const mult = this.sortDirection === 'asc' ? 1 : -1;
      return aVal > bVal ? mult : -mult;
    });
    
    this.updateTable();
  },
  
  /**
   * Update table display
   */
  updateTable() {
    const tbody = document.getElementById('evidence-tbody');
    if (tbody) {
      tbody.innerHTML = this.renderTableBody();
    }
  },
  
  /**
   * Pagination
   */
  nextPage() {
    if (this.currentPage * this.rowsPerPage < this.filteredData.length) {
      this.currentPage++;
      this.render({});
    }
  },
  
  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.render({});
    }
  },
  
  /**
   * Export to CSV
   */
  exportCSV() {
    const headers = ['ID', 'Type', 'Date', 'Actor', 'Statement/Action', 'Source', 'Status'];
    const rows = this.filteredData.map(row => [
      row.id, row.type, row.timestamp, row.actor, 
      row.statement_or_action, row.source, row.verification_status
    ]);
    
    let csv = headers.join(',') + '\n';
    csv += rows.map(row => row.map(cell => `"${cell || ''}"`).join(',')).join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'evidence-matrix.csv';
    a.click();
    URL.revokeObjectURL(url);
    
    Utils.showToast('CSV exported successfully!', 'success');
  }
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = EvidenceMatrix;
}
