/**
 * YouTube Shorts Blocker - Content Script
 * Handles real-time DOM cleanup, URL redirection, and storage syncing.
 */

(() => {
  'use strict';

  // Default configuration
  let config = {
    enabled: true,
    hideSidebar: true,
    hideFeed: true,
    autoRedirect: true,
    blockedCount: 0
  };

  let sessionBlockedCount = 0;
  let saveTimeout = null;

  /**
   * Apply settings to the DOM via root classes
   */
  function applyClasses() {
    const root = document.documentElement;
    if (!root) return;

    if (!config.enabled) {
      root.classList.add('yt-blocker-disabled');
      root.classList.remove('yt-show-sidebar', 'yt-show-feed');
    } else {
      root.classList.remove('yt-blocker-disabled');
      
      if (config.hideSidebar) {
        root.classList.remove('yt-show-sidebar');
      } else {
        root.classList.add('yt-show-sidebar');
      }

      if (config.hideFeed) {
        root.classList.remove('yt-show-feed');
      } else {
        root.classList.add('yt-show-feed');
      }
    }
  }

  /**
   * Increment blocked count and sync with storage
   */
  function incrementBlockCount(count = 1) {
    sessionBlockedCount += count;
    config.blockedCount = (config.blockedCount || 0) + count;

    if (saveTimeout) clearTimeout(saveTimeout);
    saveTimeout = setTimeout(() => {
      if (chrome.storage && chrome.storage.sync) {
        chrome.storage.sync.set({ blockedCount: config.blockedCount }).catch(() => {});
      }
    }, 1000);
  }

  /**
   * Redirect /shorts/VIDEO_ID URLs to standard /watch?v=VIDEO_ID
   */
  function handleUrlRedirect() {
    if (!config.enabled || !config.autoRedirect) return false;

    const path = window.location.pathname;
    if (path.startsWith('/shorts/')) {
      const parts = path.split('/shorts/');
      if (parts[1]) {
        const videoId = parts[1].split('?')[0].split('&')[0];
        if (videoId) {
          const currentUrl = new URL(window.location.href);
          const searchParams = currentUrl.searchParams;
          let newUrl = `${currentUrl.origin}/watch?v=${videoId}`;
          
          const paramsList = [];
          searchParams.forEach((val, key) => {
            if (key !== 'v') {
              paramsList.push(`${encodeURIComponent(key)}=${encodeURIComponent(val)}`);
            }
          });

          if (paramsList.length > 0) {
            newUrl += `&${paramsList.join('&')}`;
          }

          incrementBlockCount(1);
          window.location.replace(newUrl);
          return true;
        }
      }
    }
    return false;
  }

  /**
   * Selectors used for JavaScript DOM cleanup & verification
   */
  const SHORTS_SELECTORS = [
    // Sidebar
    'ytd-guide-entry-renderer:has(a[href^="/shorts"])',
    'ytd-mini-guide-entry-renderer:has(a[href^="/shorts"])',
    'ytd-guide-entry-renderer a[title="Shorts"]',
    'ytd-guide-entry-renderer a[title="شورتس"]',
    'ytd-mini-guide-entry-renderer[aria-label="Shorts"]',
    'ytd-mini-guide-entry-renderer[aria-label="شورتس"]',
    // Shelves & Sections
    'ytd-rich-shelf-renderer[is-shorts]',
    'ytd-rich-section-renderer:has(ytd-rich-shelf-renderer[is-shorts])',
    'ytd-rich-section-renderer:has(ytd-reel-shelf-renderer)',
    'ytd-reel-shelf-renderer',
    'ytd-shelf-renderer:has(ytd-reel-shelf-renderer)',
    'ytd-rich-grid-row:has(ytd-rich-shelf-renderer[is-shorts])',
    // Cards
    'ytd-video-renderer:has(a[href^="/shorts/"])',
    'ytd-rich-item-renderer:has(a[href^="/shorts/"])',
    'ytd-compact-video-renderer:has(a[href^="/shorts/"])',
    'ytd-grid-video-renderer:has(a[href^="/shorts/"])',
    'ytm-shorts-lockup-view-model',
    'yt-lockup-view-model:has(a[href^="/shorts/"])',
    // Tabs
    'yt-tab-shape[tab-title="Shorts"]',
    'yt-tab-shape[tab-title="شورتس"]',
    'tp-yt-paper-tab:has([aria-label*="Shorts"])',
    'tp-yt-paper-tab:has([aria-label*="شورتس"])'
  ];

  /**
   * Scan and mark/clean shorts elements
   */
  let isScanning = false;
  function scanAndCleanShorts() {
    if (!config.enabled) return;
    if (isScanning) return;
    isScanning = true;

    try {
      // 1. Clean elements matching selectors
      if (config.hideFeed || config.hideSidebar) {
        let foundNew = 0;
        SHORTS_SELECTORS.forEach(selector => {
          try {
            const elements = document.querySelectorAll(selector);
            elements.forEach(el => {
              if (!el.dataset.ytShortsBlocked) {
                el.dataset.ytShortsBlocked = 'true';
                el.style.setProperty('display', 'none', 'important');
                foundNew++;
              }
            });
          } catch (e) {
            // Some CSS :has selectors might not be supported in older engines
          }
        });

        // 2. Extra scan for anchor tags pointing to /shorts/
        const shortsLinks = document.querySelectorAll('a[href^="/shorts/"]:not([data-yt-shorts-checked])');
        shortsLinks.forEach(link => {
          link.setAttribute('data-yt-shorts-checked', 'true');
          
          // Traverse up to find video container item
          const container = link.closest(
            'ytd-rich-item-renderer, ytd-video-renderer, ytd-compact-video-renderer, ytd-grid-video-renderer, yt-lockup-view-model, ytd-rich-section-renderer'
          );
          if (container && !container.dataset.ytShortsBlocked) {
            container.dataset.ytShortsBlocked = 'true';
            container.style.setProperty('display', 'none', 'important');
            foundNew++;
          }
        });

        if (foundNew > 0) {
          incrementBlockCount(foundNew);
        }
      }
    } finally {
      isScanning = false;
    }
  }

  /**
   * Initialize extension configuration and listeners
   */
  function init() {
    // 1. Initial redirect check
    if (handleUrlRedirect()) return;

    // 2. Load storage configuration
    if (chrome.storage && chrome.storage.sync) {
      chrome.storage.sync.get(config, (stored) => {
        if (stored) {
          config = { ...config, ...stored };
          applyClasses();
          scanAndCleanShorts();
        }
      });

      // Listen for settings change from popup
      chrome.storage.onChanged.addListener((changes, area) => {
        if (area === 'sync') {
          for (let [key, { newValue }] of Object.entries(changes)) {
            if (newValue !== undefined) {
              config[key] = newValue;
            }
          }
          applyClasses();
          handleUrlRedirect();
          scanAndCleanShorts();
        }
      });
    } else {
      applyClasses();
    }

    // 3. YouTube SPA lifecycle events
    window.addEventListener('yt-navigate-finish', () => {
      if (!handleUrlRedirect()) {
        scanAndCleanShorts();
      }
    });

    window.addEventListener('yt-page-data-updated', () => {
      scanAndCleanShorts();
    });

    window.addEventListener('popstate', () => {
      handleUrlRedirect();
    });

    // 4. MutationObserver for infinite scroll & dynamic content
    const observer = new MutationObserver((mutations) => {
      if (!config.enabled) return;

      let shouldScan = false;
      for (const mutation of mutations) {
        if (mutation.addedNodes.length > 0) {
          shouldScan = true;
          break;
        }
      }

      if (shouldScan) {
        scanAndCleanShorts();
      }
    });

    // Start observer once body/document exists
    const startObserver = () => {
      if (document.body) {
        observer.observe(document.body, {
          childList: true,
          subtree: true
        });
        scanAndCleanShorts();
      } else {
        document.addEventListener('DOMContentLoaded', () => {
          observer.observe(document.body, {
            childList: true,
            subtree: true
          });
          scanAndCleanShorts();
        });
      }
    };

    startObserver();
  }

  // Initial call
  applyClasses();
  init();
})();
