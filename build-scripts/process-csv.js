#!/usr/bin/env node

/**
 * CSV to JSON Converter
 * Converts evidence_matrix.csv to JSON format
 * Run: node build-scripts/process-csv.js
 */

const fs = require('fs');
const path = require('path');

function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  
  result.push(current.trim());
  return result;
}

function convertCSVToJSON() {
  const csvPath = path.join(__dirname, '../evidence_matrix.csv');
  const outputPath = path.join(__dirname, '../data/evidence_matrix.json');
  
  console.log('Converting CSV to JSON...\n');
  
  try {
    const csvContent = fs.readFileSync(csvPath, 'utf-8');
    const lines = csvContent.split('\n').filter(line => line.trim());
    
    if (lines.length === 0) {
      console.error('Error: CSV file is empty');
      return;
    }
    
    const headers = parseCSVLine(lines[0]).map(h => 
      h.toLowerCase()
        .replace(/[^a-z0-9]+/g, '_')
        .replace(/^_|_$/g, '')
    );
    
    console.log(`Headers: ${headers.join(', ')}\n`);
    
    const data = [];
    
    for (let i = 1; i < lines.length; i++) {
      const values = parseCSVLine(lines[i]);
      
      if (values.length !== headers.length) {
        console.warn(`Warning: Line ${i + 1} has ${values.length} values but expected ${headers.length}`);
        continue;
      }
      
      const row = {};
      headers.forEach((header, index) => {
        row[header] = values[index] || '';
      });
      
      data.push(row);
    }
    
    fs.writeFileSync(outputPath, JSON.stringify(data, null, 2));
    
    console.log(`✓ Successfully converted ${data.length} rows`);
    console.log(`✓ Output: ${outputPath}\n`);
    
    // Print summary statistics
    const categories = {};
    const statuses = {};
    
    data.forEach(row => {
      const cat = row.category || 'Unknown';
      const status = row.verification_status || row.status || 'Unknown';
      
      categories[cat] = (categories[cat] || 0) + 1;
      statuses[status] = (statuses[status] || 0) + 1;
    });
    
    console.log('Summary:');
    console.log('\nBy Category:');
    Object.entries(categories).sort((a, b) => b[1] - a[1]).forEach(([cat, count]) => {
      console.log(`  ${cat}: ${count}`);
    });
    
    console.log('\nBy Status:');
    Object.entries(statuses).sort((a, b) => b[1] - a[1]).forEach(([status, count]) => {
      console.log(`  ${status}: ${count}`);
    });
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// Run conversion
convertCSVToJSON();
