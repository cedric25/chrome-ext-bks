function openBksTab() {
  chrome.tabs.create({
    'index': 0,
    'url': chrome.extension.getURL('view/bookmarks.html')
  }, function(tab) {

  });
}

chrome.browserAction.onClicked.addListener(openBksTab);