
var LIST_FETCH_URL = 'https://www.googleapis.com/gmail/v1/users/me/messages';
var MESSAGE_FETCH_URL_prefix = 'https://www.googleapis.com/gmail/v1/users/me/messages/';//+messageId
var ATTACHMENT_FETCH_URL = 'https://www.googleapis.com/gmail/v1/users/me/messages/MessageId/attachments/AttId';
var DRAFT_URL_prefix = 'https://www.googleapis.com/gmail/v1/users/me/drafts/';//+draftId
var token = '';
var div_closed = 1;
/*
//-----------------
if(div_closed == 0)
			{
				div.style.display = 'block';
			}
			else
			{
				div.style.display = 'none';
			}
//--------------------
*/
function InitDiv(){
	var div = document.createElement('div');
			div.id = "GmailAssist";
			document.getElementsByTagName('body')[0].appendChild(div);
			document.getElementsByTagName('body')[0].style.textAlign = 'center';
			div.style.width = '700px';
			div.style.height = '300px';
			//div.style.position = 'fixed';
			div.style.position = 'absolute';
			div.style.background = 'white';
			div.style.marginLeft = 'auto';
			div.style.marginRight = 'auto';
			div.style.top = '50px';
			div.style.zIndex = '1002';
			div.style.visibility = "hidden";
			//---------显示主按钮-------
			var button = document.createElement('button');
			button.id = 'form';
			button.innerHTML = '获取附件列表着';
			div.appendChild(button);
			
			//---------显示table------
			table = document.createElement('table');
			table.id = 'table';
			table.cellpadding="0";
			table.cellspacing="0";
			table.border="0";
			table.class="sortable";
			
			div.appendChild(table);
				var thead = document.createElement('thead');
				table.appendChild(thead);
					var tr= document.createElement('tr');
					thead.appendChild(tr);
						//附件名
						var th= document.createElement('th');
						tr.appendChild(th);
						var h3= document.createElement('h3');
						th.appendChild(h3);
						var node = document.createTextNode("附件名");
						h3.appendChild(node);
						//附件大小
						var th= document.createElement('th');
						tr.appendChild(th);
						var h3= document.createElement('h3');
						th.appendChild(h3);
						var node = document.createTextNode("附件大小");
						h3.appendChild(node);
						//发件人
						var th= document.createElement('th');
						tr.appendChild(th);
						var h3= document.createElement('h3');
						th.appendChild(h3);
						var node = document.createTextNode("发件人");
						h3.appendChild(node);
						//邮件标签
						var th= document.createElement('th');
						tr.appendChild(th);
						var h3= document.createElement('h3');
						th.appendChild(h3);
						var node = document.createTextNode("邮件标签");
						h3.appendChild(node);
						//邮件标题
						var th= document.createElement('th');
						tr.appendChild(th);
						var h3= document.createElement('h3');
						th.appendChild(h3);
						var node = document.createTextNode("邮件标题");
						h3.appendChild(node);
						//时间
						var th= document.createElement('th');
						tr.appendChild(th);
						var h3= document.createElement('h3');
						th.appendChild(h3);
						var node = document.createTextNode("时间");
						h3.appendChild(node);
				var tbody = document.createElement('tbody');
				tbody.id = 'AttachmentsTableTbody';
				table.appendChild(tbody);
				
}

InitDiv();
//===================表格排序相关代码==========================
var fileref=document.createElement("link")
  fileref.setAttribute("rel", "stylesheet")
  fileref.setAttribute("type", "text/css")
  fileref.setAttribute("href", "style.css")
document.getElementsByTagName("head")[0].appendChild(fileref);
	//-----引入js
/*	var sortscript = document.createElement('script');
  sortscript.src = "https://rawgit.com/IceSuger/Gmail_Plugin/master/js/packed.js";
  document.getElementsByTagName('body')[0].appendChild(sortscript);*/
	//-----初始化分页、排序
var sorter = new TINY.table.sorter("sorter");
	sorter.head = "head";
	sorter.asc = "asc";
	sorter.desc = "desc";
	sorter.even = "evenrow";
	sorter.odd = "oddrow";
	sorter.evensel = "evenselected";
	sorter.oddsel = "oddselected";
	sorter.paginate = true;
	sorter.currentid = "currentpage";
	sorter.limitid = "pagelimit";
	sorter.init("table",1);
//===================显示UI大块=================================
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.token != '')
		{
			token = request.token;
			alert(token);
			document.getElementById('GmailAssist').style.visibility = "visible";
			fetchList();
			
      sendResponse({farewell: "goodbye"});
		}
  });
//------------testing------------
function fetchList() {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function(event) {
      if (xhr.readyState == 4) {
        if(xhr.status == 200) {
					
							var list = JSON.parse(xhr.responseText);
							MsgList = list;
					
					//Fetch information of the attachments with a for loop
					for(var i=0; i<list.resultSizeEstimate ; i++)
					{
						getMessage(list.messages[i].id);
					}
					//绑定点击事件到全部“添加”按钮
					//setClickForButtons();

        } else {
          // Request failure: something bad happened
        }
      }
    };

    xhr.open('GET', LIST_FETCH_URL , true);

    xhr.setRequestHeader('Content-Type', 'application/json');
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
							var headers = messageObj.payload.headers;
							var sender;
							var subject='-';
							var labels;
							
					//Fetch information of the attachments with a for loop
					for(i in headers)
					{
						var header = headers[i];
						if(header.name == 'From')
						{
							sender = header.value;
						}
						else if(header.name == 'Subject')
						{
							subject = header.value;
						}
					}
					//for(var i=0; i<parts.length ; i++)
					for(i in parts)
					{
						var part = parts[i];
						if(part.filename)
						{
							var tr = document.createElement('tr');
							//tr.id = "attachment_tr_"+id;
							tr.id = "attachment_tr_";
							document.getElementById('AttachmentsTableTbody').appendChild(tr);
								//附件名
								var td= document.createElement('td');
								tr.appendChild(td);
								var node = document.createTextNode(part.filename);
								td.appendChild(node);
								//附件大小
								var td= document.createElement('td');
								tr.appendChild(td);
								
								part.body.size = Math.ceil(part.body.size * 0.75/1024);
								var node = document.createTextNode(part.body.size + 'K');
								td.appendChild(node);
							
								//发件人
								var td= document.createElement('td');
								tr.appendChild(td);
								var node = document.createTextNode(sender);
								td.appendChild(node);
								
								//标题
								var td= document.createElement('td');
								tr.appendChild(td);
								var node = document.createTextNode(subject);
								td.appendChild(node);
							
							
				/*			
							//-----下面是以前的
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
							message_ids[id]=MessageId;
							part_ids[id]=partid;
					
							id++;*/
						}
					}
					//setClickForButtons();
					
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

//===================获取信息模块======================

document.addEventListener('DOMContentLoaded', function () {
	var form = document.getElementById('form');
  var success = document.getElementById('success');
	var MsgList = null;
	var global;
	var ik;
	var id = 0;
	var message_ids = new Array();
	var part_ids = new Array();
	
	alert('hahahahah');
console.log('doiejoifsoigj');
	
	/*
  form.addEventListener('click', function(event) {
	
    event.preventDefault();
	*/
	form.onclick = function(){
		alert('写不完的温柔');
		//=======下面是引用gmail.min.js的部分，为了获得ik值==============
		chrome.runtime.sendMessage('Hello', function(response){
				ik = response;
		});
		//=======上面是引用gmail.min.js的部分，为了获得ik值==============
	
		fetchList();
	}
  //});

	
	function fetchList() {
    var xhr = new XMLHttpRequest();
		//var msg = gapi.client.gmail.users.messages.get({"id":list.messages[i].id});
    xhr.onreadystatechange = function(event) {
      if (xhr.readyState == 4) {
        if(xhr.status == 200) {
					
							var list = JSON.parse(xhr.responseText);
							MsgList = list;
					
					//Fetch information of the attachments with a for loop
					for(var i=0; i<list.resultSizeEstimate ; i++)
					{
						//document.getElementById('msgatt').innerHTML += '<br />';
						//document.getElementById('msgatt').innerHTML += list.messages[i].id ;
						
						getMessage(list.messages[i].id);
					}
					//绑定点击事件到全部“添加”按钮
					setClickForButtons();

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
							var tr = document.createElement('tr');
							tr.id = "attachment_tr_"+id;
							document.getElementById('AttachmentsTableTbody').appendChild(tr);
								//附件名
								var td= document.createElement('td');
								tr.appendChild(td);
								var node = document.createTextNode(part.filename);
								td.appendChild(node);
								//附件大小
								var td= document.createElement('td');
								tr.appendChild(td);
								var node = document.createTextNode(part.body.size * 0.75);
								td.appendChild(node);
							
							
							
							
							
							//-----下面是以前的
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
							message_ids[id]=MessageId;
							part_ids[id]=partid;
					
							id++;
						}
					}
					setClickForButtons();
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

	function makenewdraft(passed){
		//1.获得当前的draft内容（非raw的字符串）
				//alert(passed);
			//	alert("  " + passed );
				var id_in_func = passed;
				getCurrentDraftID(function ( draftID ){
					console.log('in draft:'+draftID);
					currentdraftid = draftID;
					getCurrentRawDraft(currentdraftid,function ( draftmail ){
						/*console.log(draftmail);*/
						currentDraftString = draftmail;
						//console.log('THE CURRENT DRAFT IS:' + draftmail);
						//2.获得当前message中相应的附件内容和信息（非raw的字符串）
						
						console.log(message_ids);
						console.log(part_ids);
						console.log('id_in_func: '+id_in_func);
						console.log('m-id:' + message_ids[id_in_func] + ' p-id:' + part_ids[id_in_func]);
						
						
						getAttPart(message_ids[id_in_func],part_ids[id_in_func],function( attachpart ){
							//console.log(attachpart);
							partBeingInserted = attachpart;
							/*console.log('THE PART BEING APPENDED TO DRAFT IS:' + partBeingInserted);*/
							//3.把2拼到1上
							var updatedRaw = joinPartToDraft(currentDraftString,partBeingInserted);
							//----alert('joined!');
							//4.更新draft
							updateDraft(currentdraftid,updatedRaw);
							//----alert('Updated your draft!');
						});
					});
				});//存到变量draftID中
	}
	
	function setClickForButtons() {
		var currentdraftid;
		var currentDraftString = '';
		var partBeingInserted = '';
		for(var id2=0;id2 < id;id2++)
		{
			var insrtbtn = document.getElementById('inserts_'+id2);
			insrtOnclick(insrtbtn,id2);
		}
	}
	
	function insrtOnclick(insrtbtn,id2){
		insrtbtn.onclick = function() { 
			makenewdraft(id2);
		}
	}
							
	//---草稿操作相关函数
	function getCurrentDraftID(callback) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function(event) {
      if (xhr.readyState == 4) {
        if(xhr.status == 200) {
					var result = JSON.parse(xhr.responseText);
					draftID = result.drafts[0].id;
					callback(draftID);
				//	console.log(draftID);
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
					partid = parseInt(partid)+2;
					
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

    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function(event) {
      if (xhr.readyState == 4) {
        if(xhr.status == 200) {
					
					alert('添加附件成功！');
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
