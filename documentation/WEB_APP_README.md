# Project Jupiter Evidence Portal - Web App

A clean, minimal static web application for presenting Project Jupiter evidence and accountability documentation.

## Features

✅ **Zero Dependencies** - Pure HTML, CSS, and vanilla JavaScript  
✅ **Fast & Lightweight** - No build process, no frameworks  
✅ **Bilingual** - Full English/Spanish support  
✅ **Mobile Responsive** - Works on all devices  
✅ **Accessible** - WCAG 2.1 AA compliant  
✅ **Print-Friendly** - Optimized for PDF export  
✅ **Offline Capable** - Works after first load  

### Core Features

- **18 Documents** - All markdown files converted to HTML
- **70 Evidence Items** - Interactive filterable/sortable table
- **82 Timeline Events** - Visual chronological timeline  
- **Full-Text Search** - Search across all documents
- **Document Navigation** - Sidebar with organized sections
- **Share & Print** - Easy sharing and printing of any page

## Project Structure

```
project-jupiter/
├── index.html                 # Main entry point
├── css/                       # Stylesheets
│   ├── variables.css          # CSS custom properties
│   ├── base.css               # Reset & typography
│   ├── layout.css             # Grid & layout
│   ├── components.css         # UI components
│   ├── print.css              # Print styles
│   └── main.css               # Master CSS file
├── js/                        # JavaScript modules
│   ├── app.js                 # Main app controller
│   ├── router.js              # Client-side routing
│   ├── search.js              # Full-text search
│   ├── evidence-matrix.js     # Evidence table
│   ├── timeline.js            # Timeline viewer
│   ├── i18n.js                # Bilingual support
│   └── utils.js               # Helper functions
├── data/                      # Data files
│   ├── documents.json         # Document index
│   ├── evidence_matrix.json   # Evidence data
│   ├── timeline.json          # Timeline events
│   ├── translations-en.json   # English UI strings
│   └── translations-es.json   # Spanish UI strings
├── docs/                      # Documents
│   ├── html/                  # Converted HTML files
│   └── markdown/              # Original markdown
└── build-scripts/             # Data processing scripts
    ├── convert-markdown.js
    ├── process-csv.js
    ├── extract-timeline.js
    └── create-document-index.js
```

## How to Use

### Option 1: Local Development

1. **Open directly in browser:**
   ```bash
   # Navigate to project directory
   cd project-jupiter
   
   # Open index.html in your browser
   open index.html  # macOS
   # or
   start index.html  # Windows
   # or
   xdg-open index.html  # Linux
   ```

2. **Or use a local server** (recommended for full functionality):
   ```bash
   # Python 3
   python3 -m http.server 8000
   
   # Python 2
   python -m SimpleHTTPServer 8000
   
   # Node.js (if you have npx)
   npx serve
   
   # Then open: http://localhost:8000
   ```

### Option 2: GitHub Pages Deployment

1. **Create GitHub repository:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Project Jupiter Evidence Portal"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/project-jupiter.git
   git push -u origin main
   ```

2. **Enable GitHub Pages:**
   - Go to repository Settings → Pages
   - Source: Deploy from branch
   - Branch: main / (root)
   - Save

3. **Access your site:**
   - URL: `https://YOUR_USERNAME.github.io/project-jupiter/`

### Option 3: Other Hosting

Upload all files to:
- **Netlify** - Drag and drop folder
- **Vercel** - Connect GitHub repo
- **AWS S3** - Static website hosting
- **Any web host** - Upload via FTP

## Updating Content

### Add New Documents

1. Add markdown file to `docs/markdown/`
2. Run conversion script:
   ```bash
   node build-scripts/convert-markdown.js
   ```
3. Update `build-scripts/create-document-index.js` with metadata
4. Run:
   ```bash
   node build-scripts/create-document-index.js
   ```

### Update Evidence Matrix

1. Edit `evidence_matrix.csv`
2. Run:
   ```bash
   node build-scripts/process-csv.js
   ```

### Update Timeline

1. Edit `docs/markdown/decision_network_timeline.md`
2. Run:
   ```bash
   node build-scripts/extract-timeline.js
   ```

### Add Translations

1. Edit `data/translations-en.json` and `data/translations-es.json`
2. Refresh page - translations load automatically

## Browser Support

- ✅ Chrome/Edge (latest 2 versions)
- ✅ Firefox (latest 2 versions)
- ✅ Safari (latest 2 versions)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## Performance

- **Initial Load:** < 3 seconds (including all documents)
- **Search Response:** < 100ms
- **Page Navigation:** < 50ms
- **Total Size:** ~500KB uncompressed

## Design System

Matches El Paso City website (elpasotexas.gov):
- **Primary Color:** Navy #1d2754
- **Accent Color:** Orange #da532c
- **Typography:** System font stack
- **Layout:** Max-width 1200px, responsive grid

## Customization

### Change Colors

Edit `css/variables.css`:
```css
:root {
  --color-primary: #1d2754;  /* Your primary color */
  --color-accent: #da532c;   /* Your accent color */
}
```

### Change Layout

Edit `css/layout.css`:
```css
:root {
  --container-max-width: 1200px;  /* Your max width */
  --sidebar-width: 280px;         /* Sidebar width */
}
```

### Add Custom Pages

1. Add route in `js/router.js`:
   ```javascript
   this.routes = {
     // ... existing routes
     'custom-page': this.renderCustomPage
   };
   ```

2. Add render function:
   ```javascript
   renderCustomPage() {
     const content = document.getElementById('app-content');
     content.innerHTML = '<h1>Custom Page</h1>';
   }
   ```

3. Add navigation link in `index.html`

## Troubleshooting

### Documents not loading
- Check that `docs/html/` contains all HTML files
- Run `node build-scripts/convert-markdown.js`

### Search not working
- Open browser console for errors
- Check that `data/documents.json` exists

### Evidence matrix empty
- Verify `data/evidence_matrix.json` exists
- Run `node build-scripts/process-csv.js`

### Timeline not showing
- Check `data/timeline.json` exists
- Run `node build-scripts/extract-timeline.js`

## Development

### File Overview

| File | Purpose | Size |
|------|---------|------|
| `index.html` | Main entry point | ~15KB |
| `css/main.css` | All styles (imported) | ~30KB |
| `js/app.js` | Main controller | ~3KB |
| `js/router.js` | Client-side routing | ~8KB |
| `js/search.js` | Full-text search | ~4KB |
| `js/evidence-matrix.js` | Evidence table | ~5KB |
| `js/timeline.js` | Timeline viewer | ~3KB |
| `js/i18n.js` | Bilingual support | ~5KB |
| `js/utils.js` | Helper functions | ~6KB |

### Code Style

- **ES6+** - Modern JavaScript
- **No semicolons** - Except where required
- **2-space indentation**
- **Descriptive variable names**
- **Comments for complex logic**

## License

**Public Domain for Community Use**

This web application is released for public benefit. You may:
- Distribute freely
- Modify for your needs
- Use in your own projects
- Host on your own domain

**No attribution required** (but appreciated!)

## Support

For issues or questions:
1. Check this README
2. Check browser console for errors
3. Verify all files are in place
4. Test in different browser

## Credits

Built for the Project Jupiter opposition movement by the community, for the community.

**Design System:** Inspired by elpasotexas.gov  
**Icons:** Unicode emoji (universal support)  
**Fonts:** System font stack (maximum performance)

---

**Last Updated:** January 22, 2026  
**Version:** 1.0.0
