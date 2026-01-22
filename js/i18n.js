/**
 * Internationalization (i18n) Module
 * Handles bilingual support (English/Spanish)
 */

const I18n = {
  currentLang: 'en',
  translations: {},
  
  /**
   * Initialize i18n system
   */
  async init() {
    // Load language from localStorage or default to English
    this.currentLang = Utils.storage.get('language', 'en');
    
    // Load translation files
    try {
      const [enTranslations, esTranslations] = await Promise.all([
        Utils.fetchJSON('data/translations-en.json').catch(() => this.getDefaultEnglishTranslations()),
        Utils.fetchJSON('data/translations-es.json').catch(() => this.getDefaultSpanishTranslations())
      ]);
      
      this.translations.en = enTranslations;
      this.translations.es = esTranslations;
      
    } catch (error) {
      console.error('Error loading translations:', error);
      this.translations.en = this.getDefaultEnglishTranslations();
      this.translations.es = this.getDefaultSpanishTranslations();
    }
    
    // Set up language toggle buttons
    this.setupLanguageToggle();
    
    // Apply current language
    this.setLanguage(this.currentLang);
  },
  
  /**
   * Get translation for a key
   */
  t(key, replacements = {}) {
    const keys = key.split('.');
    let value = this.translations[this.currentLang];
    
    for (const k of keys) {
      if (value && typeof value === 'object') {
        value = value[k];
      } else {
        break;
      }
    }
    
    // If translation not found, return key
    if (typeof value !== 'string') {
      return key;
    }
    
    // Replace placeholders
    let result = value;
    for (const [placeholder, replacement] of Object.entries(replacements)) {
      result = result.replace(`{${placeholder}}`, replacement);
    }
    
    return result;
  },
  
  /**
   * Set active language
   */
  setLanguage(lang) {
    this.currentLang = lang;
    Utils.storage.set('language', lang);
    document.documentElement.lang = lang;
    
    // Update UI
    this.updatePageText();
    this.updateLanguageToggle();
    
    // Dispatch event for other components to respond
    window.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang } }));
  },
  
  /**
   * Update all text with data-i18n attributes
   */
  updatePageText() {
    // Update text content
    document.querySelectorAll('[data-i18n]').forEach(element => {
      const key = element.getAttribute('data-i18n');
      element.textContent = this.t(key);
    });
    
    // Update placeholder attributes
    document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
      const key = element.getAttribute('data-i18n-placeholder');
      element.placeholder = this.t(key);
    });
    
    // Update aria-label attributes
    document.querySelectorAll('[data-i18n-aria]').forEach(element => {
      const key = element.getAttribute('data-i18n-aria');
      element.setAttribute('aria-label', this.t(key));
    });
    
    // Update title attributes
    document.querySelectorAll('[data-i18n-title]').forEach(element => {
      const key = element.getAttribute('data-i18n-title');
      element.title = this.t(key);
    });
  },
  
  /**
   * Setup language toggle buttons
   */
  setupLanguageToggle() {
    const enButton = document.getElementById('lang-en');
    const esButton = document.getElementById('lang-es');
    
    if (enButton) {
      enButton.addEventListener('click', () => this.setLanguage('en'));
    }
    
    if (esButton) {
      esButton.addEventListener('click', () => this.setLanguage('es'));
    }
  },
  
  /**
   * Update language toggle button states
   */
  updateLanguageToggle() {
    const enButton = document.getElementById('lang-en');
    const esButton = document.getElementById('lang-es');
    
    if (enButton && esButton) {
      enButton.classList.toggle('active', this.currentLang === 'en');
      esButton.classList.toggle('active', this.currentLang === 'es');
    }
  },
  
  /**
   * Default English translations (fallback)
   */
  getDefaultEnglishTranslations() {
    return {
      site: {
        title: 'Project Jupiter Evidence Portal'
      },
      header: {
        lastUpdated: 'Last Updated:'
      },
      nav: {
        startHere: '★ START HERE',
        coreDeliverables: 'Core Deliverables',
        actionCenter: 'Action Center',
        research: 'Research & Analysis',
        reference: 'Reference',
        evidenceMatrix: 'Evidence Matrix'
      },
      docs: {
        consolidatedReport: 'Consolidated Public Report',
        evidenceMatrix: 'Evidence Matrix',
        contradictions: 'Contradictions Analysis',
        accountabilityMap: 'Accountability Map',
        messagingCampaign: '30-Day Messaging Campaign',
        publicComments: 'Public Comment Scripts',
        talkingPoints: 'Talking Points',
        timeline: 'Decision Network Timeline',
        oppositionResearch: 'Opposition Research',
        evidenceBriefing: 'Evidence Briefing',
        executiveSummary: 'Executive Summary',
        factSheet: 'Fact Sheet',
        contacts: 'Contact Information',
        readme: 'Documentation'
      },
      search: {
        placeholder: 'Search documents...',
        searching: 'Searching...',
        results: 'Search Results',
        noResults: 'No results found',
        resultsCount: '{count} results found'
      },
      actions: {
        print: 'Print',
        share: 'Share',
        download: 'Download',
        export: 'Export',
        filter: 'Filter',
        sort: 'Sort',
        search: 'Search'
      },
      footer: {
        about: 'About This Project',
        aboutText: 'Project Jupiter Evidence Portal provides comprehensive documentation and accountability tools for community organizers, legal teams, journalists, and residents opposing the unlawful approval of a $165 billion data center complex in Santa Teresa, New Mexico.',
        quickLinks: 'Quick Links',
        resources: 'Resources',
        license: 'Public Domain for Community Use',
        updated: 'Last Updated:',
        documentation: 'Documentation'
      }
    };
  },
  
  /**
   * Default Spanish translations (fallback)
   */
  getDefaultSpanishTranslations() {
    return {
      site: {
        title: 'Portal de Evidencia de Proyecto Júpiter'
      },
      header: {
        lastUpdated: 'Última Actualización:'
      },
      nav: {
        startHere: '★ EMPIEZA AQUÍ',
        coreDeliverables: 'Documentos Principales',
        actionCenter: 'Centro de Acción',
        research: 'Investigación y Análisis',
        reference: 'Referencia',
        evidenceMatrix: 'Matriz de Evidencia'
      },
      docs: {
        consolidatedReport: 'Informe Público Consolidado',
        evidenceMatrix: 'Matriz de Evidencia',
        contradictions: 'Análisis de Contradicciones',
        accountabilityMap: 'Mapa de Responsabilidad',
        messagingCampaign: 'Campaña de Mensajes de 30 Días',
        publicComments: 'Guiones de Comentarios Públicos',
        talkingPoints: 'Puntos de Conversación',
        timeline: 'Cronología de Decisiones',
        oppositionResearch: 'Investigación de Oposición',
        evidenceBriefing: 'Resumen de Evidencia',
        executiveSummary: 'Resumen Ejecutivo',
        factSheet: 'Hoja de Datos',
        contacts: 'Información de Contacto',
        readme: 'Documentación'
      },
      search: {
        placeholder: 'Buscar documentos...',
        searching: 'Buscando...',
        results: 'Resultados de Búsqueda',
        noResults: 'No se encontraron resultados',
        resultsCount: '{count} resultados encontrados'
      },
      actions: {
        print: 'Imprimir',
        share: 'Compartir',
        download: 'Descargar',
        export: 'Exportar',
        filter: 'Filtrar',
        sort: 'Ordenar',
        search: 'Buscar'
      },
      footer: {
        about: 'Acerca de Este Proyecto',
        aboutText: 'El Portal de Evidencia de Proyecto Júpiter proporciona documentación integral y herramientas de responsabilidad para organizadores comunitarios, equipos legales, periodistas y residentes que se oponen a la aprobación ilegal de un complejo de centro de datos de $165 mil millones en Santa Teresa, Nuevo México.',
        quickLinks: 'Enlaces Rápidos',
        resources: 'Recursos',
        license: 'Dominio Público para Uso Comunitario',
        updated: 'Última Actualización:',
        documentation: 'Documentación'
      }
    };
  }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = I18n;
}
