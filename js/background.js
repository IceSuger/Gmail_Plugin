chrome.runtime.onInstalled.addListener(function () {
    chrome.declarativeContent.onPageChanged.removeRules(undefined, function () {
        chrome.declarativeContent.onPageChanged.addRules([
            {
                // That fires when the URL matchs gmail...
                conditions: [
                    new chrome.declarativeContent.PageStateMatcher({
                        pageUrl: {urlContains: 'mail.google.com'},
                    })
                ],
                // And shows the extension's page action.
                actions: [new chrome.declarativeContent.ShowPageAction()]
            }
        ]);
    });

    //console.log('laert');
    chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
        //if(message != 'Hello' && message != 'alljsloaded'){
        console.log("DOWN !!!!!! is:" + message);
        if (message.url) {
            console.log("DOWN URL is:" + message.url);
            chrome.downloads.download({
                url: message.url,
                conflictAction: 'uniquify',
                saveAs: false
            });
        }
    });

});