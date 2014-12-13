
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
			div.style.zIndex = '1000';
			div.style.visibility = "hidden";
			//---------生成loading.gif----
			var loading = document.createElement('img');
			loading.id = 'loading';
			loading.src = 'https://rawgit.com/IceSuger/Gmail_Plugin/master/images/loading.gif';
			loading.style.zIndex = '1001';
			loading.style.height = '32px';
			loading.style.width = '32px';
			loading.style.visibility = "hidden";
			div.appendChild(loading);
			//---------显示主按钮-------
			var button = document.createElement('button');
			button.id = 'form';
			button.innerHTML = '获取附件列表着';
			button.onclick = function(){
				loading.style.visibility = "visible";
				id = 0;//附件编号（按获取到的顺序）
				total_ids=0;//总共多少个附件，用于结合id来阻塞获取列表的过程，从而给controls init留出时间
				fetchList();
				
				
			}
			div.appendChild(button);
			//---------显示下载按钮-------
			var btndown = document.createElement('button');
			btndown.id = 'btndown';
			btndown.innerHTML = '下载';
			btndown.onclick = function(){
				var id2;
				
				for(id2 = 1; id2<=id; id2++)
				{
					console.log(id2);
					if(document.getElementById("checkbox_" + id2).checked == true)
					{
						var url = 'https://mail.google.com/mail/u/0/?ui=2&ik=undefined&view=att&th=' + message_ids[id2] + '&attid=0.' + part_ids[id2] +'&disp=safe&zw'
						chrome.runtime.sendMessage(url, function(response){
								//document.write(response);
						});
						
					}
				}
			}
			div.appendChild(btndown);
			//---------显示添加按钮-------
			var btninsert = document.createElement('button');
			btninsert.id = 'btninsert';
			btninsert.innerHTML = '添加';
			div.appendChild(btninsert);
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
						//复选框
						var th= document.createElement('th');
						tr.appendChild(th);
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
							var list = JSON.parse(xhr.responseText);
							MsgList = list;
							
	/*				//弄个数组来保存每个message是否处理完的信息
					msgFinished.length=list.resultSizeEstimate;
					for(j=0; j<list.resultSizeEstimate ; j++)
					{
						msgFinished[j] = 0;
					}
					//用于比较的数组
					var compare = new Array(list.resultSizeEstimate);
					for(k=0; k<list.resultSizeEstimate ; k++)
					{
						compare[k] = 1;
					}
	*/				//Fetch information of the attachments with a for loop
					for(i=0; i<list.resultSizeEstimate ; i++)
					{
						getMessage(list.messages[i].id,i);
					}
					//绑定点击事件到全部“添加”按钮
					//setClickForButtons();
					
					//while(i<list.resultSizeEstimate-1){}
					//while(id<total_ids){}
	/*				while(compare.toString() != msgFinished.toString())
					{
					}
		*/			jcLoader().load({type:"js",url:"https://rawgit.com/IceSuger/Gmail_Plugin/master/test/tableinited.js"},function(){
						console.log("controls inited!")
						//document.getElementById('AttachmentsTableTbody2').style.visibility = 'visible';
						//document.getElementById('loading').style.visibility = 'hidden';
					});
					

        } else {
        }
      }
    };

    xhr.open('GET', LIST_FETCH_URL , false);

    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('Authorization', 'OAuth ' + token);

    xhr.send(null);
  }

function getMessage(MessageId,j) {
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
							}
							else{
								
								return
							}
							
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
							//tr.id = "attachment_tr_";
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
								
							
				/*			
							//-----下面是以前的
							document.getElementById('msgatt').innerHTML += '<br /><br />Filename:<br />';
							document.getElementById('msgatt').innerHTML += part.filename ;
							
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
							partid = part.partId;*/
							message_ids[id]=MessageId;
							part_ids[id]=part.partId;
					
							id++;
						}
					}
					//setClickForButtons();
					msgFinished[j] = 1;
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