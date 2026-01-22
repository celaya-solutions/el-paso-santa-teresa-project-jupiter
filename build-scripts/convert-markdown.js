#!/usr/bin/env node

/**
 * Markdown to HTML Converter
 * Converts all .md files to .html using marked library
 * Run: node build-scripts/convert-markdown.js
 */

const fs = require('fs');
const path = require('path');

// Simple markdown parser (no dependencies)
function parseMarkdown(markdown) {
  let html = markdown;
  
  // Headers
  html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
  html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
  html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');
  
  // Bold
  html = html.replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>');
  
  // Italic
  html = html.replace(/\*(.*?)\*/gim, '<em>$1</em>');
  
  // Links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2">$1</a>');
  
  // Lists
  html = html.replace(/^\* (.*$)/gim, '<li>$1</li>');
  html = html.replace(/^- (.*$)/gim, '<li>$1</li>');
  html = html.replace(/^(\d+)\. (.*$)/gim, '<li>$2</li>');
  
  // Wrap consecutive <li> in <ul>
  html = html.replace(/(<li>.*?<\/li>\n?)+/gs, (match) => {
    return '<ul>\n' + match + '</ul>\n';
  });
  
  // Code blocks
  html = html.replace(/```([^`]+)```/gim, '<pre><code>$1</code></pre>');
  html = html.replace(/`([^`]+)`/gim, '<code>$1</code>');
  
  // Blockquotes
  html = html.replace(/^> (.*$)/gim, '<blockquote>$1</blockquote>');
  
  // Horizontal rules
  html = html.replace(/^---$/gim, '<hr>');
  
  // Paragraphs (lines with content that aren't already tagged)
  const lines = html.split('\n');
  const processedLines = lines.map(line => {
    const trimmed = line.trim();
    if (trimmed && 
        !trimmed.startsWith('<') && 
        !trimmed.endsWith('>') &&
        trimmed.length > 0) {
      return '<p>' + line + '</p>';
    }
    return line;
  });
  
  html = processedLines.join('\n');
  
  // Clean up empty paragraphs
  html = html.replace(/<p>\s*<\/p>/g, '');
  html = html.replace(/<p>(\s*<[^>]+>.*<\/[^>]+>\s*)<\/p>/g, '$1');
  
  return html;
}

// Create document template
function createHTMLDocument(title, content) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
</head>
<body>
  <article class="document-content">
    ${content}
  </article>
</body>
</html>`;
}

// Main conversion function
function convertMarkdownFiles() {
  const markdownDir = path.join(__dirname, '../docs/markdown');
  const htmlDir = path.join(__dirname, '../docs/html');
  
  if (!fs.existsSync(htmlDir)) {
    fs.mkdirSync(htmlDir, { recursive: true });
  }
  
  const files = fs.readdirSync(markdownDir).filter(f => f.endsWith('.md'));
  
  console.log(`Converting ${files.length} markdown files...\n`);
  
  files.forEach(file => {
    try {
      const filePath = path.join(markdownDir, file);
      const markdown = fs.readFileSync(filePath, 'utf-8');
      const html = parseMarkdown(markdown);
      
      const title = file.replace('.md', '').replace(/_/g, ' ');
      const fullHTML = createHTMLDocument(title, html);
      
      const outputName = file.replace('.md', '.html');
      const outputPath = path.join(htmlDir, outputName);
      
      fs.writeFileSync(outputPath, fullHTML);
      console.log(`✓ ${file} → ${outputName}`);
    } catch (error) {
      console.error(`✗ Error converting ${file}:`, error.message);
    }
  });
  
  console.log(`\nConversion complete! Generated ${files.length} HTML files.`);
}

// Run conversion
convertMarkdownFiles();
