# 📰 Digg-Sidekick

A browser extension for Digg.com that filters stories by keywords, authors, and flairs to customize your Digg experience.

## ✨ Features

- **Keyword Filtering** - Hide stories containing specific words
- **Author Filtering** - Block content from specific authors
- **Flair/Tag Filtering** - Filter by categories or tags
- **Quick Add** - Right-click to add selected text as a filter
- **Import/Export** - Backup and restore your filters
- **Real-time Updates** - Filters apply as new content loads
- **Keyboard Shortcuts** - Toggle filtering with Ctrl+Shift+F

## 📦 Project Structure

```
Digg-Sidekick/
├── manifest.json
├── popup/
│   ├── popup.html
│   ├── popup.js
│   └── popup.css
├── content/
│   ├── content.js
│   ├── filter-engine.js
│   └── styles.css
├── background/
│   └── background.js
├── options/
│   ├── options.html
│   ├── options.js
│   └── options.css
└── icons/
    ├── icon16.png
    ├── icon48.png
    └── icon128.png
```

## 🚀 Installation

### Development / Local Install

1. Clone or download this repository
2. Open Chrome/Edge and navigate to `chrome://extensions/`
3. Enable **Developer mode** (toggle in top-right)
4. Click **"Load unpacked"**
5. Select the `Digg-Sidekick` folder

### Creating Icons

Before loading, create icon files (16x16, 48x48, 128x128 PNG):
```
cd icons && for size in 16 48 128; do rsvg-convert -w $size -h $size icon.svg -o icon${size}.png; done && ls -la
```

## 🎯 Usage

1. Navigate to [digg.com](https://digg.com)
2. Click the extension icon in your browser toolbar
3. Add filters:
   - **Keywords**: Words to filter from titles/content
   - **Authors**: Usernames to hide
   - **Flairs**: Categories or tags to filter
4. Choose filter action:
   - **Hide**: Remove matching stories
   - **Highlight**: Emphasize matching stories
   - **Show Only**: Whitelist mode

### Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+Shift+F` | Toggle filtering on/off |

### Quick Add

1. Select text on Digg.com
2. Right-click → "Add to Digg Filter"
3. Filter is automatically added

## ⚙️ Options

Access advanced settings via the Options page:
- **Import/Export**: Backup filters as JSON
- **Auto-apply**: Enable filters on page load
- **Show count badge**: Display hidden story count
- **Highlight matches**: Visual indicators for filtered content

## 📤 Publishing

### Chrome Web Store

1. Create zip (from inside the project folder): 
   ```
   zip -r ../digg-sidekick.zip . -x "*.DS_Store" -x "*.git*" -x "*.txt" -x "prompts/*" -x "*.md"
   ```
2. Go to [Chrome Developer Dashboard](https://chrome.google.com/webstore/devconsole/)
3. Pay $5 one-time fee
4. Upload zip with screenshots and description
5. Submit for review (1-3 days)

### Firefox Add-ons

1. Same code works (Manifest V3 compatible)
2. Go to [Firefox Developer Hub](https://addons.mozilla.org/developers/)
3. Upload zip (no fee required)
4. Review typically < 24 hours

## 🐛 Debugging

- Open DevTools (F12) → Console for filter logs
- `chrome://extensions/` → "Inspect views: service worker"
- Access `window.diggFilter` in console for direct debugging

## 🔮 Future Enhancements

- [ ] Regex support in filters
- [ ] Scheduled filters (time-based)
- [ ] Cloud sync (Dropbox, Google Drive)
- [ ] Filter analytics
- [ ] Community filter lists
- [ ] Mobile browser support


## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

**Digg-Sidekick** - Made with ❤️ for a better Digg experience
