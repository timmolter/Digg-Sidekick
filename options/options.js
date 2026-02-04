document.addEventListener('DOMContentLoaded', function() {
  // Load saved settings
  loadSettings();
  loadStats();

  // Export
  document.getElementById('exportBtn').addEventListener('click', () => {
    chrome.storage.sync.get(['diggFilters'], (data) => {
      const json = JSON.stringify(data.diggFilters, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'digg-filters-backup.json';
      a.click();
      URL.revokeObjectURL(url);
      showToast('Filters exported successfully!', 'success');
    });
  });

  // Import
  document.getElementById('importBtn').addEventListener('click', () => {
    document.getElementById('importFile').click();
  });

  document.getElementById('importFile').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const filters = JSON.parse(event.target.result);
        
        // Validate structure
        if (!filters.keyword || !filters.author || !filters.flair) {
          throw new Error('Invalid filter format');
        }
        
        chrome.storage.sync.set({ diggFilters: filters }, () => {
          showToast('Filters imported successfully!', 'success');
          loadStats();
        });
      } catch (err) {
        showToast('Error: Invalid JSON file', 'error');
      }
    };
    reader.readAsText(file);
    
    // Reset file input
    e.target.value = '';
  });

  // Reset
  document.getElementById('resetBtn').addEventListener('click', () => {
    if (confirm('Are you sure you want to delete ALL filters? This cannot be undone.')) {
      chrome.storage.sync.set({
        diggFilters: { keyword: [], author: [], flair: [] }
      }, () => {
        showToast('All filters have been reset.', 'success');
        loadStats();
      });
    }
  });

  // Save settings on change
  ['autoApply', 'showCount', 'highlightMatches'].forEach(id => {
    document.getElementById(id).addEventListener('change', (e) => {
      chrome.storage.sync.set({ [id]: e.target.checked }, () => {
        showToast('Settings saved', 'success');
      });
    });
  });

  // Help link
  document.getElementById('helpBtn').addEventListener('click', (e) => {
    e.preventDefault();
    chrome.tabs.create({ url: 'https://github.com/timmolter/Digg-Sidekick#readme' });
  });
  
  function loadSettings() {
    chrome.storage.sync.get(['autoApply', 'showCount', 'highlightMatches'], (data) => {
      document.getElementById('autoApply').checked = data.autoApply !== false;
      document.getElementById('showCount').checked = data.showCount !== false;
      document.getElementById('highlightMatches').checked = data.highlightMatches || false;
    });
  }
  
  function loadStats() {
    chrome.storage.sync.get(['diggFilters'], (data) => {
      const filters = data.diggFilters || { keyword: [], author: [], flair: [] };
      
      const keywordCount = filters.keyword?.length || 0;
      const authorCount = filters.author?.length || 0;
      const flairCount = filters.flair?.length || 0;
      const total = keywordCount + authorCount + flairCount;
      
      document.getElementById('totalFilters').textContent = total;
      document.getElementById('keywordCount').textContent = keywordCount;
      document.getElementById('authorCount').textContent = authorCount;
      document.getElementById('flairCount').textContent = flairCount;
    });
  }
  
  function showToast(message, type = 'info') {
    // Remove existing toasts
    const existingToast = document.querySelector('.toast');
    if (existingToast) existingToast.remove();
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.remove();
    }, 3000);
  }
});
