# Docsify Deployment Guide

## 🎉 Your Docsify Site is Ready!

This project is now configured to use **Docsify** - a magical documentation site generator that reads your markdown files directly, with no build process required!

---

## ✅ What's Configured

- ✅ **index.html** - Docsify configuration with El Paso theme
- ✅ **custom.css** - Custom styling matching El Paso city colors
- ✅ **_sidebar.md** - Navigation sidebar
- ✅ **README.md** - Beautiful homepage
- ✅ **.nojekyll** - Required for GitHub Pages
- ✅ **All markdown files** - Ready to be displayed

---

## 🚀 Quick Deploy to GitHub Pages (5 minutes)

### Step 1: Test Locally (Optional)

```bash
# Install docsify-cli (one-time)
npm i docsify-cli -g

# Serve locally
docsify serve .

# Open: http://localhost:3000
```

**OR** use Python:

```bash
python3 -m http.server 3000

# Open: http://localhost:3000
```

### Step 2: Push to GitHub

```bash
# Initialize git (if not done)
git init

# Add all files
git add .

# Commit
git commit -m "Setup Docsify documentation site"

# Set main branch
git branch -M main

# Add remote (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/project-jupiter.git

# Push
git push -u origin main
```

### Step 3: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** → **Pages**
3. Under **Source**:
   - Branch: `main`
   - Folder: `/ (root)`
4. Click **Save**

### Step 4: Access Your Site

Wait 2-5 minutes, then visit:
```
https://YOUR_USERNAME.github.io/project-jupiter/
```

**Done! 🎉**

---

## 🎨 Features Included

### Built-in Plugins

✅ **Full-text search** - Search across all documents  
✅ **Pagination** - Previous/Next navigation  
✅ **Copy code** - Copy button on code blocks  
✅ **Zoom images** - Click to zoom images  
✅ **External links** - Open in new tab  

### Custom Styling

✅ **El Paso theme** - Navy #1d2754 + Orange #da532c  
✅ **Responsive design** - Works on mobile  
✅ **Print-friendly** - Clean print layouts  
✅ **Badges & alerts** - Visual highlights  

### Navigation

✅ **Sidebar** - Organized by category  
✅ **Search bar** - Find documents instantly  
✅ **Auto-linking** - Markdown links work automatically  
✅ **Sub-levels** - Up to 3 heading levels in TOC  

---

## 📁 File Structure

```
project-jupiter/
├── index.html          # Docsify configuration
├── custom.css          # El Paso theme styling
├── _sidebar.md         # Navigation sidebar
├── README.md           # Homepage
├── .nojekyll           # GitHub Pages requirement
├── *.md                # All your documents
└── *.csv               # Evidence matrix files
```

**That's it!** No build directory, no compiled files. Docsify reads markdown directly.

---

## ✏️ Editing Content

### Update Documents

1. **Edit any .md file** in the root directory
2. **Commit & push:**
   ```bash
   git add .
   git commit -m "Update document"
   git push
   ```
3. **Wait 1-2 minutes** for GitHub Pages to update
4. **Refresh browser** - Changes are live!

### Add New Document

1. **Create new .md file** in root directory
2. **Add to _sidebar.md:**
   ```markdown
   * [📄 New Document](new-document.md)
   ```
3. **Commit & push** as above

### Change Colors

Edit `custom.css`:
```css
:root {
  --primary-color: #YOUR_COLOR;
  --accent-color: #YOUR_COLOR;
}
```

### Modify Sidebar

Edit `_sidebar.md` - use markdown list format:
```markdown
* **Section Name**
  * [📄 Document Name](document.md)
  * [📊 Another Doc](another.md)
```

---

## 🎨 Docsify Features You Can Use

### Embedded Content

```markdown
<!-- Embed YouTube video -->
[视频](https://www.youtube.com/embed/dQw4w9WgXcQ ':include :type=iframe')

<!-- Embed code from file -->
[](code.js ':include :type=code')
```

### Alerts/Callouts

```markdown
!> **Warning:** Important notice here

?> **Tip:** Helpful information here
```

### Tabs

```markdown
<!-- tabs:start -->

#### **English**

Content in English

#### **Español**

Contenido en español

<!-- tabs:end -->
```

### Task Lists

```markdown
- [ ] Incomplete task
- [x] Completed task
```

---

## 🔧 Customization Options

### Change Theme

Edit `index.html`, replace theme link:

```html
<!-- Options: vue, buble, dark, pure -->
<link rel="stylesheet" href="//cdn.jsdelivr.net/npm/docsify@4/lib/themes/vue.css">
```

### Add Plugins

Edit `index.html`, add before closing `</body>`:

```html
<!-- Example: Add emoji plugin -->
<script src="//cdn.jsdelivr.net/npm/docsify/lib/plugins/emoji.min.js"></script>
```

**Available plugins**: https://docsify.js.org/#/plugins

### Configure Search

Edit `window.$docsify.search` in `index.html`:

```javascript
search: {
  maxAge: 86400000,        // Cache for 24 hours
  paths: 'auto',           // Search all pages
  placeholder: 'Search',
  depth: 6,                // Heading depth
  hideOtherSidebarContent: false
}
```

---

## 📊 Adding the Evidence Matrix

Since the evidence matrix is a CSV file, you have options:

### Option 1: Link to CSV

In any document:
```markdown
Download the [Evidence Matrix CSV](evidence_matrix.csv)
```

### Option 2: Convert to Markdown Table

Use a CSV-to-markdown converter, then paste into a .md file:
```markdown
| ID | Type | Date | Actor |
|----|------|------|-------|
| 1  | Vote | 2025-09-19 | Commissioner |
```

### Option 3: Embed as HTML

Create `evidence-matrix.md`:
```markdown
# Evidence Matrix

<div id="csv-table"></div>

<script>
// Fetch and display CSV
fetch('evidence_matrix.csv')
  .then(r => r.text())
  .then(csv => {
    // Parse and display
  });
</script>
```

---

## 🌐 Custom Domain (Optional)

### GitHub Pages

1. In repository Settings → Pages
2. Enter custom domain: `evidence.yoursite.org`
3. Add DNS record at your domain provider:
   ```
   Type: CNAME
   Name: evidence
   Value: YOUR_USERNAME.github.io
   ```

### Netlify

1. Drag project folder to Netlify
2. Go to Domain Settings
3. Add custom domain
4. Update DNS as instructed

---

## 🔍 SEO & Social Sharing

Add to `index.html` in `<head>`:

```html
<!-- SEO -->
<meta name="description" content="Project Jupiter Evidence Portal - Evidence-grade accountability documentation">
<meta name="keywords" content="Project Jupiter, accountability, evidence, New Mexico">

<!-- Open Graph (Facebook, LinkedIn) -->
<meta property="og:title" content="Project Jupiter Evidence Portal">
<meta property="og:description" content="Evidence-grade accountability system">
<meta property="og:type" content="website">
<meta property="og:url" content="https://YOUR_USERNAME.github.io/project-jupiter/">

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Project Jupiter Evidence Portal">
<meta name="twitter:description" content="Evidence-grade accountability system">
```

---

## 📱 Mobile-Friendly

Docsify is automatically mobile-responsive! Test on:
- iPhone/iPad (Safari)
- Android (Chrome)
- Tablets

The sidebar becomes a collapsible menu on mobile.

---

## 🖨️ Print Support

**To print a page:**
1. Click on the page you want to print
2. Press `Ctrl+P` (Windows) or `Cmd+P` (Mac)
3. The print layout removes sidebar and buttons automatically

**Print entire site:**
- Use browser's "Print to PDF" feature
- Navigate through pages and print each

---

## 📈 Analytics (Optional)

### Google Analytics

Add to `index.html` before closing `</head>`:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### Docsify Analytics Plugin

```html
<script>
  window.$docsify = {
    // ... existing config
    ga: 'GA_MEASUREMENT_ID',
  }
</script>
<script src="//cdn.jsdelivr.net/npm/docsify/lib/plugins/ga.min.js"></script>
```

---

## 🐛 Troubleshooting

### Site shows "404 Not Found"
- Check that `.nojekyll` file exists
- Verify GitHub Pages is enabled in Settings
- Wait 5-10 minutes after first deploy

### Sidebar not showing
- Check `_sidebar.md` exists in root
- Verify `loadSidebar: true` in index.html
- Check file paths are correct

### Search not working
- Search builds index on first load
- Refresh page after navigating
- Clear browser cache

### Styles not applying
- Check `custom.css` is in root directory
- Verify link in `index.html` is correct
- Hard refresh: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)

### Documents not found
- Check markdown files are in root directory
- Verify links in `_sidebar.md` match filenames exactly
- File names are case-sensitive on GitHub Pages

---

## ⚡ Performance Tips

1. **Keep images optimized** - Compress before adding
2. **Use CDN links** - Docsify plugins load from CDN
3. **Enable caching** - Automatic with GitHub Pages
4. **Minimize custom JS** - Keep it simple and fast

---

## 🎓 Learn More

- **Docsify Documentation**: https://docsify.js.org
- **GitHub Pages Docs**: https://docs.github.com/pages
- **Markdown Guide**: https://www.markdownguide.org

---

## ✅ Final Checklist

Before going live:

- [ ] Test locally (`docsify serve` or `python3 -m http.server`)
- [ ] All links work (click through sidebar)
- [ ] Search finds documents
- [ ] Mobile responsive (test on phone)
- [ ] Print layout looks good
- [ ] Custom CSS applied (El Paso colors)
- [ ] `.nojekyll` file present
- [ ] Ready to push to GitHub!

---

## 🎉 You're Done!

Your Docsify documentation site is fully configured and ready to deploy!

**Next Steps:**
1. Test locally
2. Push to GitHub
3. Enable GitHub Pages
4. Share the URL!

**Your site will be at:**
```
https://YOUR_USERNAME.github.io/project-jupiter/
```

**Questions?** Check the [Docsify documentation](https://docsify.js.org) or open an issue on GitHub.

---

**Built with ❤️ using Docsify** - The magical documentation site generator
