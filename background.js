// When the extension is installed or upgraded ...
var tttrackers;

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
	
	chrome.runtime.onConnect.addListener(function(port) {
		port.onMessage.addListener(function(message) {
			if(message.type) {
				console.log("Saving message", message.type);
				tttrackers=message.type;
				//chrome.storage.local.set({"local_msg_id" : message.id});
			}
		});
	});
});