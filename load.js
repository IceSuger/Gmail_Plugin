window.onload = function () {

  var jq = document.createElement('script');
  jq.src = "https://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js";
  document.getElementsByTagName('body')[0].appendChild(jq);
	
  var gmsrc = document.createElement('script');
  gmsrc.src = "https://xmailchrome.appspot.com/gmail.js";
  document.getElementsByTagName('body')[0].appendChild(gmsrc);
/*	
	var sm = document.createElement('script');
  sm.src = "chrome://extensions/ibmlbdjegjfkfhgpbmkenbeejhgngjmc/passDOM.js";
  document.getElementsByTagName('body')[0].appendChild(sm);
	
	var sm = document.createElement('script');
  sm.src = "test/test4.js";
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