/**
 * Popup Script - YouTube Shorts Blocker
 * Handles user settings, state syncing, and live counter updates.
 */

document.addEventListener('DOMContentLoaded', () => {
  const toggleEnabled = document.getElementById('toggleEnabled');
  const toggleSidebar = document.getElementById('toggleSidebar');
  const toggleFeed = document.getElementById('toggleFeed');
  const toggleRedirect = document.getElementById('toggleRedirect');
  const blockedCountEl = document.getElementById('blockedCount');
  const resetStatsBtn = document.getElementById('resetStatsBtn');
  const refreshTabBtn = document.getElementById('refreshTabBtn');
  const statusBadge = document.getElementById('statusBadge');
  const statusText = document.getElementById('statusText');

  const defaultSettings = {
    enabled: true,
    hideSidebar: true,
    hideFeed: true,
    autoRedirect: true,
    blockedCount: 0
  };

  /**
   * Update Status Badge UI
   */
  function updateBadge(enabled) {
    if (enabled) {
      statusBadge.classList.remove('disabled');
      statusBadge.classList.add('active');
      statusText.textContent = 'مفعّل';
    } else {
      statusBadge.classList.remove('active');
      statusBadge.classList.add('disabled');
      statusText.textContent = 'معطّل';
    }

    // Disable sub-options if master switch is off
    [toggleSidebar, toggleFeed, toggleRedirect].forEach(toggle => {
      toggle.disabled = !enabled;
      const optionItem = toggle.closest('.option-item');
      if (optionItem) {
        optionItem.style.opacity = enabled ? '1' : '0.4';
        optionItem.style.pointerEvents = enabled ? 'auto' : 'none';
      }
    });
  }

  /**
   * Load stored settings
   */
  function loadSettings() {
    if (chrome.storage && chrome.storage.sync) {
      chrome.storage.sync.get(defaultSettings, (settings) => {
        toggleEnabled.checked = settings.enabled;
        toggleSidebar.checked = settings.hideSidebar;
        toggleFeed.checked = settings.hideFeed;
        toggleRedirect.checked = settings.autoRedirect;
        blockedCountEl.textContent = (settings.blockedCount || 0).toLocaleString('ar-EG');
        updateBadge(settings.enabled);
      });
    }
  }

  /**
   * Save settings when changed
   */
  function saveSettings() {
    const settings = {
      enabled: toggleEnabled.checked,
      hideSidebar: toggleSidebar.checked,
      hideFeed: toggleFeed.checked,
      autoRedirect: toggleRedirect.checked
    };

    updateBadge(settings.enabled);

    if (chrome.storage && chrome.storage.sync) {
      chrome.storage.sync.set(settings);
    }
  }

  // Event Listeners
  toggleEnabled.addEventListener('change', saveSettings);
  toggleSidebar.addEventListener('change', saveSettings);
  toggleFeed.addEventListener('change', saveSettings);
  toggleRedirect.addEventListener('change', saveSettings);

  // Reset Stats
  resetStatsBtn.addEventListener('click', () => {
    if (chrome.storage && chrome.storage.sync) {
      chrome.storage.sync.set({ blockedCount: 0 }, () => {
        blockedCountEl.textContent = '0';
      });
    }
  });

  // Reload current YouTube tab
  refreshTabBtn.addEventListener('click', () => {
    if (chrome.tabs && chrome.tabs.query) {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs && tabs[0] && tabs[0].url && tabs[0].url.includes('youtube.com')) {
          chrome.tabs.reload(tabs[0].id);
        }
      });
    }
  });

  // Live storage updates if content script increments counter while popup is open
  if (chrome.storage && chrome.storage.onChanged) {
    chrome.storage.onChanged.addListener((changes, area) => {
      if (area === 'sync' && changes.blockedCount) {
        blockedCountEl.textContent = (changes.blockedCount.newValue || 0).toLocaleString('ar-EG');
      }
    });
  }

  loadSettings();
});
