// Service Worker for Manifest V3
chrome.runtime.onInstalled.addListener(() => {
  console.log('Digg-Sidekick installed');
  
  // Set default filters
  chrome.storage.sync.get(['diggFilters'], (data) => {
    if (!data.diggFilters) {
      chrome.storage.sync.set({
        diggFilters: {
          keyword: [],
          author: [],
          flair: []
        },
        enabled: true,
        autoRefresh: true,
        autoApply: true,
        showCount: true,
        highlightMatches: false
      });
    }
  });
  
  // Create context menu
  chrome.contextMenus.create({
    id: 'addToDiggFilter',
    title: 'Add "%s" to Digg Filter',
    contexts: ['selection']
  });
});

// Context menu click
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'addToDiggFilter') {
    if (tab.url && tab.url.includes('digg.com')) {
      chrome.tabs.sendMessage(tab.id, {
        action: 'addQuickFilter',
        text: info.selectionText
      });
    } else {
      // Add to storage even if not on Digg
      chrome.storage.sync.get(['diggFilters'], (data) => {
        const filters = data.diggFilters || { keyword: [], author: [], flair: [] };
        filters.keyword.push({
          text: info.selectionText,
          type: 'hide',
          id: Date.now() + Math.random()
        });
        chrome.storage.sync.set({ diggFilters: filters });
      });
    }
  }
});

// Message listener
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  switch (request.action) {
    case 'updateBadge':
      // Update extension badge with count
      chrome.storage.sync.get(['showCount'], (data) => {
        if (data.showCount !== false && request.count > 0) {
          chrome.action.setBadgeText({ text: request.count.toString() });
          chrome.action.setBadgeBackgroundColor({ color: '#ff4500' });
        } else {
          chrome.action.setBadgeText({ text: '' });
        }
      });
      break;
      
    case 'toggleFilter':
      chrome.storage.sync.get(['enabled'], (data) => {
        const newState = data.enabled === undefined ? false : !data.enabled;
        chrome.storage.sync.set({ enabled: newState });
        
        // Notify all Digg tabs
        chrome.tabs.query({ url: '*://digg.com/*' }, (tabs) => {
          tabs.forEach(tab => {
            chrome.tabs.sendMessage(tab.id, {
              action: 'applyFilters',
              enabled: newState
            }).catch(() => {
              // Ignore errors for tabs without content script
            });
          });
        });
      });
      break;
  }
  sendResponse({ received: true });
  return true;
});

// Listen for tab updates
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url && tab.url.includes('digg.com')) {
    // Auto-apply filters when page loads
    chrome.storage.sync.get(['diggFilters', 'enabled', 'autoApply'], (data) => {
      if (data.autoApply !== false) {
        chrome.tabs.sendMessage(tabId, {
          action: 'applyFilters',
          filters: data.diggFilters,
          enabled: data.enabled
        }).catch(() => {
          // Content script may not be ready yet, that's ok
        });
      }
    });
  }
});
