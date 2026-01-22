#!/usr/bin/env node

/**
 * Document Index Generator
 * Creates an index of all documents with metadata
 * Run: node build-scripts/create-document-index.js
 */

const fs = require('fs');
const path = require('path');

// Document metadata
const documentInfo = {
  'CONSOLIDATED_PUBLIC_REPORT': {
    title: 'Consolidated Public Report',
    category: 'core',
    priority: 1,
    description: 'Complete public-facing accountability report with executive summary, findings, and action items',
    icon: 'document',
    featured: true
  },
  'evidence_matrix': {
    title: 'Evidence Matrix',
    category: 'core',
    priority: 2,
    description: '71 evidence rows with atomic facts, sources, and verification status',
    icon: 'table',
    featured: true
  },
  'contradictions': {
    title: 'Contradictions Analysis',
    category: 'core',
    priority: 3,
    description: '15 documented contradictions between sources with legal implications',
    icon: 'alert',
    featured: true
  },
  'accountability_map': {
    title: 'Accountability Map',
    category: 'core',
    priority: 4,
    description: 'Legal exposure, political accountability, and enforcement pathways',
    icon: 'map',
    featured: true
  },
  'public_messaging_30_days': {
    title: '30-Day Messaging Campaign',
    category: 'action',
    priority: 5,
    description: 'Bilingual social media campaign with daily messages and citations',
    icon: 'megaphone',
    featured: true
  },
  'public_comment_scripts': {
    title: 'Public Comment Scripts',
    category: 'action',
    priority: 6,
    description: 'Time-bounded scripts for commission meetings with follow-up questions',
    icon: 'microphone',
    featured: true
  },
  'opposition_research_profiles': {
    title: 'Opposition Research Profiles',
    category: 'research',
    priority: 7,
    description: 'Research framework for commissioners who voted YES',
    icon: 'users',
    featured: false
  },
  'decision_network_timeline': {
    title: 'Decision Network Timeline',
    category: 'research',
    priority: 8,
    description: 'Chronological timeline with network analysis and pattern identification',
    icon: 'timeline',
    featured: true
  },
  'PROJECT_JUPITER_EXECUTIVE_SUMMARY': {
    title: 'Executive Summary',
    category: 'overview',
    priority: 9,
    description: 'Executive summary for officials and media',
    icon: 'file',
    featured: false
  },
  'PROJECT_JUPITER_FACT_SHEET': {
    title: 'Fact Sheet',
    category: 'overview',
    priority: 10,
    description: 'Quick reference fact sheet',
    icon: 'list',
    featured: false
  },
  'PROJECT_JUPITER_EVIDENCE_BRIEFING': {
    title: 'Evidence Briefing',
    category: 'legal',
    priority: 11,
    description: 'Detailed evidence briefing',
    icon: 'briefcase',
    featured: false
  },
  'PROJECT_JUPITER_TALKING_POINTS': {
    title: 'Talking Points',
    category: 'action',
    priority: 12,
    description: 'Key talking points for advocacy',
    icon: 'chat',
    featured: false
  },
  'PROJECT_JUPITER_QUOTES_COMPILATION': {
    title: 'Quotes Compilation',
    category: 'reference',
    priority: 13,
    description: 'Compilation of key quotes',
    icon: 'quote',
    featured: false
  },
  'PROJECT_JUPITER_PUBLIC_COMMENT_SCRIPTS': {
    title: 'Public Comment Scripts (Full)',
    category: 'action',
    priority: 14,
    description: 'Full collection of public comment scripts',
    icon: 'microphone',
    featured: false
  },
  'PROJECT_JUPITER_COMMISSIONER_OPPOSITION_RESEARCH': {
    title: 'Commissioner Research',
    category: 'research',
    priority: 15,
    description: 'Opposition research on commissioners',
    icon: 'search',
    featured: false
  },
  'PROJECT_JUPITER_ACCOUNTABILITY_MATRIX': {
    title: 'Accountability Matrix (Original)',
    category: 'reference',
    priority: 16,
    description: 'Original accountability matrix',
    icon: 'table',
    featured: false
  },
  'CONTACTS': {
    title: 'Contact Information',
    category: 'reference',
    priority: 17,
    description: 'Key contacts for community leaders and legal teams',
    icon: 'phone',
    featured: false
  },
  'README': {
    title: 'Documentation',
    category: 'reference',
    priority: 18,
    description: 'Project documentation and usage guide',
    icon: 'info',
    featured: false
  }
};

function createDocumentIndex() {
  const markdownDir = path.join(__dirname, '../docs/markdown');
  const outputPath = path.join(__dirname, '../data/documents.json');
  
  console.log('Creating document index...\n');
  
  try {
    const files = fs.readdirSync(markdownDir).filter(f => f.endsWith('.md'));
    
    const documents = files.map(filename => {
      const id = filename.replace('.md', '');
      const info = documentInfo[id] || {
        title: id.replace(/_/g, ' '),
        category: 'other',
        priority: 99,
        description: '',
        icon: 'document',
        featured: false
      };
      
      const filePath = path.join(markdownDir, filename);
      const stats = fs.statSync(filePath);
      const content = fs.readFileSync(filePath, 'utf-8');
      const wordCount = content.split(/\s+/).length;
      
      return {
        id,
        filename: filename.replace('.md', '.html'),
        ...info,
        wordCount,
        lastModified: stats.mtime.toISOString()
      };
    });
    
    // Sort by priority
    documents.sort((a, b) => a.priority - b.priority);
    
    const index = {
      generated: new Date().toISOString(),
      totalDocuments: documents.length,
      documents,
      categories: {
        core: documents.filter(d => d.category === 'core'),
        action: documents.filter(d => d.category === 'action'),
        research: documents.filter(d => d.category === 'research'),
        legal: documents.filter(d => d.category === 'legal'),
        overview: documents.filter(d => d.category === 'overview'),
        reference: documents.filter(d => d.category === 'reference'),
        other: documents.filter(d => d.category === 'other')
      },
      featured: documents.filter(d => d.featured)
    };
    
    fs.writeFileSync(outputPath, JSON.stringify(index, null, 2));
    
    console.log(`✓ Indexed ${documents.length} documents`);
    console.log(`✓ Output: ${outputPath}\n`);
    
    console.log('Documents by Category:');
    Object.entries(index.categories).forEach(([cat, docs]) => {
      if (docs.length > 0) {
        console.log(`  ${cat}: ${docs.length}`);
      }
    });
    
    console.log(`\nFeatured Documents: ${index.featured.length}`);
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// Run index creation
createDocumentIndex();
