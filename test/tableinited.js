//-----初始化分页、排序
alert('骂的 根本不执行？');
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
	
	
	alert('mlgb');
	
var controls = document.getElementById('controls');
if(!controls)
{
			var controls = document.createElement('div');
			controls.id = 'controls';
			document.getElementById('GmailAssist').appendChild(controls);
			
		alert('mb');
		
	{//controls内容
					var perpage = document.createElement('div');
					controls.appendChild(perpage);
					{
						var select = document.createElement('select');
						select.id = 'selec';
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
						first.onclick="sorter.move(-1,true)";
						navigation.appendChild(first);
						
						var previous = document.createElement('img');
						previous.src="https://rawgit.com/IceSuger/Gmail_Plugin/master/images/previous.gif";
						previous.width="16";
						previous.height="16";
						previous.alt="First Page";
						previous.onclick="javascript:sorter.move(-1)";
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

sorter.init("table_to_sort",1);				

var pagesize = document.getElementById("selec").value;
alert(pagesize);
select.onchange = sorter.size(pagesize);





	alert('NOW THRER IS A CONTROLS!');