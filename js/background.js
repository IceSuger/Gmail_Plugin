chrome.runtime.onInstalled.addListener(function (details) {
    // Check whether new version is installed
    if (details.reason == "install" || details.reason == "update") {
        chrome.tabs.create({url: "help.html"});
    }
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
});

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    //alert('DOWNLOADING!!!');
    //console.log("DOWN !!!!!! is:" + message);
    if (message.url) {
        //console.log("DOWN URL is:" + message.url);
        chrome.downloads.download({
            url: message.url,
            conflictAction: 'uniquify',
            saveAs: false
        });
    } else if (message.reAuth) {
        google.authorize(function () {
            sendResponse({token: google.getAccessToken()});
        });
    }
    //sendResponse({farewell: "from bg"});
});

var google = new OAuth2('google', {
    client_id: '1061800679212-t8pdm7kk16gk47odgu0mt7ov5l9or5g5.apps.googleusercontent.com',
    client_secret: 'Ihu8AKXFttSGBVXA-hOsk5Yf',
    api_scope: 'https://www.googleapis.com/auth/gmail.modify'
});
chrome.pageAction.onClicked.addListener(function () {
    console.log('GmailAssist come out');
    google.authorize(function () {
        chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {token: google.getAccessToken()}, function (response) {
                //console.log(response.farewell);
            });
        });

    });
})