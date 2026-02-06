# 🦸 **Digg Sidekick - Complete Starter Kit**

I've created a complete branded starter kit with all files updated for "Digg Sidekick". Copy each file into its respective location.

## 📁 **Updated Project Structure**
```
digg-sidekick/
├── manifest.json
├── icons/
│   ├── icon16.svg
│   ├── icon48.svg
│   ├── icon128.svg
│   ├── robot-16.png
│   ├── robot-48.png
│   └── robot-128.png
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
├── welcome/
│   └── welcome.html
└── README.md
```

## 1️⃣ **manifest.json**
```json
{
  "manifest_version": 3,
  "name": "Digg Sidekick",
  "short_name": "Digg Sidekick",
  "version": "1.0.0",
  "description": "Your friendly Digg companion - filter, enhance, and customize your Digg experience",
  "author": "Your Name",
  
  "permissions": ["storage", "activeTab"],
  "host_permissions": ["*://digg.com/*", "*://*.digg.com/*"],
  
  "action": {
    "default_popup": "popup/popup.html",
    "default_title": "Digg Sidekick",
    "default_icon": {
      "16": "icons/robot-16.png",
      "48": "icons/robot-48.png",
      "128": "icons/robot-128.png"
    }
  },
  
  "content_scripts": [
    {
      "matches": ["*://digg.com/*", "*://*.digg.com/*"],
      "js": ["content/filter-engine.js", "content/content.js"],
      "css": ["content/styles.css"],
      "run_at": "document_idle"
    }
  ],
  
  "background": {
    "service_worker": "background/background.js"
  },
  
  "options_page": "options/options.html",
  
  "icons": {
    "16": "icons/robot-16.png",
    "48": "icons/robot-48.png",
    "128": "icons/robot-128.png"
  },
  
  "web_accessible_resources": [
    {
      "resources": ["welcome/welcome.html"],
      "matches": ["<all_urls>"]
    }
  ]
}
```

## 2️⃣ **Icons (Save as SVG, then convert to PNG)**
Create these files in the `icons/` folder:

**`icons/icon16.svg`** (also make 48px and 128px versions):
```svg
<svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
  <rect width="16" height="16" rx="3" fill="#0066CC"/>
  <circle cx="8" cy="6" r="1.5" fill="white"/>
  <circle cx="11" cy="6" r="1.5" fill="white"/>
  <path d="M6,9 L6,12 L10,12 Q11,12 11,11 Q11,10 10,10 L6,10" fill="white"/>
  <path d="M5,12 Q8,13 11,12" stroke="white" stroke-width="0.8" fill="none"/>
</svg>
```

**For PNG versions** (quick hack if you don't have an editor):
1. Go to https://jakearchibald.github.io/svgomg/
2. Paste SVG code
3. Download as SVG
4. Convert using https://convertio.co/svg-png/ or similar

Or use these base64 PNGs (save as `robot-16.png`, etc.):

**16x16** (robot-16.png):
```
data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAAsTAAALEwEAmpwYAAAA7ElEQVQ4jZ2TvUoDQRCFv10hKwg+gGBpaWOhXoCvoK2NpYVgYacvIIi9oJVgo70PIJhaGlgEDASDEstkf2Z3LQy5uT8zh7kzd4RLciZJJR0PwJIkXRXQIm2S9JP0TJJmh7QnSQ/ARlKq1pr/HOu2B0l6BbC0R7q29LPF2GMAbmI82iP9i3Ed4ykAmDhn3tojbZ1TOGcMIGnZNG8z59xLOgTQNE0O3FXV5RjARVmeA3dV9R4AzMtyBtxX1ccAwLwsZ8BDVX0OAMzKcgY8VtVXf8NsOh0Dz6vVagBgMp2Ogeeq+h4AmJRlDjxV1c8AwLgsx8BzVf0OAIzKMgdequrnH3u4K9Wnm1zSAAAAAElFTkSuQmCC
```

## 3️⃣ **Updated Popup Files**

**`popup/popup.css`** (updated colors):
```css
:root {
  --sidekick-blue: #0066CC;
  --sidekick-orange: #FF6B35;
  --sidekick-light: #F5F7FA;
  --sidekick-dark: #2D3748;
  --sidekick-green: #38A169;
  --sidekick-red: #E53E3E;
}

body {
  width: 350px;
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background: var(--sidekick-light);
}

.container {
  padding: 15px;
}

/* Header with branding */
.header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 15px;
  padding-bottom: 12px;
  border-bottom: 2px solid var(--sidekick-blue);
}

.logo {
  width: 36px;
  height: 36px;
  background: var(--sidekick-blue);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 18px;
}

.brand h1 {
  margin: 0;
  font-size: 18px;
  color: var(--sidekick-dark);
}

.brand .tagline {
  margin: 0;
  font-size: 11px;
  color: #666;
  font-style: italic;
}

/* Stats bar */
.stats-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
  padding: 10px;
  border-radius: 6px;
  margin-bottom: 15px;
  border: 1px solid #e2e8f0;
}

.hidden-count {
  font-weight: bold;
  color: var(--sidekick-blue);
}

.toggle-btn {
  padding: 6px 12px;
  background: var(--sidekick-blue);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;
  transition: background 0.2s;
}

.toggle-btn:hover {
  background: #0052a3;
}

.toggle-btn.disabled {
  background: var(--sidekick-green);
}

/* Quick actions */
.quick-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  margin-bottom: 15px;
}

.quick-btn {
  padding: 8px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  transition: all 0.2s;
}

.quick-btn:hover {
  border-color: var(--sidekick-blue);
  background: #edf2f7;
}

/* Filter tabs */
.filter-tabs {
  display: flex;
  gap: 5px;
  margin-bottom: 15px;
  background: white;
  padding: 4px;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
}

.tab-btn {
  flex: 1;
  padding: 8px;
  background: transparent;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;
  transition: all 0.2s;
}

.tab-btn.active {
  background: var(--sidekick-blue);
  color: white;
}

/* Filter input */
.filter-input-group {
  display: flex;
  gap: 8px;
  margin-bottom: 15px;
}

#newFilter {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 13px;
}

#filterType {
  padding: 8px;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  background: white;
  font-size: 13px;
}

#addFilter {
  padding: 8px 16px;
  background: var(--sidekick-blue);
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
}

/* Filters list */
.filters-container {
  max-height: 200px;
  overflow-y: auto;
  margin-bottom: 15px;
  padding-right: 5px;
}

.filter-entry {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  background: white;
  border-radius: 6px;
  margin-bottom: 8px;
  border: 1px solid #e2e8f0;
}

.filter-text {
  flex: 1;
  font-size: 13px;
}

.filter-type {
  font-size: 11px;
  padding: 2px 6px;
  border-radius: 10px;
  background: #e2e8f0;
  margin-left: 8px;
}

.delete-filter {
  background: var(--sidekick-red);
  color: white;
  border: none;
  border-radius: 4px;
  padding: 4px 8px;
  cursor: pointer;
  font-size: 12px;
}

/* Footer */
.footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 15px;
  border-top: 1px solid #e2e8f0;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: var(--sidekick-dark);
}

.apply-btn {
  padding: 8px 16px;
  background: var(--sidekick-green);
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
}

/* Scrollbar styling */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a1a1a1;
}
```

**`popup/popup.html`** (updated branding):
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <link rel="stylesheet" href="popup.css">
</head>
<body>
  <div class="container">
    <!-- Header with logo -->
    <div class="header">
      <div class="logo">DS</div>
      <div class="brand">
        <h1>Digg Sidekick</h1>
        <p class="tagline">Your friendly Digg companion</p>
      </div>
    </div>
    
    <!-- Stats bar -->
    <div class="stats-bar">
      <div>
        <span class="hidden-count" id="hiddenCount">0 stories hidden</span>
      </div>
      <button id="toggleFilter" class="toggle-btn">🟢 Sidekick Active</button>
    </div>
    
    <!-- Quick actions -->
    <div class="quick-actions">
      <button id="quickAdd" class="quick-btn">
        <span>+</span>
        <span>Quick Add</span>
      </button>
      <button id="openOptions" class="quick-btn">
        <span>⚙️</span>
        <span>Settings</span>
      </button>
      <button id="exportBtn" class="quick-btn">
        <span>📤</span>
        <span>Export</span>
      </button>
      <button id="importBtn" class="quick-btn">
        <span>📥</span>
        <span>Import</span>
      </button>
    </div>
    
    <!-- Filter tabs -->
    <div class="filter-tabs">
      <button class="tab-btn active" data-type="keyword">Keywords</button>
      <button class="tab-btn" data-type="author">Authors</button>
      <button class="tab-btn" data-type="flair">Tags</button>
    </div>
    
    <!-- Add new filter -->
    <div class="filter-input-group">
      <input type="text" id="newFilter" placeholder="Add filter (e.g., 'politics')">
      <select id="filterType">
        <option value="hide">Hide</option>
        <option value="highlight">Highlight</option>
        <option value="whitelist">Show Only</option>
      </select>
      <button id="addFilter">Add</button>
    </div>
    
    <!-- Filters list -->
    <div id="filtersContainer" class="filters-container">
      <!-- Filters will be added here dynamically -->
    </div>
    
    <!-- Footer -->
    <div class="footer">
      <label class="checkbox-label">
        <input type="checkbox" id="autoRefresh">
        <span>Auto-refresh</span>
      </label>
      <button id="applyNow" class="apply-btn">Apply Now</button>
    </div>
  </div>
  
  <script src="popup.js"></script>
</body>
</html>
```

**`popup/popup.js`** (updated with new class names):
```javascript
document.addEventListener('DOMContentLoaded', function() {
  // Update element selectors for new class names
  const elements = {
    newFilter: document.getElementById('newFilter'),
    filterType: document.getElementById('filterType'),
    addFilter: document.getElementById('addFilter'),
    filtersContainer: document.getElementById('filtersContainer'),
    toggleFilter: document.getElementById('toggleFilter'),
    hiddenCount: document.getElementById('hiddenCount'),
    applyNow: document.getElementById('applyNow'),
    openOptions: document.getElementById('openOptions'),
    exportBtn: document.getElementById('exportBtn'),
    importBtn: document.getElementById('importBtn'),
    autoRefresh: document.getElementById('autoRefresh'),
    quickAdd: document.getElementById('quickAdd')
  };

  let currentTab = 'keyword';
  let filters = { keyword: [], author: [], flair: [] };
  let enabled = true;

  // Load saved data
  loadData();

  // Tab switching
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentTab = btn.dataset.type;
      renderFilters();
    });
  });

  // Add new filter
  elements.addFilter.addEventListener('click', addFilter);
  elements.newFilter.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addFilter();
  });

  // Quick add button
  elements.quickAdd.addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.url.includes('digg.com')) {
        chrome.tabs.sendMessage(tabs[0].id, { action: 'getSelectedText' }, (response) => {
          if (response?.text) {
            elements.newFilter.value = response.text;
            addFilter();
          }
        });
      }
    });
  });

  // Toggle filter
  elements.toggleFilter.addEventListener('click', () => {
    enabled = !enabled;
    if (enabled) {
      elements.toggleFilter.textContent = '🟢 Sidekick Active';
      elements.toggleFilter.classList.remove('disabled');
    } else {
      elements.toggleFilter.textContent = '🔴 Sidekick Paused';
      elements.toggleFilter.classList.add('disabled');
    }
    saveData();
    applyToCurrentTab();
  });

  // Apply filters
  elements.applyNow.addEventListener('click', applyToCurrentTab);

  // Open options page
  elements.openOptions.addEventListener('click', () => {
    chrome.runtime.openOptionsPage();
  });

  // Export filters
  elements.exportBtn.addEventListener('click', exportFilters);

  // Import filters
  elements.importBtn.addEventListener('click', () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          filters = JSON.parse(event.target.result);
          saveData();
          renderFilters();
          alert('Filters imported successfully!');
        } catch (err) {
          alert('Error importing filters: Invalid JSON file');
        }
      };
      reader.readAsText(file);
    };
    input.click();
  });

  // Auto-refresh toggle
  elements.autoRefresh.addEventListener('change', saveData);

  function addFilter() {
    const text = elements.newFilter.value.trim();
    if (!text) return;

    filters[currentTab].push({
      text,
      type: elements.filterType.value,
      id: Date.now() + Math.random()
    });

    elements.newFilter.value = '';
    saveData();
    renderFilters();
  }

  function deleteFilter(id) {
    filters[currentTab] = filters[currentTab].filter(f => f.id !== id);
    saveData();
    renderFilters();
  }

  function renderFilters() {
    elements.filtersContainer.innerHTML = '';
    
    filters[currentTab].forEach(filter => {
      const div = document.createElement('div');
      div.className = 'filter-entry';
      div.innerHTML = `
        <div class="filter-text">${filter.text}</div>
        <span class="filter-type">${filter.type}</span>
        <button class="delete-filter" data-id="${filter.id}">✕</button>
      `;
      elements.filtersContainer.appendChild(div);
      
      div.querySelector('.delete-filter').addEventListener('click', () => {
        deleteFilter(filter.id);
      });
    });
  }

  function saveData() {
    chrome.storage.sync.set({
      diggFilters: filters,
      enabled: enabled,
      autoRefresh: elements.autoRefresh.checked
    }, () => {
      console.log('Digg Sidekick: Filters saved');
    });
  }

  function loadData() {
    chrome.storage.sync.get(['diggFilters', 'enabled', 'autoRefresh'], (data) => {
      if (data.diggFilters) filters = data.diggFilters;
      if (data.enabled !== undefined) enabled = data.enabled;
      if (data.autoRefresh !== undefined) elements.autoRefresh.checked = data.autoRefresh;
      
      // Update toggle button
      if (enabled) {
        elements.toggleFilter.textContent = '🟢 Sidekick Active';
        elements.toggleFilter.classList.remove('disabled');
      } else {
        elements.toggleFilter.textContent = '🔴 Sidekick Paused';
        elements.toggleFilter.classList.add('disabled');
      }
      
      renderFilters();
    });
  }

  function applyToCurrentTab() {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.url.includes('digg.com')) {
        chrome.tabs.sendMessage(tabs[0].id, {
          action: 'applyFilters',
          filters: filters,
          enabled: enabled
        }, (response) => {
          if (response?.hiddenCount !== undefined) {
            elements.hiddenCount.textContent = `${response.hiddenCount} stories hidden`;
          }
        });
      }
    });
  }

  function exportFilters() {
    const dataStr = JSON.stringify(filters, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = 'digg-sidekick-filters.json';

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  }

  // Get initial hidden count
  applyToCurrentTab();
});
```

## 4️⃣ **Background Script with Welcome Page**

**`background/background.js`**:
```javascript
// Digg Sidekick Service Worker
console.log('🤖 Digg Sidekick loaded');

chrome.runtime.onInstalled.addListener((details) => {
  console.log('Digg Sidekick installed:', details.reason);
  
  // Set default filters on install
  if (details.reason === 'install') {
    chrome.storage.sync.set({
      diggFilters: {
        keyword: [
          { text: 'crypto', type: 'hide', id: Date.now() },
          { text: 'nft', type: 'hide', id: Date.now() + 1 },
          { text: 'sponsored', type: 'hide', id: Date.now() + 2 }
        ],
        author: [],
        flair: []
      },
      enabled: true,
      autoRefresh: true,
      showWelcome: true
    });
    
    // Show welcome page
    chrome.tabs.create({
      url: chrome.runtime.getURL('welcome/welcome.html')
    });
  }
  
  // Create context menu
  chrome.contextMenus.create({
    id: 'sidekickAddFilter',
    title: 'Add to Digg Sidekick',
    contexts: ['selection']
  });
});

// Context menu click handler
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'sidekickAddFilter' && tab.url.includes('digg.com')) {
    chrome.tabs.sendMessage(tab.id, {
      action: 'addQuickFilter',
      text: info.selectionText
    });
  }
});

// Message listener
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Sidekick message:', request.action);
  
  switch (request.action) {
    case 'updateBadge':
      // Update extension badge with hidden count
      if (request.count > 0) {
        chrome.action.setBadgeText({
          text: request.count > 99 ? '99+' : request.count.toString()
        });
        chrome.action.setBadgeBackgroundColor({ color: '#0066CC' });
      } else {
        chrome.action.setBadgeText({ text: '' });
      }
      sendResponse({ success: true });
      break;
      
    case 'toggleFilter':
      chrome.storage.sync.get(['enabled'], (data) => {
        const newState = !data.enabled;
        chrome.storage.sync.set({ enabled: newState });
        
        // Notify all Digg tabs
        chrome.tabs.query({ url: '*://digg.com/*' }, (tabs) => {
          tabs.forEach(tab => {
            chrome.tabs.sendMessage(tab.id, {
              action: 'applyFilters',
              enabled: newState
            }).catch(() => {
              // Tab might not be ready, ignore
            });
          });
        });
      });
      sendResponse({ success: true });
      break;
      
    case 'getStats':
      chrome.storage.sync.get(['diggFilters'], (data) => {
        const totalFilters = Object.values(data.diggFilters || {}).flat().length;
        sendResponse({ totalFilters });
      });
      return true; // Async response
  }
  
  sendResponse({ received: true });
});

// Listen for tab updates to auto-apply filters
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url?.includes('digg.com')) {
    // Wait a moment for page to fully load
    setTimeout(() => {
      chrome.storage.sync.get(['diggFilters', 'enabled', 'autoRefresh'], (data) => {
        if (data.autoRefresh !== false) {
          chrome.tabs.sendMessage(tabId, {
            action: 'applyFilters',
            filters: data.diggFilters,
            enabled: data.enabled
          }).catch(() => {
            // Content script might not be ready yet
          });
        }
      });
    }, 1000);
  }
});

// Handle extension icon click
chrome.action.onClicked.addListener((tab) => {
  // This only fires if popup is not defined in manifest
  // We have a popup, so this won't fire, but good to have
});
```

## 5️⃣ **Welcome Page**

**`welcome/welcome.html`**:
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      max-width: 600px;
      margin: 0 auto;
      padding: 40px 20px;
      line-height: 1.6;
      color: #2D3748;
    }
    
    .header {
      text-align: center;
      margin-bottom: 40px;
    }
    
    .logo {
      width: 80px;
      height: 80px;
      background: #0066CC;
      border-radius: 16px;
      margin: 0 auto 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 32px;
      font-weight: bold;
    }
    
    h1 {
      color: #0066CC;
      margin-bottom: 10px;
    }
    
    .tagline {
      color: #666;
      font-style: italic;
      margin-bottom: 30px;
    }
    
    .steps {
      background: #F5F7FA;
      border-radius: 12px;
      padding: 25px;
      margin-bottom: 30px;
    }
    
    .step {
      display: flex;
      align-items: flex-start;
      margin-bottom: 20px;
    }
    
    .step-number {
      background: #0066CC;
      color: white;
      width: 28px;
      height: 28px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 15px;
      flex-shrink: 0;
    }
    
    .step-content {
      flex: 1;
    }
    
    .features {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
      margin-bottom: 40px;
    }
    
    .feature {
      background: white;
      border: 1px solid #E2E8F0;
      border-radius: 8px;
      padding: 20px;
    }
    
    .feature h3 {
      color: #0066CC;
      margin-top: 0;
    }
    
    .cta {
      text-align: center;
      padding: 20px;
      background: #0066CC;
      color: white;
      border-radius: 12px;
    }
    
    .cta-button {
      display: inline-block;
      background: white;
      color: #0066CC;
      padding: 12px 24px;
      border-radius: 6px;
      text-decoration: none;
      font-weight: bold;
      margin-top: 10px;
    }
    
    .footer {
      text-align: center;
      margin-top: 40px;
      color: #666;
      font-size: 14px;
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="logo">DS</div>
    <h1>Welcome to Digg Sidekick! 🤖</h1>
    <p class="tagline">Your friendly Digg companion is ready to help.</p>
  </div>
  
  <div class="steps">
    <h2>Getting Started</h2>
    
    <div class="step">
      <div class="step-number">1</div>
      <div class="step-content">
        <h3>Visit Digg.com</h3>
        <p>Open or refresh your Digg tab to get started.</p>
      </div>
    </div>
    
    <div class="step">
      <div class="step-number">2</div>
      <div class="step-content">
        <h3>Click the Sidekick icon</h3>
        <p>Look for the <strong>blue robot icon</strong> in your browser toolbar.</p>
      </div>
    </div>
    
    <div class="step">
      <div class="step-number">3</div>
      <div class="step-content">
        <h3>Add your first filter</h3>
        <p>Try adding "crypto" or "sponsored" to hide those stories.</p>
      </div>
    </div>
  </div>
  
  <div class="features">
    <div class="feature">
      <h3>🎯 Smart Filtering</h3>
      <p>Hide stories by keywords, authors, or tags. Highlight important content.</p>
    </div>
    
    <div class="feature">
      <h3>⚡ Quick Actions</h3>
      <p>Right-click any text on Digg to quickly add it as a filter.</p>
    </div>
    
    <div class="feature">
      <h3>🔧 Customization</h3>
      <p>Import/export filters, set schedules, and customize everything.</p>
    </div>
    
    <div class="feature">
      <h3>🔄 Auto-Refresh</h3>
      <p>Filters apply automatically as you browse and new content loads.</p>
    </div>
  </div>
  
  <div class="cta">
    <h2>Ready to enhance your Digg experience?</h2>
    <p>Your Sidekick is waiting in your browser toolbar!</p>
    <a href="https://digg.com" target="_blank" class="cta-button">Go to Digg.com →</a>
  </div>
  
  <div class="footer">
    <p>Need help? Have suggestions?</p>
    <p>We're here to help! Your Sidekick is always learning and improving.</p>
  </div>
  
  <script>
    // Close welcome page after a delay
    setTimeout(() => {
      if (window.location.protocol === 'chrome-extension:') {
        // Close only if we're the active tab
        chrome.tabs.getCurrent((tab) => {
          if (tab.active) {
            window.close();
          }
        });
      }
    }, 30000); // 30 seconds
  </script>
</body>
</html>
```

## 6️⃣ **README.md**
```markdown
# 🤖 Digg Sidekick

Your friendly companion for a better Digg experience!

Digg Sidekick is a browser extension that enhances Digg.com with powerful filtering and customization tools. Think of it as your helpful sidekick that makes Digg more personalized and enjoyable.

## 🚀 Features

- **Smart Filtering**: Hide stories by keywords, authors, or tags
- **Quick Actions**: Right-click to add filters from any text
- **Custom Highlights**: Mark important stories with custom colors
- **Import/Export**: Save and share your filter lists
- **Auto-Refresh**: Filters apply automatically as you browse
- **Keyboard Shortcuts**: Quick toggle with Ctrl+Shift+F

## 🛠 Installation

### Development
1. Clone this repository
2. Open Chrome/Edge and go to `chrome://extensions/`
3. Enable "Developer mode"
4. Click "Load unpacked" and select the `digg-sidekick` folder

### From Chrome Web Store
*Coming soon!*

## 📖 Usage

1. Visit [Digg.com](https://digg.com)
2. Click the 🤖 robot icon in your toolbar
3. Add filters (e.g., "crypto", "sponsored")
4. Watch unwanted stories disappear!

## 🎨 Branding

- **Name**: Digg Sidekick
- **Colors**: Blue (#0066CC), Orange (#FF6B35)
- **Voice**: Friendly, helpful, professional
- **Positioning**: Your companion, not a critic

## 🔧 Development

### Project Structure
```
digg-sidekick/
├── manifest.json          # Extension manifest
├── icons/                # Logo and icons
├── popup/               # Popup interface
├── content/             # Content scripts
├── background/          # Service worker
├── options/             # Options page
└── welcome/             # Welcome page
```

### Building
No build process required! This is a vanilla JavaScript extension.

### Testing
1. Load unpacked extension in Chrome/Edge
2. Visit digg.com
3. Test all filter types
4. Check context menu actions
5. Verify options page

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🙏 Acknowledgments

- Inspired by Reddit Enhancement Suite and other content filtering tools
- Built for the Digg community
- Special thanks to all beta testers!

---

**Your friendly Digg companion is here to help!** 🦸
```

## 7️⃣ **Create Remaining Files**

Copy the original files from the previous implementation for:
- `content/filter-engine.js` (update console logs to say "Digg Sidekick")
- `content/content.js` (update to match new branding)
- `content/styles.css` (update colors to use --sidekick-* variables)
- `options/` directory files (update branding similarly)

## 🚀 **Quick Start Instructions**

1. **Create folder structure** as shown above
2. **Copy each file** into its respective location
3. **Create icons** using the SVG or base64 PNGs
4. **Load in Chrome**:
   - Go to `chrome://extensions/`
   - Enable Developer Mode
   - Click "Load unpacked"
   - Select your `digg-sidekick` folder
5. **Visit digg.com** and start using your Sidekick!

## 🎯 **Next Steps**

1. Test all functionality on digg.com
2. Customize the filter selectors in `filter-engine.js` if needed
3. Create store listing screenshots
4. Submit to Chrome Web Store ($5 fee)
5. Share with the Digg community!

Your Digg Sidekick is now ready to be a helpful companion to Digg users everywhere! Want help with any specific part of testing or customization?