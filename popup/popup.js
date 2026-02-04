document.addEventListener('DOMContentLoaded', function() {
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
    elements.toggleFilter.textContent = enabled ? '🔴 Disable' : '🟢 Enable';
    elements.toggleFilter.style.background = enabled ? '#ff4500' : '#46d160';
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
    applyToCurrentTab();
  }

  function deleteFilter(id) {
    filters[currentTab] = filters[currentTab].filter(f => f.id !== id);
    saveData();
    renderFilters();
    applyToCurrentTab();
  }

  function renderFilters() {
    elements.filtersContainer.innerHTML = '';
    
    if (filters[currentTab].length === 0) {
      elements.filtersContainer.innerHTML = `
        <div class="empty-state">
          No ${currentTab} filters yet.<br>Add one above!
        </div>
      `;
      return;
    }
    
    filters[currentTab].forEach(filter => {
      const div = document.createElement('div');
      div.className = 'filter-entry';
      div.innerHTML = `
        <span class="text">${escapeHtml(filter.text)}</span>
        <span class="type-badge ${filter.type}">${filter.type}</span>
        <button class="delete" data-id="${filter.id}">✕</button>
      `;
      elements.filtersContainer.appendChild(div);
      
      div.querySelector('.delete').addEventListener('click', () => {
        deleteFilter(filter.id);
      });
    });
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  function saveData() {
    chrome.storage.sync.set({
      diggFilters: filters,
      enabled: enabled,
      autoRefresh: elements.autoRefresh.checked
    }, () => {
      console.log('Filters saved');
    });
  }

  function loadData() {
    chrome.storage.sync.get(['diggFilters', 'enabled', 'autoRefresh'], (data) => {
      if (data.diggFilters) filters = data.diggFilters;
      if (data.enabled !== undefined) enabled = data.enabled;
      if (data.autoRefresh !== undefined) elements.autoRefresh.checked = data.autoRefresh;
      
      elements.toggleFilter.textContent = enabled ? '🔴 Disable' : '🟢 Enable';
      elements.toggleFilter.style.background = enabled ? '#ff4500' : '#46d160';
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
            elements.hiddenCount.textContent = `${response.hiddenCount} hidden`;
          }
        });
      }
    });
  }

  function exportFilters() {
    const dataStr = JSON.stringify(filters, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = 'digg-filters.json';

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  }

  // Get initial hidden count
  applyToCurrentTab();
});
