window.onload = function () {	
	var sm = document.createElement('script');
  sm.src = "https://rawgit.com/IceSuger/Gmail_Plugin/master/passDOM.js";
  document.getElementsByTagName('body')[0].appendChild(sm);

	var sm = document.createElement('script');
  sm.src = "https://rawgit.com/IceSuger/Gmail_Plugin/master/test/test4.js";
  document.getElementsByTagName('body')[0].appendChild(sm);
/*
  window.addEventListener("message", function(event) {
    if(event.data.type && (event.data.type == "new_email")) {
      port.postMessage({ type: "save_email_id", id: event.data.message_id});
    }
  }, false);
*/
/*
chrome.runtime.sendMessage({globals: GLOBALS}, function(response) {
  console.log('GLOBALS sent'+response.farewell);
});
*/
}