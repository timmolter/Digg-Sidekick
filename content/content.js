// Main content script
// Security: Only run on HTTPS
if (!location.href.startsWith('https://digg.com')) {
  console.warn('Digg-Sidekick: Only runs on https://digg.com');
}

console.log('Digg-Sidekick loaded');

// Inject UI elements
function injectUI() {
  // Check if already injected
  if (document.getElementById('digg-filter-indicator')) return;
  
  // Add filter indicator to page
  const indicator = document.createElement('div');
  indicator.id = 'digg-filter-indicator';
  indicator.innerHTML = `
    <span id="filter-count">0 hidden</span>
    <button id="digg-filter-manage-btn">Manage</button>
  `;
  
  document.body.appendChild(indicator);
  
  // Click handler for manage button
  document.getElementById('digg-filter-manage-btn').addEventListener('click', (e) => {
    e.stopPropagation();
    // Can't programmatically open popup, but we can highlight it
    alert('Click the extension icon in your browser toolbar to manage filters.');
  });
  
  // Click on indicator to toggle visibility
  indicator.addEventListener('click', () => {
    chrome.storage.sync.get(['enabled'], (data) => {
      const newState = !data.enabled;
      chrome.storage.sync.set({ enabled: newState }, () => {
        if (window.filterEngine) {
          window.filterEngine.enabled = newState;
          window.filterEngine.applyFilters();
        }
      });
    });
  });
}

// Wait for page to load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', injectUI);
} else {
  injectUI();
}

// Listen for keyboard shortcuts
document.addEventListener('keydown', (e) => {
  // Ctrl+Shift+F to toggle filtering
  if (e.ctrlKey && e.shiftKey && e.key === 'F') {
    e.preventDefault();
    chrome.runtime.sendMessage({ action: 'toggleFilter' });
  }
});

// Expose to window for debugging
window.diggFilter = typeof filterEngine !== 'undefined' ? filterEngine : null;
