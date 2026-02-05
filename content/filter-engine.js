class DiggFilterEngine {
  constructor() {
    this.filters = { keyword: [], author: [], flair: [] };
    this.enabled = true;
    this.hiddenCount = 0;
    this.observer = null;
    this.init();
  }

  async init() {
    await this.loadSettings();
    this.applyFilters();
    this.startObserver();
    this.setupMessageListener();
  }

  async loadSettings() {
    return new Promise(resolve => {
      chrome.storage.sync.get(['diggFilters', 'enabled'], (data) => {
        if (data.diggFilters) this.filters = data.diggFilters;
        if (data.enabled !== undefined) this.enabled = data.enabled;
        resolve();
      });
    });
  }

  applyFilters() {
    if (!this.enabled) {
      this.showAllStories();
      return;
    }

    this.hiddenCount = 0;
    const stories = this.getStories();
    
    stories.forEach(story => {
      const result = this.evaluateStory(story);
      
      if (result.action === 'hide') {
        this.hideStory(story);
        this.hiddenCount++;
      } else if (result.action === 'highlight') {
        this.highlightStory(story);
      } else {
        this.showStory(story);
      }
    });

    this.updateBadge();
    this.updateIndicator();
  }

  getStories() {
    // Digg-specific selectors (may need updating if Digg changes)
    const selectors = [
      '[data-content-type="story"]',
      '.story-card',
      'article.story',
      'div.story',
      '.feed-item',
      '.digg-story',
      'article',
      '.card'
    ];
    
    let stories = [];
    selectors.forEach(selector => {
      stories = stories.concat(Array.from(document.querySelectorAll(selector)));
    });
    
    // Remove duplicates and filter out very small elements
    return [...new Set(stories)].filter(el => el.textContent.length > 50);
  }

  evaluateStory(story) {
    const storyData = this.extractStoryData(story);
    
    // Check whitelist first (if any whitelist filters exist, only show matching)
    const hasWhitelist = Object.values(this.filters).some(
      filterList => filterList.some(f => f.type === 'whitelist')
    );
    
    if (hasWhitelist) {
      let matchesWhitelist = false;
      for (const type in this.filters) {
        for (const filter of this.filters[type]) {
          if (filter.type === 'whitelist' && this.matchesFilter(storyData, filter, type)) {
            matchesWhitelist = true;
            break;
          }
        }
      }
      if (!matchesWhitelist) {
        return { action: 'hide' };
      }
    }
    
    // Check hide and highlight filters
    for (const type in this.filters) {
      for (const filter of this.filters[type]) {
        if (this.matchesFilter(storyData, filter, type)) {
          if (filter.type === 'hide') {
            return { action: 'hide', filter };
          } else if (filter.type === 'highlight') {
            return { action: 'highlight', filter };
          }
        }
      }
    }
    
    return { action: 'show' };
  }

  extractStoryData(story) {
    const text = story.textContent.toLowerCase();
    const title = story.querySelector('h2, h3, h4, [class*="title"], [class*="headline"]')?.textContent.toLowerCase() || '';
    
    // Try to find author (Digg structure may vary)
    const authorElement = story.querySelector('[class*="author"], [class*="byline"], [class*="user"], [class*="source"]');
    const author = authorElement?.textContent.toLowerCase() || '';
    
    // Try to find flairs/tags
    const flairElements = story.querySelectorAll('[class*="tag"], [class*="category"], [class*="flair"], [class*="topic"]');
    const flairs = Array.from(flairElements).map(f => f.textContent.toLowerCase());
    
    return { text, title, author, flairs };
  }

  matchesFilter(storyData, filter, type) {
    const filterText = filter.text.toLowerCase();
    
    switch (type) {
      case 'keyword':
        return storyData.text.includes(filterText) || storyData.title.includes(filterText);
      case 'author':
        return storyData.author.includes(filterText);
      case 'flair':
        return storyData.flairs.some(flair => flair.includes(filterText));
      default:
        return false;
    }
  }

  hideStory(story) {
    story.style.display = 'none';
    story.setAttribute('data-digg-filtered', 'true');
    story.classList.remove('digg-highlighted');
  }

  showStory(story) {
    story.style.display = '';
    story.removeAttribute('data-digg-filtered');
    story.classList.remove('digg-highlighted');
  }

  highlightStory(story) {
    story.style.display = '';
    story.removeAttribute('data-digg-filtered');
    story.classList.add('digg-highlighted');
  }

  showAllStories() {
    const hiddenStories = document.querySelectorAll('[data-digg-filtered="true"]');
    hiddenStories.forEach(story => {
      this.showStory(story);
    });
    this.hiddenCount = 0;
    this.updateBadge();
    this.updateIndicator();
  }

  updateBadge() {
    chrome.runtime.sendMessage({
      action: 'updateBadge',
      count: this.hiddenCount
    }).catch(() => {
      // Ignore errors if background script isn't ready
    });
  }

  updateIndicator() {
    const indicator = document.getElementById('filter-count');
    if (indicator) {
      indicator.textContent = `${this.hiddenCount} hidden`;
    }
  }

  startObserver() {
    if (this.observer) this.observer.disconnect();
    
    this.observer = new MutationObserver((mutations) => {
      let shouldUpdate = false;
      
      mutations.forEach(mutation => {
        if (mutation.addedNodes.length > 0) {
          shouldUpdate = true;
        }
      });
      
      if (shouldUpdate) {
        setTimeout(() => this.applyFilters(), 100);
      }
    });
    
    const target = document.querySelector('.main, main, .container, .feed, #content') || document.body;
    this.observer.observe(target, { childList: true, subtree: true });
  }

  setupMessageListener() {
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      switch (request.action) {
        case 'applyFilters':
          this.filters = request.filters || this.filters;
          this.enabled = request.enabled !== undefined ? request.enabled : this.enabled;
          this.applyFilters();
          sendResponse({ hiddenCount: this.hiddenCount });
          break;
          
        case 'getSelectedText':
          sendResponse({ text: window.getSelection().toString() });
          break;
          
        case 'getFilterStats':
          sendResponse({
            hiddenCount: this.hiddenCount,
            totalStories: this.getStories().length
          });
          break;
          
        case 'resetFilters':
          this.showAllStories();
          sendResponse({ success: true });
          break;
          
        case 'addQuickFilter':
          if (request.text) {
            // Sanitize input before storing
            const sanitizedText = request.text
              .replace(/[<>"'`]/g, '')
              .replace(/javascript:/gi, '')
              .replace(/data:/gi, '')
              .substring(0, 200)
              .trim();
            if (!sanitizedText) {
              sendResponse({ success: false });
              break;
            }
            chrome.storage.sync.get(['diggFilters'], (data) => {
              const filters = data.diggFilters || { keyword: [], author: [], flair: [] };
              filters.keyword.push({
                text: sanitizedText,
                type: 'hide',
                id: Date.now() + Math.random()
              });
              chrome.storage.sync.set({ diggFilters: filters }, () => {
                this.filters = filters;
                this.applyFilters();
              });
            });
          }
          sendResponse({ success: true });
          break;
      }
      return true;
    });
  }
}

// Initialize
const filterEngine = new DiggFilterEngine();
