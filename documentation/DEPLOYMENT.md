# Deployment Guide

## GitHub Pages (Recommended)

### Step 1: Initialize Git Repository

```bash
cd project-jupiter

# Initialize git if not already done
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: Project Jupiter Evidence Portal"

# Set main as default branch
git branch -M main
```

### Step 2: Create GitHub Repository

1. Go to https://github.com/new
2. Repository name: `project-jupiter` (or your choice)
3. Description: "Project Jupiter Evidence Portal - Community Accountability Documentation"
4. Public repository (for GitHub Pages)
5. Do NOT initialize with README (you already have one)
6. Click "Create repository"

### Step 3: Push to GitHub

```bash
# Add remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/project-jupiter.git

# Push to GitHub
git push -u origin main
```

### Step 4: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click "Settings" (top right)
3. Scroll down to "Pages" (left sidebar)
4. Under "Source":
   - Branch: `main`
   - Folder: `/ (root)`
5. Click "Save"

### Step 5: Access Your Site

Your site will be available at:
```
https://YOUR_USERNAME.github.io/project-jupiter/
```

⏱️ **Note:** It may take 2-5 minutes for your site to be published

### Step 6: Custom Domain (Optional)

If you have a custom domain:

1. In repository Settings → Pages:
   - Enter your custom domain (e.g., `evidence.yoursite.org`)
   - Check "Enforce HTTPS"

2. Add DNS records at your domain provider:
   ```
   Type: CNAME
   Name: evidence (or www)
   Value: YOUR_USERNAME.github.io
   ```

3. Wait for DNS propagation (5-60 minutes)

## Alternative Hosting Options

### Netlify

1. **Via GitHub:**
   - Go to https://netlify.com
   - "New site from Git"
   - Connect GitHub
   - Select `project-jupiter` repository
   - Build settings: Leave empty (static site)
   - Deploy!

2. **Via Drag & Drop:**
   - Go to https://netlify.com
   - Drag the `project-jupiter` folder onto the deployment zone
   - Done!

**URL:** https://YOUR-SITE-NAME.netlify.app

### Vercel

1. Go to https://vercel.com
2. "New Project"
3. Import from GitHub
4. Select `project-jupiter` repository
5. No build configuration needed
6. Deploy!

**URL:** https://project-jupiter.vercel.app

### AWS S3 + CloudFront

1. **Create S3 Bucket:**
   ```bash
   aws s3 mb s3://project-jupiter-evidence
   aws s3 website s3://project-jupiter-evidence/ --index-document index.html
   ```

2. **Upload Files:**
   ```bash
   aws s3 sync . s3://project-jupiter-evidence/ --exclude ".git/*"
   ```

3. **Set Permissions:**
   - Bucket Policy: Allow public read access
   - Static Website Hosting: Enable

4. **Optional - CloudFront:**
   - Create distribution
   - Origin: Your S3 bucket
   - Enable HTTPS
   - Custom domain (optional)

### DigitalOcean App Platform

1. Go to https://cloud.digitalocean.com
2. "Create" → "Apps"
3. Connect GitHub repository
4. Detect as "Static Site"
5. Deploy!

## Post-Deployment Checklist

- [ ] Site loads correctly
- [ ] All documents accessible
- [ ] Evidence matrix works
- [ ] Timeline displays
- [ ] Search functions
- [ ] Mobile responsive
- [ ] Both languages work
- [ ] Print layout correct
- [ ] Share buttons copy URLs
- [ ] All navigation links work

## Updating the Site

### Method 1: Git Push (GitHub Pages)

```bash
# Make your changes
# ... edit files ...

# Commit changes
git add .
git commit -m "Update: description of changes"

# Push to GitHub
git push

# Site will update automatically in 2-5 minutes
```

### Method 2: Rebuild Data Only

If you only updated documents or data:

```bash
# Update markdown
node build-scripts/convert-markdown.js

# Update evidence matrix
node build-scripts/process-csv.js

# Update timeline
node build-scripts/extract-timeline.js

# Update document index
node build-scripts/create-document-index.js

# Commit and push
git add .
git commit -m "Update: data files"
git push
```

### Method 3: Direct Upload (Other Hosts)

For Netlify drag-and-drop or FTP hosts:
1. Make your changes locally
2. Test locally: `python3 -m http.server 8000`
3. Re-upload entire folder

## Monitoring & Analytics

### Google Analytics (Optional)

Add before `</head>` in `index.html`:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=YOUR_GA_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'YOUR_GA_ID');
</script>
```

### Privacy-Respecting Alternatives

- **Plausible:** https://plausible.io
- **Fathom:** https://usefathom.com
- **Simple Analytics:** https://simpleanalytics.com

## Security Considerations

✅ **What's Safe:**
- All files are static (HTML/CSS/JS)
- No server-side code
- No database
- No user accounts
- No forms submission

⚠️ **Recommendations:**
- Enable HTTPS (automatic on GitHub Pages)
- No sensitive data in repository
- Review evidence_matrix.csv for PII before publishing
- Consider password protection for staging site

## Performance Optimization

### Enable Compression (if supported by host)

GitHub Pages: Automatic  
Netlify: Automatic  
Vercel: Automatic  
AWS S3: Configure in CloudFront

### Enable Caching

Add `.htaccess` (Apache) or equivalent:

```apache
# Cache static files for 1 year
<FilesMatch "\.(css|js|json|svg|png|jpg|jpeg)$">
  Header set Cache-Control "max-age=31536000, public"
</FilesMatch>

# Cache HTML for 1 hour
<FilesMatch "\.(html)$">
  Header set Cache-Control "max-age=3600, public, must-revalidate"
</FilesMatch>
```

### Minify (Optional)

For production, you can minify:

```bash
# Install minifier (optional)
npm install -g minify

# Minify CSS
minify css/main.css > css/main.min.css

# Minify JS
minify js/app.js > js/app.min.js

# Update index.html to use .min versions
```

## Backup

### Automatic (GitHub)
Your repository IS your backup!

### Manual
```bash
# Download entire repository
git clone https://github.com/YOUR_USERNAME/project-jupiter.git project-jupiter-backup

# Or download ZIP from GitHub
# Repository page → Code → Download ZIP
```

## Rollback

If something breaks:

```bash
# View commit history
git log

# Rollback to previous commit
git revert HEAD

# Or hard reset (careful!)
git reset --hard COMMIT_HASH

# Push changes
git push
```

## Support Resources

- **GitHub Pages Docs:** https://docs.github.com/pages
- **Netlify Docs:** https://docs.netlify.com
- **Vercel Docs:** https://vercel.com/docs
- **MDN Web Docs:** https://developer.mozilla.org

## Troubleshooting

### Site not loading on GitHub Pages

1. Check repository Settings → Pages shows "Your site is published at..."
2. Verify `index.html` is in root directory
3. Wait 5-10 minutes after first push
4. Check Actions tab for build errors

### 404 errors on navigation

- This is normal! Single-page apps use hash routing (#/)
- URLs should look like: `https://yoursite.com/#/evidence-matrix`
- If you want clean URLs, you'll need server-side routing (not covered here)

### Styles not loading

1. Check browser console for errors
2. Verify all CSS files exist in `css/` folder
3. Check `css/main.css` has `@import` statements
4. Clear browser cache

### Images/Files not found

1. Verify paths are relative, not absolute
2. Case-sensitive on Linux servers (GitHub Pages)
3. Check file actually exists in repository

---

**Questions?** Check WEB_APP_README.md or open an issue on GitHub.
