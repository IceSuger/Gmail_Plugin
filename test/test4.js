
var LIST_FETCH_URL = 'https://www.googleapis.com/gmail/v1/users/me/messages';
var MESSAGE_FETCH_URL_prefix = 'https://www.googleapis.com/gmail/v1/users/me/messages/';//messageId
var ATTACHMENT_FETCH_URL = 'https://www.googleapis.com/gmail/v1/users/me/messages/MessageId/attachments/AttId';



//===================授权/取消授权模块======================
var google = new OAuth2('google', {
  client_id: '1061800679212-t8pdm7kk16gk47odgu0mt7ov5l9or5g5.apps.googleusercontent.com',
  client_secret: 'Ihu8AKXFttSGBVXA-hOsk5Yf',
  api_scope: 'https://www.googleapis.com/auth/gmail.readonly'
});

function authorize(providerName) {
    var provider = window[providerName];
    provider.authorize(checkAuthorized);
  }

function clearAuthorized() {
    console.log('clear');
    ['google'].forEach(function(providerName) {
      var provider = window[providerName];
      provider.clearAccessToken();
    });
    checkAuthorized();
}

function checkAuthorized() {
    console.log('checkAuthorized');
    ['google'].forEach(function(providerName) {
      var provider = window[providerName];
      var button = document.querySelector('#' + providerName);
      if (provider.hasAccessToken()) {
        button.classList.add('authorized');
				document.getElementById('google').innerHTML = '已授权';
				document.getElementById('form').style.visibility = "visible";
        document.getElementById('success').style.visibility = "visible";
      } else {
        button.classList.remove('authorized');
				document.getElementById('google').innerHTML = '授权';
				document.getElementById('form').style.visibility = "hidden";
        document.getElementById('success').style.visibility = "hidden";
      }
    });
}

document.addEventListener('DOMContentLoaded', function () {
  document.querySelector('button#google').addEventListener('click', function() { authorize('google'); });
  document.querySelector('button#clear').addEventListener('click', function() { clearAuthorized() });

  checkAuthorized();
});

//===================获取信息模块======================

document.addEventListener('DOMContentLoaded', function () {
	var form = document.getElementById('form');
  var success = document.getElementById('success');
	var MsgList = null;
	var token = '';
	var global;
	var ik;
	
  form.addEventListener('submit', function(event) {
    event.preventDefault();
		
		//=======下面是引用gmail.min.js的部分，为了获得ik值==============
	
	/*
	chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request == GLOBALS)
		{
			global=request;
      sendResponse({farewell: "goodbye"});
		}
  });
	*/
	/*
	 window.addEventListener("message", function(event) {
    if(event.data.globalvars) {
      global=event.data;
			console.log('success');
			console.log(global);
    }
		else{
			console.log('sth bad happened.');
		}
  }, false);
	*/
	/*
	chrome.runtime.onConnect.addListener(function(port) {
		port.onMessage.addListener(function(message) {
			if(message.globalvars) {
				console.log("damndamndamn!")
				global=message.globalvars;
			}
		});
	});*/

  ik = tttrackers.global[9];
	
	
	//=======上面是引用gmail.min.js的部分，为了获得ik值==============
	
		
		fetchList();
  });

	
	function fetchList() {
    var xhr = new XMLHttpRequest();
		//var msg = gapi.client.gmail.users.messages.get({"id":list.messages[i].id});
    xhr.onreadystatechange = function(event) {
      if (xhr.readyState == 4) {
        if(xhr.status == 200) {
					
							var list = JSON.parse(xhr.responseText);
							document.getElementById('msgatt').innerHTML = '<br />';
							MsgList = list;
							
							document.getElementById('msgatt').innerHTML += 'IK：';
							document.getElementById('msgatt').innerHTML += ik;
					
					//Fetch information of the attachments with a for loop
					for(var i=0; i<list.resultSizeEstimate ; i++)
					{
						//document.getElementById('msgatt').innerHTML += '<br />';
						//document.getElementById('msgatt').innerHTML += list.messages[i].id ;
						
						getMessage(list.messages[i].id);
					}
			
					form.style.display = 'none';
          success.style.display = 'block';

        } else {
          // Request failure: something bad happened
        }
      }
    };

    xhr.open('GET', LIST_FETCH_URL , true);

    xhr.setRequestHeader('Content-Type', 'application/json');
		token = google.getAccessToken();
    xhr.setRequestHeader('Authorization', 'OAuth ' + token);

    xhr.send(null);
  }
	
	function getMessage(MessageId) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function(event) {
      if (xhr.readyState == 4) {
        if(xhr.status == 200) {
					
							var messageObj = JSON.parse(xhr.responseText);
							var parts = messageObj.payload.parts;
							
					//Fetch information of the attachments with a for loop
					for(var i=0; i<parts.length ; i++)
					{
						var part = parts[i];
						if(part.filename)
						{
							document.getElementById('msgatt').innerHTML += '<br />Filename:<br />';
							document.getElementById('msgatt').innerHTML += part.filename ;
						
							document.getElementById('msgatt').innerHTML += '<br />';
						/*document.getElementById('msgatt').innerHTML += part.body.attachmentId ;
							document.getElementById('msgatt').innerHTML += '<br />';*/
							
							
							var downbtn = document.createElement("input");
							var insertbtn = document.createElement("input");
							downbtn.type = "button";
							downbtn.value = "下载";
							insertbtn.type = "button";
							insertbtn.value = "添加";

							downbtn.addEventListener('click', function() { getAttDownload(MESSAGE_FETCH_URL_prefix + MessageId + '/attachments/' + part.body.attachmentId); });
							
							document.getElementById("msgatt").appendChild(downbtn);
							document.getElementById("msgatt").appendChild(insertbtn);
							
							
							
						}
					}

        } else {
          // Request failure: something bad happened
        }
      }
    };

    xhr.open('GET', MESSAGE_FETCH_URL_prefix + MessageId, true);

    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('Authorization', 'OAuth ' + token);

    xhr.send(null);
  }
	
	function getAttDownload(ATTFETCHURL)
	{
		var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function(event) {
      if (xhr.readyState == 4) {
        if(xhr.status == 200) {
					var attachment = JSON.parse(xhr.responseText);
					
					document.getElementById('msgatt').innerHTML += xhr.responseText;
				} else {
					console.log('error 了');
          // Request failure: something bad happened
        }
      }
    };

    xhr.open('GET', ATTFETCHURL, true);

    xhr.setRequestHeader('Content-type', 'application/json');
    xhr.setRequestHeader('Authorization', 'OAuth ' + token);

    xhr.send(null);
	}
});
