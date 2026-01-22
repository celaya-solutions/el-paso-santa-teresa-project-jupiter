# Quick Start Guide

##  Get Your Site Running in 5 Minutes

### Step 1: Test Locally (1 minute)

```bash
# Open terminal in project-jupiter folder
cd /Users/chriscelaya/Documents/project-jupiter

# Start a local server
python3 -m http.server 8000

# Open in browser: http://localhost:8000
```

 **If it works:** You'll see the home page with featured documents  
 **If it doesn't:** Check browser console (F12) for errors

---

### Step 2: Deploy to GitHub Pages (4 minutes)

#### A. Create GitHub Repo

```bash
# Initialize git (if not done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: Project Jupiter Evidence Portal"

# Set main branch
git branch -M main
```

#### B. Push to GitHub

1. Go to https://github.com/new
2. Create repository named: `project-jupiter`
3. Copy the commands shown, OR use these:

```bash
# Add remote (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/project-jupiter.git

# Push
git push -u origin main
```

#### C. Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** → **Pages** (left sidebar)
3. Under **Source:**
   - Branch: `main`
   - Folder: `/ (root)`
4. Click **Save**

#### D. Access Your Site

Wait 2-5 minutes, then visit:
```
https://YOUR_USERNAME.github.io/project-jupiter/
```

**Done! ** Your site is now live!

---

##  Verify Everything Works

Test these features:

### Navigation
- [ ] Click sidebar links
- [ ] Click header search box
- [ ] Toggle language (EN/ES button)

### Pages
- [ ] Home page shows stats
- [ ] Click "Consolidated Public Report"
- [ ] Click "Evidence Matrix"
- [ ] Click "Timeline"

### Features
- [ ] Search for "water" in header
- [ ] Filter evidence matrix
- [ ] Click print button
- [ ] Test on mobile

---

## ️ Common Issues

### "Failed to fetch"
- **Cause:** Trying to open index.html directly
- **Fix:** Use local server (python3 -m http.server 8000)

### Documents not loading
- **Cause:** Missing HTML files
- **Fix:** Run: `node build-scripts/convert-markdown.js`

### CSS not applying
- **Cause:** Browser cache
- **Fix:** Hard refresh (Cmd+Shift+R on Mac, Ctrl+Shift+R on Windows)

### Mobile menu not working
- **Cause:** JavaScript error
- **Fix:** Check console (F12), look for red errors

---

##  Make Your First Update

### Update a Document

1. Edit file in `docs/markdown/`
2. Run: `node build-scripts/convert-markdown.js`
3. Commit: `git add . && git commit -m "Update document"`
4. Push: `git push`
5. Wait 2-5 minutes for GitHub Pages to rebuild

### Change Colors

1. Open `css/variables.css`
2. Change:
   ```css
   --color-primary: #1d2754;  /* Your color here */
   --color-accent: #da532c;   /* Your color here */
   ```
3. Save and refresh browser

### Add Spanish Translation

1. Open `data/translations-es.json`
2. Edit the text values
3. Save and refresh browser
4. Toggle to Spanish (ES button)

---

##  Next Steps

### Recommended Order

1.  **Test locally** (you're here!)
2.  **Deploy to GitHub Pages** (above)
3. ⏭️ **Review all documents** - Click through each one
4. ⏭️ **Test on mobile** - Open on your phone
5. ⏭️ **Share with team** - Send them the URL
6. ⏭️ **Customize** - Update colors, add logo, etc.
7. ⏭️ **Monitor** - Check for feedback

### Optional Enhancements

- Add custom domain (see DEPLOYMENT.md)
- Add Google Analytics (see DEPLOYMENT.md)
- Translate more content to Spanish
- Add custom favicon
- Add images/graphics

---

##  Learn More

- **Full documentation:** WEB_APP_README.md
- **Deployment guide:** DEPLOYMENT.md
- **Build details:** BUILD_SUMMARY.md

---

##  Need Help?

1. Check browser console (F12)
2. Read error messages
3. Check file paths
4. Try different browser
5. Read documentation files

---

**You're all set! **

Your Project Jupiter Evidence Portal is ready to serve your community.

**Site URL:** `https://YOUR_USERNAME.github.io/project-jupiter/`

---

**Pro Tip:** Bookmark your site and test all features before sharing widely. Make sure everything works as expected on desktop and mobile.

**Good luck! **
