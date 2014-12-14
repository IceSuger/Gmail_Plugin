
chrome.runtime.onInstalled.addListener(function() {
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    chrome.declarativeContent.onPageChanged.addRules([
      {
        // That fires when the URL matchs gmail...
        conditions: [
          new chrome.declarativeContent.PageStateMatcher({
            pageUrl: { urlContains: 'mail.google.com' },
          })
        ],
        // And shows the extension's page action.
        actions: [ new chrome.declarativeContent.ShowPageAction() ]
      }
    ]);
  });
	
	
	chrome.runtime.onMessage.addListener(function(message, sender, sendResponse){
			if(message != 'Hello' && message != 'alljsloaded'){
			//alert(message);
			console.log(message);
					chrome.downloads.download({
            url: message.url,
            conflictAction: 'uniquify',
            saveAs: true
          });
			}
	});
	
});