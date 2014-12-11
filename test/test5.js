
var LIST_FETCH_URL = 'https://www.googleapis.com/gmail/v1/users/me/messages';
var MESSAGE_FETCH_URL_prefix = 'https://www.googleapis.com/gmail/v1/users/me/messages/';//+messageId
var ATTACHMENT_FETCH_URL = 'https://www.googleapis.com/gmail/v1/users/me/messages/MessageId/attachments/AttId';
var DRAFT_URL_prefix = 'https://www.googleapis.com/gmail/v1/users/me/drafts/';//+draftId
var token = '';
var sortingtable;
var TINY={};
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



//===================表格排序相关代码==========================
var fileref=document.createElement("link");
	fileref.rel = "stylesheet";
	fileref.href = "https://rawgit.com/IceSuger/Gmail_Plugin/master/style.css";
document.getElementsByTagName("head")[0].appendChild(fileref);

	

//初始化表格着
function InitDiv(){
	var sorter = new TINY.table.sorter("sorter");
	
	var div = document.createElement('div');
			div.id = "GmailAssist";
			document.getElementsByTagName('body')[0].appendChild(div);
			document.getElementsByTagName('body')[0].style.textAlign = 'center';
			div.style.width = '700px';
			div.style.height = '300px';
			div.style.overflow = 'auto';
			div.style.position = 'fixed';
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
			sortingtable = document.createElement('table');
			sortingtable.id = 'table_to_sort';
			sortingtable.cellpadding="0";
			sortingtable.cellspacing="0";
			sortingtable.border="0";
			sortingtable.className="sortable";
			
			controls = document.createElement('div');
			controls.id = 'controls';
			
			div.appendChild(sortingtable);
			div.appendChild(controls);
			
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
			/*			//邮件标题
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
			*/	
				var tbody = document.createElement('tbody');
				sortingtable.appendChild(tbody);
				tbody.id='AttachmentsTableTbody2';
				}
			
				{//controls内容
					var perpage = document.createElement('div');
					controls.appendChild(perpage);
					{
						var select = document.createElement('select');
						select.onchange = sorter.size(this.value);
						perpage.appendChild(select);
							var option = document.createElement('option');
							option.value = '5';
							option.innerHTML = 5;
							select.appendChild(option);
							
							var option = document.createElement('option');
							option.value = '10';
							option.selected="selected";
							option.innerHTML = 10;
							select.appendChild(option);
							
							var option = document.createElement('option');
							option.value = '15';
							option.innerHTML = 15;
							select.appendChild(option);
						
						var span = document.createElement('span');
						span.innerHTML = "项每页";
						perpage.appendChild(span);
					}
					var navigation = document.createElement('div');
					controls.appendChild(navigation);
					{
						var first = document.createElement('img');
						first.src="https://rawgit.com/IceSuger/Gmail_Plugin/master/images/first.gif";
						first.width="16";
						first.height="16";
						first.alt="First Page";
						first.onclick=sorter.move(-1,true);
						navigation.appendChild(first);
						
						var previous = document.createElement('img');
						previous.src="https://rawgit.com/IceSuger/Gmail_Plugin/master/images/first.gif";
						previous.width="16";
						previous.height="16";
						previous.alt="First Page";
						previous.onclick=sorter.move(-1);
						navigation.appendChild(previous);
						
						var next = document.createElement('img');
						next.src="https://rawgit.com/IceSuger/Gmail_Plugin/master/images/next.gif";
						next.width="16";
						next.height="16";
						next.alt="First Page";
						next.onclick=sorter.move(1);
						navigation.appendChild(next);
						
						var last = document.createElement('img');
						last.src="https://rawgit.com/IceSuger/Gmail_Plugin/master/images/last.gif";
						last.width="16";
						last.height="16";
						last.alt="Last Page";
						last.onclick=sorter.move(1,true);
						navigation.appendChild(last);
					}
					var text = document.createElement('div');
					controls.appendChild(text);
					{
						var node = document.createTextNode("第");
						text.appendChild(node);
						
						var currentpage = document.createElement('span');
						currentpage.id="currentpage";
						text.appendChild(currentpage);
						
						var node = document.createTextNode("/");
						text.appendChild(node);
						
						var pagelimit = document.createElement('span');
						pagelimit.id="pagelimit";
						text.appendChild(pagelimit);
						
						var node = document.createTextNode("页");
						text.appendChild(node);
					}
				}
}

InitDiv();	

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
								
								//标题
								var td= document.createElement('td');
								tr.appendChild(td);
								td.innerHTML = subject;
							
							
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
	
//===================表格排序分页的script.js全部内容===
{


function T$(i){return document.getElementById(i)}
function T$$(e,p){return p.getElementsByTagName(e)}

TINY.table=function(){
	function sorter(n){this.n=n; this.pagesize=10; this.paginate=0}
	sorter.prototype.init=function(e,f){
		var t=ge(e), i=0; this.e=e; this.l=t.r.length; t.a=[];
		t.h=T$$('thead',T$(e))[0].rows[0]; t.w=t.h.cells.length;
		for(i;i<t.w;i++){
			var c=t.h.cells[i];
			if(c.className!='nosort'){
				c.className=this.head; c.onclick=new Function(this.n+'.wk(this.cellIndex)')
			}
		}
		for(i=0;i<this.l;i++){t.a[i]={}}
		if(f!=null){var a=new Function(this.n+'.wk('+f+')'); a()}
		if(this.paginate){this.g=1; this.pages()}
	};
	sorter.prototype.wk=function(y){
		var t=ge(this.e), x=t.h.cells[y], i=0;
		for(i;i<this.l;i++){
      t.a[i].o=i; var v=t.r[i].cells[y]; t.r[i].style.display='';
      while(v.hasChildNodes()){v=v.firstChild}
      t.a[i].v=v.nodeValue?v.nodeValue:''
    }
		for(i=0;i<t.w;i++){var c=t.h.cells[i]; if(c.className!='nosort'){c.className=this.head}}
		if(t.p==y){t.a.reverse(); x.className=t.d?this.asc:this.desc; t.d=t.d?0:1}
		else{t.p=y; t.a.sort(cp); t.d=0; x.className=this.asc}
		var n=document.createElement('tbody');
		for(i=0;i<this.l;i++){
			var r=t.r[t.a[i].o].cloneNode(true); n.appendChild(r);
			r.className=i%2==0?this.even:this.odd; var cells=T$$('td',r);
			for(var z=0;z<t.w;z++){cells[z].className=y==z?i%2==0?this.evensel:this.oddsel:''}
		}
		t.replaceChild(n,t.b); if(this.paginate){this.size(this.pagesize)}
	};
	sorter.prototype.page=function(s){
		var t=ge(this.e), i=0, l=s+parseInt(this.pagesize);
		if(this.currentid&&this.limitid){T$(this.currentid).innerHTML=this.g}
		for(i;i<this.l;i++){t.r[i].style.display=i>=s&&i<l?'':'none'}
	};
	sorter.prototype.move=function(d,m){
		var s=d==1?(m?this.d:this.g+1):(m?1:this.g-1);
		if(s<=this.d&&s>0){this.g=s; this.page((s-1)*this.pagesize)}
	};
	sorter.prototype.size=function(s){
		this.pagesize=s; this.g=1; this.pages(); this.page(0);
		if(this.currentid&&this.limitid){T$(this.limitid).innerHTML=this.d}
	};
	sorter.prototype.pages=function(){this.d=Math.ceil(this.l/this.pagesize)};
	function ge(e){var t=T$(e); t.b=T$$('tbody',t)[0]; t.r=t.b.rows; return t};
	function cp(f,c){
		var g,h; f=g=f.v.toLowerCase(), c=h=c.v.toLowerCase();
		var i=parseFloat(f.replace(/(\$|\,)/g,'')), n=parseFloat(c.replace(/(\$|\,)/g,''));
		if(!isNaN(i)&&!isNaN(n)){g=i,h=n}
		i=Date.parse(f); n=Date.parse(c);
		if(!isNaN(i)&&!isNaN(n)){g=i; h=n}
		return g>h?1:(g<h?-1:0)
	};
	return{sorter:sorter}
}();
}

//-----初始化分页、排序

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
	sorter.init("table_to_sort",1);