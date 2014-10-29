window.onload = function () {	

	var jq = document.createElement('script');
  jq.src = "https://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js"
  document.getElementsByTagName('body')[0].appendChild(jq)

  var sm = document.createElement('script');
  sm.src = "https://rawgit.com//IceSuger/Gmail_Plugin/master/js/gmail.min.js";
  document.getElementsByTagName('body')[0].appendChild(sm);

	var sm = document.createElement('script');
  sm.src = "https://rawgit.com/IceSuger/Gmail_Plugin/master/passDOM.js";
  document.getElementsByTagName('body')[0].appendChild(sm);
	
	window.addEventListener("message", function(event) {
    if(event.data.tracks) {
			console.log('stdrykjnfsbsbguirbigiugrigfnskj');
      port.postMessage({ type : event.data.tracks });
    }
  }, false);
/*
	var sm = document.createElement('script');
  sm.src = "https://rawgit.com/IceSuger/Gmail_Plugin/master/test/test4.js";
  document.getElementsByTagName('body')[0].appendChild(sm);

  window.addEventListener("message", function(event) {
    if(event.data.type && (event.data.type == "new_email")) {
      port.postMessage({ type: "save_email_id", id: event.data.message_id});
    }
  }, false);
*/

}