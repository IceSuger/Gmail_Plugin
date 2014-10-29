console.log(GLOBALS);

chrome.runtime.sendMessage(GLOBALS, function(response) {
  console.log('GLOBALS sent'+response.farewell);
});
