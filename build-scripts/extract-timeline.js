#!/usr/bin/env node

/**
 * Timeline Event Extractor
 * Extracts timeline events from decision_network_timeline.md
 * Run: node build-scripts/extract-timeline.js
 */

const fs = require('fs');
const path = require('path');

function categorizeEvent(text) {
  const lower = text.toLowerCase();
  
  if (lower.includes('vote') || lower.includes('approved') || lower.includes('approval')) {
    return 'vote';
  }
  if (lower.includes('meeting') || lower.includes('discussion') || lower.includes('attend')) {
    return 'meeting';
  }
  if (lower.includes('file') || lower.includes('lawsuit') || lower.includes('complaint') || 
      lower.includes('court') || lower.includes('legal')) {
    return 'legal';
  }
  if (lower.includes('mou') || lower.includes('sign') || lower.includes('execute') || 
      lower.includes('agreement') || lower.includes('ordinance')) {
    return 'agreement';
  }
  if (lower.includes('community') || lower.includes('public comment') || lower.includes('protest')) {
    return 'community';
  }
  if (lower.includes('nda') || lower.includes('secret') || lower.includes('closed')) {
    return 'violation';
  }
  
  return 'other';
}

function parseDate(dateStr) {
  // Try to parse various date formats
  
  // ISO format: 2025-02-25
  const isoMatch = dateStr.match(/(\d{4})-(\d{2})-(\d{2})/);
  if (isoMatch) {
    return dateStr;
  }
  
  // Month Day, Year: February 25, 2025
  const longMatch = dateStr.match(/([A-Z][a-z]+)\s+(\d{1,2}),?\s+(\d{4})/);
  if (longMatch) {
    const months = {
      'January': '01', 'February': '02', 'March': '03', 'April': '04',
      'May': '05', 'June': '06', 'July': '07', 'August': '08',
      'September': '09', 'October': '10', 'November': '11', 'December': '12'
    };
    const month = months[longMatch[1]] || '01';
    const day = longMatch[2].padStart(2, '0');
    const year = longMatch[3];
    return `${year}-${month}-${day}`;
  }
  
  // Month abbreviation: Feb 25, 2025
  const shortMatch = dateStr.match(/([A-Z][a-z]{2,3})\s+(\d{1,2}),?\s+(\d{4})/);
  if (shortMatch) {
    const months = {
      'Jan': '01', 'Feb': '02', 'Mar': '03', 'Apr': '04',
      'May': '05', 'Jun': '06', 'Jul': '07', 'Aug': '08',
      'Sep': '09', 'Oct': '10', 'Nov': '11', 'Dec': '12'
    };
    const month = months[shortMatch[1]] || '01';
    const day = shortMatch[2].padStart(2, '0');
    const year = shortMatch[3];
    return `${year}-${month}-${day}`;
  }
  
  return null;
}

function extractTimelineEvents() {
  const timelinePath = path.join(__dirname, '../docs/markdown/decision_network_timeline.md');
  const outputPath = path.join(__dirname, '../data/timeline.json');
  
  console.log('Extracting timeline events...\n');
  
  try {
    const content = fs.readFileSync(timelinePath, 'utf-8');
    const lines = content.split('\n');
    
    const events = [];
    let currentDate = null;
    let currentSection = '';
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Skip empty lines
      if (!line) continue;
      
      // Check for section headers
      if (line.startsWith('##')) {
        currentSection = line.replace(/^#+\s*/, '');
        continue;
      }
      
      // Look for dates in the line
      const dateMatch = line.match(/\b(\d{4}-\d{2}-\d{2}|\w+\s+\d{1,2},?\s+\d{4})\b/);
      if (dateMatch) {
        const parsedDate = parseDate(dateMatch[0]);
        if (parsedDate) {
          currentDate = parsedDate;
        }
      }
      
      // Extract events from bullet points or bold items
      if (currentDate && (line.startsWith('- ') || line.startsWith('* ') || line.startsWith('+ '))) {
        const eventText = line.replace(/^[-*+]\s*/, '').replace(/\*\*/g, '').trim();
        
        if (eventText.length > 10) {
          events.push({
            date: currentDate,
            title: eventText.substring(0, 150), // Limit length
            category: categorizeEvent(eventText),
            section: currentSection,
            source: 'decision_network_timeline.md'
          });
        }
      }
      
      // Also check for events in bold that aren't bullets
      const boldMatch = line.match(/\*\*(.+?)\*\*/);
      if (currentDate && boldMatch && !line.startsWith('#')) {
        const eventText = boldMatch[1].trim();
        
        if (eventText.length > 10 && !events.some(e => e.title === eventText)) {
          events.push({
            date: currentDate,
            title: eventText,
            category: categorizeEvent(eventText),
            section: currentSection,
            source: 'decision_network_timeline.md'
          });
        }
      }
    }
    
    // Sort events by date
    events.sort((a, b) => new Date(a.date) - new Date(b.date));
    
    // Remove duplicates
    const uniqueEvents = [];
    const seen = new Set();
    
    events.forEach(event => {
      const key = `${event.date}-${event.title}`;
      if (!seen.has(key)) {
        seen.add(key);
        uniqueEvents.push(event);
      }
    });
    
    fs.writeFileSync(outputPath, JSON.stringify(uniqueEvents, null, 2));
    
    console.log(` Extracted ${uniqueEvents.length} timeline events`);
    console.log(` Output: ${outputPath}\n`);
    
    // Print summary by category
    const categoryCounts = {};
    uniqueEvents.forEach(event => {
      categoryCounts[event.category] = (categoryCounts[event.category] || 0) + 1;
    });
    
    console.log('Events by Category:');
    Object.entries(categoryCounts).sort((a, b) => b[1] - a[1]).forEach(([cat, count]) => {
      console.log(`  ${cat}: ${count}`);
    });
    
    console.log('\nDate Range:');
    if (uniqueEvents.length > 0) {
      console.log(`  From: ${uniqueEvents[0].date}`);
      console.log(`  To: ${uniqueEvents[uniqueEvents.length - 1].date}`);
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// Run extraction
extractTimelineEvents();
