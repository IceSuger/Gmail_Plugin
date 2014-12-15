
var LIST_FETCH_URL = 'https://www.googleapis.com/gmail/v1/users/me/messages';
var MESSAGE_FETCH_URL_prefix = 'https://www.googleapis.com/gmail/v1/users/me/messages/';//+messageId
var ATTACHMENT_FETCH_URL = 'https://www.googleapis.com/gmail/v1/users/me/messages/MessageId/attachments/AttId';
var DRAFT_URL_prefix = 'https://www.googleapis.com/gmail/v1/users/me/drafts/';//+draftId
var token = '';
var sortingtable;
var id = 0;//附件编号（按获取到的顺序）
var total_ids=0;//总共多少个附件，用于结合id来阻塞获取列表的过程，从而给controls init留出时间
var message_ids = new Array();
var part_ids = new Array();
var msgFinished = new Array();

//添加附件过程
function inser(){
				var id2;
				var name;
				
				for(id2 = idnow; id2<id; id2++)
				{
					if(document.getElementById("checkbox_" + id2).checked == true)
					{
						var name = document.getElementById("attachment_tr_"+id2).getElementsByTagName('td')[1].innerHTML;
						document.getElementById('status_span').innerHTML += '正在添加附件<strong>'+name+'</strong>...';
						makenewdraft(id2);
						document.getElementById('status_span').innerHTML ='附件<strong>'+ name +'</strong>添加成功！';
					}
				}
}

//初始化div，包括table的初始化
function InitDiv(){
	var overlay = document.createElement('div');
	document.getElementsByTagName('body')[0].appendChild(overlay);
			overlay.className = 'overlay';
			overlay.id = 'overlay';
			overlay.style.position= 'absolute';
			overlay.style.top= '0';
			overlay.style.left= '0';
			overlay.style.width= '100%';
			overlay.style.height= '100%';
			overlay.style.zIndex= '999';
			overlay.style.background= '#000000';
			overlay.style.opacity = '0.5';
			overlay.style.visibility = "hidden";
	var div = document.createElement('div');
			div.id = "GmailAssist";
			document.getElementsByTagName('body')[0].appendChild(div);
			div.style.width = '1078px';
			//div.style.height = '500px';
			div.style.border = '5px solid #dedede';
			div.style.borderRadius = '8px';
			div.style.overflow = 'hidden';
			div.style.position = 'fixed';
			div.style.background = 'white';
			div.style.top = '50%';
			div.style.left = '50%';
			div.style.marginLeft = '-539px';
			div.style.marginTop = '-265px';
			div.style.padding = '0px 16px 16px 16px';
			div.style.zIndex = '1000';
			div.style.visibility = "hidden";
		
		//---------显示主按钮-------
			var button = document.createElement('button');
			button.id = 'form';
			button.innerHTML = '获取附件列表';
			button.disabled = true;
			button.className="btn btn-1 btn-1e";
			button.onclick = function(){
				status_span.innerHTML = '正在获取附件列表...';
				div.style.height = '435px';
				id = 0;//附件编号（按获取到的顺序）
				fetchList();
			}
			div.appendChild(button);
		//---------显示下载按钮-------
			var btndown = document.createElement('button');
			btndown.id = 'btndown';
			btndown.disabled = true;
			btndown.className="btn btn-1 btn-1e";
			btndown.innerHTML = '下载';
			btndown.onclick = function(){
				var id2;
				console.log('id2: '+id2+' id: '+id);
				for(id2 = 0; id2<id; id2++)
				{
					var chebox = document.getElementById("checkbox_" + id2);
					//console.log(chebox);
					if(chebox.checked == true)
					{
						var url = 'https://mail.google.com/mail/u/0/?ui=2&ik=undefined&view=att&th=' + message_ids[id2] + '&attid=0.' + part_ids[id2] +'&disp=safe&zw';
						chrome.runtime.sendMessage({url : url}, function(response){
								//document.write(response);
								console.log({url : url});
								console.log('从background返回了');
						});
						
					}
				}
			}
			div.appendChild(btndown);
		//---------显示添加按钮-------
			var btninsert = document.createElement('button');
			btninsert.id = 'btninsert';
			btninsert.disabled = true;
			btninsert.innerHTML = '添加';
			btninsert.className="btn btn-1 btn-1e";
			btninsert.onclick = function(){
				status_span.innerHTML = '';
				for(id2 = 0; id2<id; id2++)
				{
					idnow = id2;
					if(document.getElementById("checkbox_" + id2).checked == true)
					{
						var name = document.getElementById("attachment_tr_"+id2).getElementsByTagName('td')[1].innerHTML;
						document.getElementById('status_span').innerHTML += '正在添加附件<strong>'+name+'</strong>...';
						break;
					}
				}
				setTimeout("inser();",500);
				//inser();
			}
			div.appendChild(btninsert);
		//---------生成状态栏-------
			var status_span = document.createElement('span');
			status_span.id = 'status_span';
			status_span.display = 'block';
			status_span.marginLeft = '10px';
			status_span.marginTop = '18px';
			status_span.innerHTML = '正在等待加载...';
			div.appendChild(status_span);
		//---------显示退出按钮-----
			var btnexit = document.createElement('button');
			btnexit.id = 'btnexit';
			btnexit.innerHTML = 'X';
			btnexit.className="btn btn-1 btn-1e";
			btnexit.onclick = function(){
				div.style.visibility = "hidden";
				overlay.style.visibility = "hidden";
			}
			div.appendChild(btnexit);
								
		//---------显示table------
			sortingtable = document.createElement('table');
			sortingtable.id = 'table_to_sort';
			sortingtable.cellpadding="0";
			sortingtable.cellspacing="0";
			sortingtable.border="0";
			sortingtable.className="sortable";
			
			div.appendChild(sortingtable);
			
				{//table内容
				var thead = document.createElement('thead');
				//thead.id='AttachmentsTableTbody';
				sortingtable.appendChild(thead);
					var tr= document.createElement('tr');
					thead.appendChild(tr);
						//复选框
						var th= document.createElement('th');
						tr.appendChild(th);
						var cb= document.createElement('input');
									cb.id = "toggle_all";
									cb.type = 'checkbox';
									th.appendChild(cb);
									cb.onchange=toggleAll;
						//附件名
						var th= document.createElement('th');
						tr.appendChild(th);
						var h3= document.createElement('h3');
						th.appendChild(h3);
						h3.innerHTML = "附件名";
						//附件大小
						var th= document.createElement('th');
						tr.appendChild(th);
						var h3= document.createElement('h3');
						th.appendChild(h3);
						h3.innerHTML = "附件大小";
						//发件人
						var th= document.createElement('th');
						tr.appendChild(th);
						var h3= document.createElement('h3');
						th.appendChild(h3);
						h3.innerHTML = "发件人";
						//邮件标签
						var th= document.createElement('th');
						tr.appendChild(th);
						var h3= document.createElement('h3');
						th.appendChild(h3);
						h3.innerHTML = "邮件标签";
						//邮件标题
						var th= document.createElement('th');
						tr.appendChild(th);
						var h3= document.createElement('h3');
						th.appendChild(h3);
						var node = document.createTextNode("邮件标题");
						h3.appendChild(node);
						//日期
						var th= document.createElement('th');
						tr.appendChild(th);
						var h3= document.createElement('h3');
						th.appendChild(h3);
						var node = document.createTextNode("日期");
						h3.appendChild(node);
				
				var tbody = document.createElement('tbody');
				sortingtable.appendChild(tbody);
				tbody.id='AttachmentsTableTbody2';
				tbody.style.visibility = 'hidden';
				}
			
}



//===================显示UI大块=================================
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.token != '')
		{
			token = request.token;
			//alert(token);
			document.getElementById('GmailAssist').style.visibility = "visible";
			document.getElementById('overlay').style.visibility = "visible";
      sendResponse({farewell: "goodbye"});
		}
  });
//------------testing------------ 
function fetchList() {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function(event) {
      if (xhr.readyState == 4) {
        if(xhr.status == 200) {
							var i=0;
							var j=0;
							var list = JSON.parse(xhr.responseText);
							MsgList = list;
							id =0;
	/*				//弄个数组来保存每个message是否处理完的信息
					
	*/				//Fetch information of the attachments with a for loop
					for(i=0; i<list.resultSizeEstimate ; i++)
					{
						msgFinished[i]=false;
						getMessage(list.messages[i].id,i);
					}
					
					var time = setTimeout("initCtrls();",4000);
					
					
				/*	
					var flag = false;
					
					
					while(flag == false)
					{
						flag = true;
						for(i in msgFinished)
						{
							console.log(msgFinished+' i='+i);
							console.log('(before)flag='+flag);
							flag = msgFinished[i]&&flag;
							console.log('(after)flag='+flag);
						}
					}
				*/	/*
					jcLoader().load({type:"js",url:"https://rawgit.com/IceSuger/Gmail_Plugin/master/test/tableinited.js"},function(){
						console.log("controls inited!")
						document.getElementById('status_span').innerHTML = '获取附件列表完毕！';
						document.getElementById('AttachmentsTableTbody2').style.visibility = 'visible';
						setTimeout("document.getElementById('status_span').innerHTML = '';",3000);
					});
					*/

        } else if(xhr.status == 401){
					document.getElementById('status_span').innerHTML = '未成功授权，请重新授权后再试！';
        }
				else{
				}
      }
    };

    xhr.open('GET', LIST_FETCH_URL , true);

    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('Authorization', 'OAuth ' + token);

    xhr.send(null);
  }

function initCtrls(){
	var flag = true;
						for(i in msgFinished)
						{
							//console.log(msgFinished+' i='+i);
							//console.log('(before)flag='+flag);
							flag = msgFinished[i]&&flag;
							//console.log('(after)flag='+flag);
						}
						if(flag==false)
						{
							console.log('再等会');
							setTimeout("initCtrls();",2500);
						}
						else{
	jcLoader().load({type:"js",url:"https://rawgit.com/IceSuger/Gmail_Plugin/master/test/tableinited.js"},function(){
						console.log("controls inited!")
						document.getElementById('status_span').innerHTML = '获取附件列表完毕！';
						
						//document.getElementById('AttachmentsTableTbody2').style.visibility = 'visible';
						
						setTimeout("document.getElementById('status_span').innerHTML = '';",3000);
					});
			}
}


function getMessage(MessageId,j) {//j为在msgFinished中的下标
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
							var labels = messageObj.labelIds;
							var date;
							
							if(parts)
							{
								total_ids += parts.length;
								console.log(total_ids);
							
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
							if(header.value)
							{
								subject = header.value;
							}
						}
						else if(header.name == 'Date')
						{
							date = header.value;
						}
					}
						//for(var i=0; i<parts.length ; i++)
						for(i in parts)
						{
							
							var part = parts[i];
							if(part.filename)
							{
								var tr = document.createElement('tr');
								tr.id = "attachment_tr_"+id;
								document.getElementById('table_to_sort').getElementsByTagName('tbody')[0].appendChild(tr);
									//复选框
									var td= document.createElement('td');
									tr.appendChild(td);
									
									var cb= document.createElement('input');
									cb.id = "checkbox_" + id;
									cb.type = 'checkbox';
									td.appendChild(cb);
									//附件名
									var td= document.createElement('td');
									tr.appendChild(td);
									td.innerHTML = part.filename;
									//附件大小
									var td= document.createElement('td');
									tr.appendChild(td);
									part.body.size = Math.ceil(part.body.size * 0.75/1024);
									td.innerHTML = part.body.size + 'K';
								
									//发件人
									var td= document.createElement('td');
									tr.appendChild(td);
									td.innerHTML = sender;
									
									//标签
									var td= document.createElement('td');
									tr.appendChild(td);
									td.innerHTML = labels;
									
									//标题
									var td= document.createElement('td');
									tr.appendChild(td);
									var a = document.createElement('a');
									td.appendChild(a);
									a.href = 'https://mail.google.com/mail/u/0/#all/' + MessageId;
									a.target = "_blank";
									a.innerHTML = subject;
									
									//日期
									var td= document.createElement('td');
									tr.appendChild(td);
									var d = new Date(Date.parse(date));
									td.innerHTML = d.toLocaleDateString();
									
				
								message_ids[id]=MessageId;
								part_ids[id]=part.partId;
						
								id++;
							}
						}
						//setClickForButtons();
					}
					msgFinished[j] = true;
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

//---草稿操作函数
function makenewdraft(passed){
		//1.获得当前的draft内容（非raw的字符串）
				var id_in_func = passed;
				getCurrentDraftID(function ( draftID ){
					console.log('in draft:'+draftID);
					currentdraftid = draftID;
					getCurrentRawDraft(currentdraftid,function ( draftmail ){
						currentDraftString = draftmail;
						//2.获得当前message中相应的附件内容和信息（非raw的字符串）
						console.log(message_ids[id_in_func]+' '+part_ids[id_in_func])
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

    xhr.open('GET', DRAFT_URL_prefix, false);

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

    xhr.open('GET', DRAFT_URL_prefix + DraftId + '?format=raw', false);

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

    xhr.open('GET', MESSAGE_FETCH_URL_prefix + MessageId + '?format=raw', false);

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

    xhr.open('GET', DRAFT_URL_prefix, false);

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
					
					console.log('添加附件成功！');
        } else {
          // Request failure: something bad happened
        }
      }
    };

    xhr.open('PUT', DRAFT_URL_prefix + DraftId, false);

    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('Authorization', 'OAuth ' + token);

    xhr.send(json);
  }

//全选功能
function toggleAll() {
  var checked = document.getElementById('toggle_all').checked;
  for (var k = 0; k < id; k++) {
    document.getElementById("checkbox_" + k).checked = checked;
  }
}
//动态载入js，css并执行回调
var jcLoader = function(){    
   
    var dc = document;    
   
    function createScript(url,callback){    
        var urls = url.replace(/[,]\s*$/ig,"").split(",");    
        var scripts = [];    
        var completeNum = 0;    
        for( var i = 0; i < urls.length; i++ ){    
   
            scripts[i] = dc.createElement("script");    
            scripts[i].type = "text/javascript";    
            scripts[i].src = urls[i];    
            dc.getElementsByTagName("head")[0].appendChild(scripts[i]);    
   
            if(!callback instanceof Function){return;}    
   
            if(scripts[i].readyState){    
                scripts[i].onreadystatechange = function(){    
   
                    if( this.readyState == "loaded" || this.readyState == "complete" ){    
                        this.onreadystatechange = null;    
                        completeNum++;    
                        completeNum >= urls.length?callback():"";    
                    }    
                }    
            }    
            else{    
                scripts[i].onload = function(){    
                    completeNum++;    
                    completeNum >= urls.length?callback():"";    
                }    
            }    
   
        }    
   
    }    
   
    function createLink(url,callback){    
        var urls = url.replace(/[,]\s*$/ig,"").split(",");    
        var links = [];    
        for( var i = 0; i < urls.length; i++ ){    
            links[i] = dc.createElement("link");    
            links[i].rel = "stylesheet";    
            links[i].href = urls[i];    
            dc.getElementsByTagName("head")[0].appendChild(links[i]);    
        }    
        callback instanceof Function?callback():"";    
    }    
    return{    
        load:function(option,callback){    
            var _type = "",_url = "";    
            var _callback = callback    
            option.type? _type = option.type:"";    
            option.url? _url = option.url:"";    
            typeof option.filtration == "boolean"? filtration = option.filtration:"";    
   
            switch(_type){    
                case "js":    
                case "javascript": createScript(_url,_callback); break;    
                case "css": createLink(_url,_callback); break;    
            }    
   
            return this;    
        }    
    }    
}  

function tellIfLoaded(){
	if(document.getElementById('form').disabled == true)
		document.getElementById('status_span').innerHTML ='呜呜呜，Gmail助手加载失败了，请刷新网页重试~';
}

InitDiv();
setTimeout("tellIfLoaded();",20000);