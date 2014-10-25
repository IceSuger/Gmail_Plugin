
var google = new OAuth2('google', {
  client_id: '1061800679212-t8pdm7kk16gk47odgu0mt7ov5l9or5g5.apps.googleusercontent.com',
  client_secret: 'Ihu8AKXFttSGBVXA-hOsk5Yf',
  api_scope: 'https://www.googleapis.com/auth/gmail.readonly'
});

google.authorize(function() {

	var LIST_FETCH_URL = 'https://www.googleapis.com/gmail/v1/users/me/messages';
	var ATTACHMENT_FETCH_URL = 'https://www.googleapis.com/gmail/v1/users/me/messages/MessageId/attachments/AttId';

  var form = document.getElementById('form');
  var success = document.getElementById('success');
	var MsgList = null;

  // Hook up the form to create a new task with Google Tasks
  form.addEventListener('submit', function(event) {
    event.preventDefault();
		
		fetchList();
  });

	function fetchList() {
    var xhr = new XMLHttpRequest();
		//var msg = gapi.client.gmail.users.messages.get({"id":list.messages[i].id});
    xhr.onreadystatechange = function(event) {
      if (xhr.readyState == 4) {
        if(xhr.status == 200) {
					
							var list = JSON.parse(xhr.responseText);
							document.getElementById('taskid').innerHTML = '<br />';
							MsgList = list;
					
					//Fetch information of the attachments with a for loop
					for(var i=0; i<list.resultSizeEstimate ; i++)
					{
						//getAttachments('me', list.messages[i].id, callback);
						document.getElementById('taskid').innerHTML += '<br />';
						document.getElementById('taskid').innerHTML += list.messages[i].id ;
						
						//getAttachments('me', msg, callback);
						
						//getAttachmentInfo(list.message[i].id);
					}
			
					form.style.display = 'none';
          success.style.display = 'block';

        } else {
          // Request failure: something bad happened
        }
      }
    };

    xhr.open('GET', LIST_FETCH_URL, true);

    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('Authorization', 'OAuth ' + google.getAccessToken());

    xhr.send(null);
  }
	
	function getAttachments(userId, message, callback) {
		var parts = message.payload.parts;
		for (var i = 0; i < parts.length; i++) {
			var part = parts[i];
			if (part.filename && part.filename.length > 0) {
				var attachId = part.body.attachmentId;
				var request = gapi.client.gmail.users.messages.attachments.get({
					'id': attachId,
					'messageId': message.id,
					'userId': userId
				});
				request.execute(function(attachment) {
					callback(part.filename, part.mimeType, attachment);
				});
			}
		}
	}
	
	function callback(a, b, c) {
		getElementById('taskid').innerHTML = a;
	}
	//function printAttInfo

	/*
	function getAttachmentInfo(MessageId) {
    // Make an XHR
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function(event) {
      if (xhr.readyState == 4) {
        if(xhr.status == 200) {
					
					var parts = MessageId.payload.parts;
					
					
          //var list = JSON.parse(xhr.responseText);
          document.getElementById('taskid').innerHTML += list.messages[0].MessageId;
					
					//Fetch information of the attachments with a for loop
					for(var i=0; i<list.resultSizeEstimate ; i++)
					{
						document.getElementById('taskid').innerHTML += list.messages[0].MessageId;
						//getAttachmentInfo(list.messages[i].MessageId);
					}
					
					form.style.display = 'none';
          success.style.display = 'block';

        } else {
        }
      }
    };
		

    xhr.open('GET', ATTACHMENT_FETCH_URL, true);

    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('Authorization', 'OAuth ' + google.getAccessToken());

    xhr.send(null);
  }
	*/

});

