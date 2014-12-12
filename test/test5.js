
var LIST_FETCH_URL = 'https://www.googleapis.com/gmail/v1/users/me/messages';
var MESSAGE_FETCH_URL_prefix = 'https://www.googleapis.com/gmail/v1/users/me/messages/';//+messageId
var ATTACHMENT_FETCH_URL = 'https://www.googleapis.com/gmail/v1/users/me/messages/MessageId/attachments/AttId';
var DRAFT_URL_prefix = 'https://www.googleapis.com/gmail/v1/users/me/drafts/';//+draftId
var token = '';
var sortingtable;
	

//===================表格排序相关代码==========================
var fileref=document.createElement("link");
			fileref.rel = "stylesheet";
			fileref.href = "https://rawgit.com/IceSuger/Gmail_Plugin/master/style.css";
			document.getElementsByTagName("head")[0].appendChild(fileref);



//初始化div，包括table的初始化
function InitDiv(){
	var div = document.createElement('div');
			div.id = "GmailAssist";
			document.getElementsByTagName('body')[0].appendChild(div);
			div.style.width = '1200px';
			div.style.height = '500px';
			div.style.overflow = 'auto';
			div.style.position = 'fixed';
			div.style.background = 'white';
			//div.style.marginLeft = 'auto';
			//div.style.marginRight = 'auto';
			div.style.margin = '0 auto';
			//div.style.top = '90px';
			div.style.zIndex = '1002';
			div.style.visibility = "hidden";
			//---------显示主按钮-------
			var button = document.createElement('button');
			button.id = 'form';
			button.innerHTML = '获取附件列表着';
			div.appendChild(button);
			//---------显示退出按钮-----
			var btnexit = document.createElement('button');
			btnexit.id = 'btnexit';
			btnexit.innerHTML = 'X';
			btnexit.onclick = function(){
				div.style.visibility = "hidden";
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
						//时间
						var th= document.createElement('th');
						tr.appendChild(th);
						var h3= document.createElement('h3');
						th.appendChild(h3);
						var node = document.createTextNode("时间");
						h3.appendChild(node);
				
				var tbody = document.createElement('tbody');
				sortingtable.appendChild(tbody);
				tbody.id='AttachmentsTableTbody2';
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
					jcLoader().load({type:"js",url:"https://rawgit.com/IceSuger/Gmail_Plugin/master/test/tableinited.js"},function(){
						alert("controls inited!")
					});

        } else {
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
							var labels = messageObj.labelIds;
							var date;
							
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
							//tr.id = "attachment_tr_"+id;
							tr.id = "attachment_tr_";
							document.getElementById('table_to_sort').getElementsByTagName('tbody')[0].appendChild(tr);
								//附件名
								var td= document.createElement('td');
								tr.appendChild(td);
								td.innerHTML = part.filename;
								//附件大小
								var td= document.createElement('td');
								tr.appendChild(td);
								
								part.body.size = Math.ceil(part.body.size * 0.75/1024);
								td.innerHTML = part.body.size + 'K';
						//		var node = document.createTextNode(part.body.size + 'K');
						//		td.appendChild(node);
							
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
								
								//时间
								var td= document.createElement('td');
								tr.appendChild(td);
								td.innerHTML = date;
							
							
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

	
InitDiv();