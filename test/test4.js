
var LIST_FETCH_URL = 'https://www.googleapis.com/gmail/v1/users/me/messages';
var MESSAGE_FETCH_URL_prefix = 'https://www.googleapis.com/gmail/v1/users/me/messages/';//+messageId
var ATTACHMENT_FETCH_URL = 'https://www.googleapis.com/gmail/v1/users/me/messages/MessageId/attachments/AttId';
var DRAFT_URL_prefix = 'https://www.googleapis.com/gmail/v1/users/me/drafts/';//+draftId



//===================授权/取消授权模块======================
var google = new OAuth2('google', {
  client_id: '1061800679212-t8pdm7kk16gk47odgu0mt7ov5l9or5g5.apps.googleusercontent.com',
  client_secret: 'Ihu8AKXFttSGBVXA-hOsk5Yf',
  api_scope: 'https://www.googleapis.com/auth/gmail.modify'
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
	var id = 0;
	//var draftID;
	//var currentdraftid;
	token = google.getAccessToken();
	
  form.addEventListener('submit', function(event) {
    event.preventDefault();
		
		//=======下面是引用gmail.min.js的部分，为了获得ik值==============
	chrome.runtime.sendMessage('Hello', function(response){
			ik = response; 
	});
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
		//token = google.getAccessToken();
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
							var partid ;
							
							
					//Fetch information of the attachments with a for loop
					//for(var i=0; i<parts.length ; i++)
					for(i in parts)
					{
						var part = parts[i];
						if(part.filename)
						{
							document.getElementById('msgatt').innerHTML += '<br /><br />Filename:<br />';
							document.getElementById('msgatt').innerHTML += part.filename ;
							partid = part.partId;
							document.getElementById('msgatt').innerHTML += '<br />';
							
							var downbtn = document.createElement("a");
							var insertbtn = document.createElement("button");
							var node=document.createTextNode("下载");
							var node2=document.createTextNode("添加");
							
							downbtn.appendChild(node);
							insertbtn.appendChild(node2);
							document.getElementById("msgatt").appendChild(downbtn);
							document.getElementById("msgatt").appendChild(insertbtn);
							
							downbtn.href = 'https://mail.google.com/mail/u/0/?ui=2&ik=' + ik + '&view=att&th=' + MessageId + '&attid=0.' + partid +'&disp=safe&zw';
							downbtn.target = "nammme";
							
							
							insertbtn.id = "inserts_"+id;
							
					//document.getElementById('inserts_'+id).onclick = function(){
			//		$('#button_inserts_'+id).onclick = function(){
			//			alert('what happend?');
			//			console.log('mesID:'+MessageId+' partid:'+partid+'\r\n');
			//		}
					
						document.getElementById('inserts_'+id).onclick=function (){
									//1.获得当前的draft内容（非raw的字符串）
									var currentdraftid;
									var currentDraftString = '';
									var partBeingInserted = '';

									getCurrentDraftID(function ( draftID ){
										console.log('in func:'+draftID);
										currentdraftid = draftID;
										/*console.log('drafid:'+draftID);*/
										getCurrentRawDraft(currentdraftid,function ( draftmail ){
											/*console.log(draftmail);*/
											currentDraftString = draftmail;
											console.log('THE CURRENT DRAFT IS:' + draftmail);
												//2.获得当前message中相应的附件内容和信息（非raw的字符串）
												getAttPart(MessageId,partid,function( attachpart ){
													//console.log(attachpart);
													partBeingInserted = attachpart;
													/*console.log('THE PART BEING APPENDED TO DRAFT IS:' + partBeingInserted);*/
													var updatedRaw = joinPartToDraft(currentDraftString,partBeingInserted);
													//----alert('joined!');
												//4.更新draft
													updateDraft(currentdraftid,updatedRaw);
													//----alert('Updated your draft!');
												});
												//3.把2拼到1上
													
										});
										
									});//存到变量draftID中
									
				/*					//3.把2拼到1上
									var updatedRaw = joinPartToDraft(currentDraftString,partBeingInserted);
									//4.更新draft
									updateDraft(currentdraftid,updatedRaw);
				*/				
						}
					
							id++;
							
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
/*
	function makemail() {		
									//1.获得当前的draft内容（非raw的字符串）
									
									var currentDraftString = getCurrentRawDraft(currentdraftid);
									console.log('drafid:'+currentdraftid);
									console.log(currentDraftString);
				/*					//2.获得当前message中相应的附件内容和信息（非raw的字符串）
									var partBeingInserted = getAttPart(MessageId,partid);
									//3.把2拼到1上
									var updatedRaw = joinPartToDraft(currentDraftString,partBeingInserted);
									//4.更新draft
									updateDraft(currentdraftid,updatedRaw);
								
	}*/

	function getCurrentDraftID(callback) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function(event) {
      if (xhr.readyState == 4) {
        if(xhr.status == 200) {
					var result = JSON.parse(xhr.responseText);
					draftID = result.drafts[0].id;
					callback(draftID);
				//	console.log(draftID);
				//	return draftID;
        } else {}
      }
    };

    xhr.open('GET', DRAFT_URL_prefix, true);

    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('Authorization', 'OAuth ' + token);

    xhr.send(null);
  }
	
	function getCurrentRawDraft(DraftId,callback) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function(event) {
      if (xhr.readyState == 4) {
        if(xhr.status == 200) {
					var oldDraft = JSON.parse(xhr.responseText);
					var raw = oldDraft.message.raw;
					callback( atob(raw.replace(/-/g, '+').replace(/_/g, '/')) );
							
        } else {
          // Request failure: something bad happened
        }
      }
    };

    xhr.open('GET', DRAFT_URL_prefix + DraftId + '?format=raw', true);

    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('Authorization', 'OAuth ' + token);

    xhr.send(null);
  }
	
	function getAttPart(MessageId,partid,callback) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function(event) {
      if (xhr.readyState == 4) {
        if(xhr.status == 200) {
					var rawmail = JSON.parse(xhr.responseText);
					//console.log(rawmail);
					var raw = rawmail.raw;
					
					var mail = atob(raw.replace(/-/g, '+').replace(/_/g, '/'));
					//console.log(mail);
					var boundstartpos = mail.indexOf('boundary=')+9;
					var boundary = mail.substring(boundstartpos, mail.indexOf('\r',boundstartpos));
					if(boundary.indexOf('"') == 0)
					{
						boundary = boundary.substring(1,boundary.length-1);
					}
					//console.log(boundary);
					var mailparts = mail.split(boundary);
			/*		for(x in mailparts)
					{
						console.log(mailparts[x]);
					}
			*/		partid = parseInt(partid)+2;
					//console.log('partid: '+partid);
					//var partofpart = mailparts[3+partid].split('\n\r');
					
					//callback ( partofpart[0] + 'X-Attachment-Id: f_' + partid + partofpart[1] );
					callback ( 'X-Attachment-Id: f_' + MessageId+partid + mailparts[partid] );
							
        } else {
          // Request failure: something bad happened
        }
      }
    };

    xhr.open('GET', MESSAGE_FETCH_URL_prefix + MessageId + '?format=raw', true);

    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('Authorization', 'OAuth ' + token);

    xhr.send(null);
  }
	
	function joinPartToDraft(currentDraftString,partBeingInserted) {
		var prepart = currentDraftString.substring(0,currentDraftString.length-2);
		
		var boundstartpos = currentDraftString.indexOf('boundary=')+9;
		var boundary = currentDraftString.substring(boundstartpos, currentDraftString.indexOf('\r',boundstartpos));
		
		newdraft = prepart + '\r\n' + partBeingInserted + boundary +'--';
		return btoa(newdraft).replace(/\//g, '_').replace(/\+/g, '-');
	}
	
	function makeUpdatedDraft(oldEmail) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function(event) {
      if (xhr.readyState == 4) {
        if(xhr.status == 200) {
					var drafts = JSON.parse(xhr.responseText);
					var draftID = drafts[0].id;
					return btoa(updatedRaw).replace(/\//g, '_').replace(/\+/g, '-');
        } else {}
      }
    };

    xhr.open('GET', DRAFT_URL_prefix, true);

    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('Authorization', 'OAuth ' + token);
    xhr.send(null);
  }
	
	function updateDraft(DraftId,updatedRaw) {
		var newdraft = new Object(); 
		newdraft.message = new Object(); 
		newdraft.message.raw = updatedRaw; 
		var json = JSON.stringify(newdraft); 

	//	var args = '{"message": {"raw": '+ updatedRaw + '}}';
		//----alert('updating！！！');
		//alert(args);
		//console.log(args);
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function(event) {
      if (xhr.readyState == 4) {
        if(xhr.status == 200) {
					
					alert('成功了骂的！！！');
        } else {
          // Request failure: something bad happened
        }
      }
    };

    xhr.open('PUT', DRAFT_URL_prefix + DraftId, true);

    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('Authorization', 'OAuth ' + token);

    xhr.send(json);
  }
});
