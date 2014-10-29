console.log(GLOBALS);
/*
chrome.runtime.sendMessage(GLOBALS, function(response) {
  console.log('GLOBALS sent'+response.farewell);
});
*/
if(GLOBALS) {
    window.postMessage(GLOBALS, '*');
  }