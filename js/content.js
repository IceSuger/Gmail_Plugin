var LIST_FETCH_URL = 'https://www.googleapis.com/gmail/v1/users/me/messages';
var MESSAGE_FETCH_URL_prefix = 'https://www.googleapis.com/gmail/v1/users/me/messages/';//+messageId
var DRAFT_URL_prefix = 'https://www.googleapis.com/gmail/v1/users/me/drafts/';//+draftId
var token = '';
var sortingTable;
var id = 0;//附件编号（按获取到的顺序）
var id_show = 0;//附件编号（显示出来的列表行的编号，经过filter后生成的）
var msgFinished = [];
var allContent = [];
var visibleRows = [];
var msgNow = 0;
var not_include_content_pics = true;
var filterValue;//搜索框输入值

//添加附件过程
function insertAtt() {
    var id2;

    for (id2 = idnow; id2 < visibleRows.length; id2++) {
        if (document.getElementById("checkbox_" + id2).checked == true) {
            var name = document.getElementById("attachment_tr_" + id2).getElementsByTagName('td')[1].innerHTML;
            document.getElementById('status_span').innerHTML = chrome.i18n.getMessage("hintInserting", name);//'正在插入附件<strong>'+name+'</strong>...';
            document.getElementById('load1').style.display = 'inline-block';
            makenewdraft(id2, name);
            //document.getElementById('status_span').innerHTML ='附件<strong>'+ name +'</strong>已成功插入至最新草稿！';
            document.getElementById('load1').style.display = 'none';
        }
    }
}

//初始化div，包括table的初始化
function InitDiv() {
    var overlay = document.createElement('div');
    document.getElementsByTagName('body')[0].appendChild(overlay);
    overlay.className = 'overlay';
    overlay.id = 'overlay';

    /*overlay.style.position = 'absolute';
     overlay.style.top = '0';
     overlay.style.left = '0';
     overlay.style.width = '100%';
     overlay.style.height = '100%';
     overlay.style.zIndex = '999';
     overlay.style.background = '#000000';
     overlay.style.opacity = '0.5';
     overlay.style.visibility = "hidden";*/ //这一段移到了main-UI-style.css里了

    var div = document.createElement('div');
    div.id = "GmailAssist";
    div.style.display = "none";
    document.getElementsByTagName('body')[0].appendChild(div);
    /*div.style.width = '1078px';
     //div.style.height = '500px';
     div.style.border = '5px solid #dedede';
     div.style.borderRadius = '8px';
     div.style.overflow = 'auto';
     div.style.position = 'fixed';
     div.style.background = 'white';
     div.style.top = '50%';
     div.style.left = '50%';
     div.style.marginLeft = '-539px';
     div.style.marginTop = '-300px';
     div.style.padding = '0px 16px 16px 16px';
     div.style.zIndex = '1000';
     div.style.visibility = "hidden";*/ //这一段也写在main-UI-style.css里了

    //----给overlay添加onclick事件-----
    overlay.onclick = function () {
        div.style.visibility = "hidden";
        //sortingtable.style.visibility = "hidden";
        overlay.style.visibility = "hidden";
        document.getElementById('table_to_sort').getElementsByTagName('tbody')[0].style.visibility = 'hidden';
    };

    //---------显示主按钮-------
    var button = document.createElement('button');
    button.id = 'form';
    button.innerHTML = chrome.i18n.getMessage("fetchAttsList");//'获取附件列表';
    button.disabled = true;
    button.className = "btn btn-1 btn-1e";
    button.onclick = function () {

        document.getElementById('table_to_sort').getElementsByTagName('tbody')[0].innerHTML = '';
        document.getElementById('table_to_sort').getElementsByTagName('tbody')[0].style.visibility = 'hidden';

        status_span.innerHTML = chrome.i18n.getMessage("hintListing");//'正在获取附件列表...(您可以先暂时关闭助手界面，继续其他操作，获取成功后会自动弹出此界面)';
        document.getElementById('load1').style.display = 'inline-block';
        div.style.minHeight = '435px';
        id = 0;//附件编号（按获取到的顺序）
        msgNow = 0;
        not_include_content_pics = !document.getElementById('includeContentPics').checked;
        fetchNextList(null);//原本是fetchList();现在统一到fetchNextList这个函数上了。//将获取到的东西都存到数组allContent中

    };
    div.appendChild(button);
    //---------显示下载按钮-------
    var btndown = document.createElement('button');
    btndown.id = 'btndown';
    btndown.disabled = true;
    btndown.className = "btn btn-1 btn-1e";
    btndown.innerHTML = chrome.i18n.getMessage("download");//'下载';
    btndown.onclick = function () {
        var id2 = 0;
        console.log('id2: ' + id2 + ' id: ' + id);
        for (id2 = 0; id2 < visibleRows.length; id2++) {
            var chebox = document.getElementById("checkbox_" + id2);
            //console.log(chebox);
            if (chebox.checked == true) {
                var url = 'https://mail.google.com/mail/u/0/?ui=2&ik=undefined&view=att&th=' + visibleRows[id2].split('|-|')[6] + '&attid=0.' + visibleRows[id2].split('|-|')[7] + '&disp=safe&zw';
                chrome.runtime.sendMessage({url: url}, function (response) {
                    //document.write(response);
                    console.log({url: url});
                    console.log('从background返回了');
                });

            }
        }
    };
    div.appendChild(btndown);
    //---------显示添加按钮-------
    var btninsert = document.createElement('button');
    btninsert.id = 'btninsert';
    btninsert.disabled = true;
    btninsert.innerHTML = chrome.i18n.getMessage("insertToDraft");//'插入草稿';
    btninsert.className = "btn btn-1 btn-1e";
    btninsert.onclick = function () {
        status_span.innerHTML = '';
        for (id2 = 0; id2 < visibleRows.length; id2++) {
            idnow = id2;
            if (document.getElementById("checkbox_" + id2).checked == true) {
                var name = document.getElementById("attachment_tr_" + id2).getElementsByTagName('td')[1].innerHTML;
                document.getElementById('status_span').innerHTML = chrome.i18n.getMessage("hintInserting", name);//'正在插入附件<strong>'+name+'</strong>...';
                document.getElementById('load1').style.display = 'inline-block';
                break;
            }
        }
        setTimeout("insertAtt();", 500);
        //inser();
    };
    div.appendChild(btninsert);
    //---------生成本地搜索按钮-----
    var localsearch = document.createElement('button');
    div.appendChild(localsearch);
    localsearch.id = 'localsearch';
    localsearch.innerHTML = chrome.i18n.getMessage("searchTheResults");//'在结果中搜索';
    localsearch.className = "btn btn-1 btn-1e";
    localsearch.onclick = function () {
        document.getElementById('table_to_sort').getElementsByTagName('tbody')[0].innerHTML = '';
        document.getElementById('table_to_sort').getElementsByTagName('tbody')[0].style.visibility = 'hidden';
        filterRows();//根据搜索框，过滤不显示的
        showRows();//根据数组show_thisrow决定是否显示当前行
        document.getElementById('status_span').innerHTML = chrome.i18n.getMessage("finishListing");//'获取附件列表完毕！';
        document.getElementById('table_to_sort').getElementsByTagName('tbody')[0].style.visibility = 'visible';
        /* jcLoader().load({
         type: "js",
         url: chrome.extension.getURL("../injected-js/tableInited.js")
         }, function () {*/
        initPageAndSorting();
        console.log("controls inited!");
        alert('controls inited?!');

        document.getElementById('status_span').innerHTML = chrome.i18n.getMessage("finishListing");//'获取附件列表完毕！';
        document.getElementById('load1').style.display = 'none';
        document.getElementById('GmailAssist').style.visibility = 'visible';
        document.getElementById('overlay').style.visibility = 'visible';
        document.getElementById('table_to_sort').getElementsByTagName('tbody')[0].style.visibility = 'visible';

        // });
    };
    //---------生成搜索框-------
    var filterinput = document.createElement('input');
    filterinput.id = 'filter';
    filterinput.type = 'text';
    filterinput.style.marginRight = '8px';
    div.appendChild(filterinput);
    filterinput.placeholder = chrome.i18n.getMessage("hintForSearch");//'请输入关键词，以空格分隔';
    //---------生成复选框“将正文中的图片也视为附件”----
    var includeContentPics = document.createElement('input');
    div.appendChild(includeContentPics);
    includeContentPics.id = 'includeContentPics';
    includeContentPics.type = 'checkbox';
    includeContentPics.height = '60px';
    includeContentPics.width = '60px';
    var node = document.createTextNode(chrome.i18n.getMessage("lookPicsAsAttachments"));//"将正文中的图片也视为附件"
    //node.style.fontSize = '20px';
    div.appendChild(node);
    /*
     //---------显示退出按钮-----
     var btnexit = document.createElement('button');
     btnexit.id = 'btnexit';
     btnexit.innerHTML = 'X';
     btnexit.className="btn btn-1 btn-1e";
     btnexit.onclick = function(){
     div.style.visibility = "hidden";
     //sortingtable.style.visibility = "hidden";
     overlay.style.visibility = "hidden";
     document.getElementById('table_to_sort').getElementsByTagName('tbody')[0].style.visibility = 'hidden';
     }
     div.appendChild(btnexit);
     */
    //--------生成占位空白行
    var blank_span = document.createElement('div');
    div.appendChild(blank_span);
    blank_span.style.width = '1078px';
    blank_span.style.height = '0px';
    //---------生成loading动画--
    var load1 = document.createElement('div');
    load1.className = 'load1';
    load1.id = 'load1';
    load1.style.display = 'inline-block';
    div.appendChild(load1);
    for (var a = 1; a < 5; a++) {
        var rect = document.createElement('div');
        rect.className = 'rect' + a;
        load1.appendChild(rect);
    }
    //---------生成状态栏-------
    var status_span = document.createElement('span');
    status_span.id = 'status_span';
    status_span.style.fontSize = '16px';
    status_span.style.display = 'inline-block';
    //status_span.style.padding = '0 0 3px 0';
    status_span.style.width = '900px';
    status_span.style.margin = '0px 0 6px 5px';
    //status_span.style.marginTop = '18px';
    status_span.innerHTML = chrome.i18n.getMessage("loading");//'正在等待加载...';
    div.appendChild(status_span);

    //---------显示table------
    sortingTable = document.createElement('table');
    sortingTable.id = 'table_to_sort';
    sortingTable.cellpadding = "0";
    sortingTable.cellspacing = "0";
    sortingTable.border = "0";
    sortingTable.className = "sortable";

    div.appendChild(sortingTable);

    {//table表头内容
        var thead = document.createElement('thead');
        //thead.id='AttachmentsTableTbody';
        sortingTable.appendChild(thead);
        var tr = document.createElement('tr');
        thead.appendChild(tr);
        //复选框
        var th = document.createElement('th');
        th.className = "nosort";
        tr.appendChild(th);
        var cb = document.createElement('input');
        cb.id = "toggle_all";
        cb.type = 'checkbox';
        th.appendChild(cb);
        cb.onchange = toggleAll;
        //附件名
        var th = document.createElement('th');
        tr.appendChild(th);
        var h3 = document.createElement('h3');
        th.appendChild(h3);
        h3.innerHTML = chrome.i18n.getMessage("fileName");//"附件名";
        //附件大小
        var th = document.createElement('th');
        tr.appendChild(th);
        var h3 = document.createElement('h3');
        th.appendChild(h3);
        h3.innerHTML = chrome.i18n.getMessage("fileSize");//"附件大小";
        //发件人
        var th = document.createElement('th');
        tr.appendChild(th);
        var h3 = document.createElement('h3');
        th.appendChild(h3);
        h3.innerHTML = chrome.i18n.getMessage("from");//"发件人";
        //邮件标签
        var th = document.createElement('th');
        tr.appendChild(th);
        var h3 = document.createElement('h3');
        th.appendChild(h3);
        h3.innerHTML = chrome.i18n.getMessage("label");//"邮件标签";
        //邮件标题
        var th = document.createElement('th');
        tr.appendChild(th);
        var h3 = document.createElement('h3');
        th.appendChild(h3);
        var node = document.createTextNode(chrome.i18n.getMessage("subject"));//"邮件标题"
        h3.appendChild(node);
        //日期
        var th = document.createElement('th');
        tr.appendChild(th);
        var h3 = document.createElement('h3');
        th.appendChild(h3);
        var node = document.createTextNode(chrome.i18n.getMessage("date"));//"日期"
        h3.appendChild(node);

        var tbody = document.createElement('tbody');
        tbody.style.visibility = 'hidden';
        sortingTable.appendChild(tbody);

    }

}

//-----初始化分页、排序
var sorter_instance = {};
function initPageAndSorting() {
    {//原来的table_sort_script.js
        var TINY = {};
//download by http://www.codefans.net
        function T$(i) {
            return document.getElementById(i)
        }

        function T$$(e, p) {
            return p.getElementsByTagName(e)
        }

        TINY.table = function () {
            function sorter(n) {
                this.n = n;
                this.pagesize = 10;
                this.paginate = 0
            }

            sorter.prototype.init = function (e, f) {
                var t = ge(e), i = 0;
                this.e = e;
                this.l = t.r.length;
                t.a = [];
                t.h = T$$('thead', T$(e))[0].rows[0];
                t.w = t.h.cells.length;
                for (i; i < t.w; i++) {
                    var c = t.h.cells[i];
                    if (c.className != 'nosort') {
                        c.className = this.head;
                        c.onclick = new Function(this.n + '.wk(this.cellIndex)')
                    }
                }
                for (i = 0; i < this.l; i++) {
                    t.a[i] = {}
                }
                if (f != null) {
                    var a = new Function(this.n + '.wk(' + f + ')');
                    a()
                }
                if (this.paginate) {
                    this.g = 1;
                    this.pages()
                }
            };
            sorter.prototype.wk = function (y) {
                var t = ge(this.e), x = t.h.cells[y], i = 0;
                for (i; i < this.l; i++) {
                    t.a[i].o = i;
                    var v = t.r[i].cells[y];
                    t.r[i].style.display = '';
                    while (v.hasChildNodes()) {
                        v = v.firstChild
                    }
                    t.a[i].v = v.nodeValue ? v.nodeValue : ''
                }
                for (i = 0; i < t.w; i++) {
                    var c = t.h.cells[i];
                    if (c.className != 'nosort') {
                        c.className = this.head
                    }
                }
                if (t.p == y) {
                    t.a.reverse();
                    x.className = t.d ? this.asc : this.desc;
                    t.d = t.d ? 0 : 1
                }
                else {
                    t.p = y;
                    t.a.sort(cp);
                    t.d = 0;
                    x.className = this.asc
                }
                var n = document.createElement('tbody');
                for (i = 0; i < this.l; i++) {
                    var r = t.r[t.a[i].o].cloneNode(true);
                    n.appendChild(r);
                    r.className = i % 2 == 0 ? this.even : this.odd;
                    var cells = T$$('td', r);
                    for (var z = 0; z < t.w; z++) {
                        cells[z].className = y == z ? i % 2 == 0 ? this.evensel : this.oddsel : ''
                    }
                }
                t.replaceChild(n, t.b);
                if (this.paginate) {
                    this.size(this.pagesize)
                }
            };
            sorter.prototype.page = function (s) {
                var t = ge(this.e), i = 0, l = s + parseInt(this.pagesize);
                if (this.currentid && this.limitid) {
                    T$(this.currentid).innerHTML = this.g
                }
                for (i; i < this.l; i++) {
                    t.r[i].style.display = i >= s && i < l ? '' : 'none'
                }
            };
            sorter.prototype.move = function (d, m) {
                var s = d == 1 ? (m ? this.d : this.g + 1) : (m ? 1 : this.g - 1);
                if (s <= this.d && s > 0) {
                    this.g = s;
                    this.page((s - 1) * this.pagesize)
                }
            };
            sorter.prototype.size = function (s) {
                this.pagesize = s;
                this.g = 1;
                this.pages();
                this.page(0);
                if (this.currentid && this.limitid) {
                    T$(this.limitid).innerHTML = this.d
                }
            };
            sorter.prototype.pages = function () {
                this.d = Math.ceil(this.l / this.pagesize)
            };
            function ge(e) {
                var t = T$(e);
                t.b = T$$('tbody', t)[0];
                t.r = t.b.rows;
                return t
            };
            function cp(f, c) {
                var g, h;
                f = g = f.v.toLowerCase(), c = h = c.v.toLowerCase();
                var i = parseFloat(f.replace(/(\$|\,)/g, '')), n = parseFloat(c.replace(/(\$|\,)/g, ''));
                if (!isNaN(i) && !isNaN(n)) {
                    g = i, h = n
                }
                i = Date.parse(f);
                n = Date.parse(c);
                if (!isNaN(i) && !isNaN(n)) {
                    g = i;
                    h = n
                }
                return g > h ? 1 : (g < h ? -1 : 0)
            };
            return {sorter: sorter}
        }();
    }
    sorter_instance = new TINY.table.sorter("sorter_instance");
    console.log(sorter_instance);
    console.log(TINY);
    sorter_instance.head = "head";
    sorter_instance.asc = "asc";
    sorter_instance.desc = "desc";
    sorter_instance.even = "evenrow";
    sorter_instance.odd = "oddrow";
    sorter_instance.evensel = "evenselected";
    sorter_instance.oddsel = "oddselected";
    sorter_instance.paginate = true;
    sorter_instance.currentid = "currentpage";
    sorter_instance.limitid = "pagelimit";

    var controls = document.getElementById('controls');
    if (!controls) {
        var controls = document.createElement('div');
        controls.id = 'controls';
        document.getElementById('GmailAssist').appendChild(controls);

        {//controls内容
            var perpage = document.createElement('div');
            perpage.id = 'perpage';
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
                option.selected = "selected";
                option.innerHTML = 10;
                select.appendChild(option);

                var option = document.createElement('option');
                option.value = '15';
                option.innerHTML = 15;
                select.appendChild(option);

                //下面加上实现换每页项数的代码！
                select.onchange = function () {
                    sorter_instance.size(this.value);
                }
                var span = document.createElement('span');
                var ipp = "Entries per page";//"项每页";
                span.innerHTML = ipp;
                perpage.appendChild(span);
            }
            var navigation = document.createElement('div');
            navigation.id = 'navigation';
            controls.appendChild(navigation);
            {
                var first = document.createElement('img');
                first.src = chrome.extension.getURL("../images/first.gif");
                first.width = "16";
                first.height = "16";
                first.alt = "First Page";
                //first.onclick="sorter.move(-1,true)";
                first.onclick = function () {
                    sorter_instance.move(-1, true);
                }
                navigation.appendChild(first);

                var previous = document.createElement('img');
                previous.src = chrome.extension.getURL("../images/previous.gif");
                previous.width = "16";
                previous.height = "16";
                previous.alt = "Previous Page";
                //previous.onclick="javascript:sorter.move(-1)";
                previous.onclick = function () {
                    sorter_instance.move(-1);
                }
                navigation.appendChild(previous);

                var next = document.createElement('img');
                next.src = chrome.extension.getURL("../images/next.gif");
                next.width = "16";
                next.height = "16";
                next.alt = "Next Page";
                //next.onclick=sorter.move(1);
                //next.setAttribute("onclick", function(){alert('123');});
                next.onclick = function () {
                    sorter_instance.move(1);
                }
                navigation.appendChild(next);

                var last = document.createElement('img');
                last.src = chrome.extension.getURL("../images/last.gif");
                last.width = "16";
                last.height = "16";
                last.alt = "Last Page";
                last.onclick = function () {
                    sorter_instance.move(1, true);
                }
                //last.onclick=sorter.move(1,true);
                //last.setAttribute("onclick", alert('123'));
                navigation.appendChild(last);
            }
            var text = document.createElement('div');
            text.id = 'text';
            controls.appendChild(text);
            {
                var node = document.createTextNode("Page ");//"第"
                text.appendChild(node);

                var currentpage = document.createElement('span');
                currentpage.id = "currentpage";
                text.appendChild(currentpage);

                var node = document.createTextNode("/");
                text.appendChild(node);

                var pagelimit = document.createElement('span');
                pagelimit.id = "pagelimit";
                text.appendChild(pagelimit);

                //var node = document.createTextNode(chrome.i18n.getMessage("pageNumEnd"));//"页"
                //text.appendChild(node);
            }
        }
    }

    sorter_instance.init("table_to_sort", 0);
}
//===================显示UI大块=================================
//chrome.extension.onMessage.addListener(
/*chrome.runtime.onMessage.addListener(
 function(request, sender, sendResponse) {
 alert('TOKEN IS: '+token);
 if (request.token != '')
 {
 token = request.token;
 //alert(token);
 document.getElementById('GmailAssist').style.visibility = "visible";
 document.getElementById('overlay').style.visibility = "visible";
 document.getElementById('table_to_sort').getElementsByTagName('tbody')[0].style.visibility = 'visible';
 //sendResponse({farewell: "goodbye"});
 }
 });*/
//------------testing------------ 
//function fetchList() {
//    filterValue = document.getElementById('filter').value;
//    /*if(filterValue==null)
//     console.log('NULL?'+filterValue);
//     else if(filterValue==undefined)
//     console.log('UNdefined');
//     else if(filterValue=='')
//     console.log('空串！');
//     else if(filterValue==' ')
//     console.log('空格！！');*/
//    var xhr = new XMLHttpRequest();
//    xhr.onreadystatechange = function (event) {
//        if (xhr.readyState == 4) {
//            if (xhr.status == 200) {
//                var i = 0;
//
//                var list = JSON.parse(xhr.responseText);
//                MsgList = list;
//                //id = 0;
//                /*				//弄个数组来保存每个message是否处理完的信息
//
//                 */				//Fetch information of the attachments with a for loop
//                /*		if(list.resultSizeEstimate > 100)
//                 {
//                 list.resultSizeEstimate = 100;
//                 }*/
//                for (i = 0; i < list.messages.length; i++) {
//                    msgFinished[i + msgNow] = false;
//                    //console.log(list.messages[i].id + ' ' + i + msgNow + ' ' + list.resultSizeEstimate);
//                    getMessage(list.messages[i].id, i);
//                }
//                msgNow += i;
//                if (list.nextPageToken) {
//                    console.log('nextPageToken: ' + list.nextPageToken);
//                    fetchNextList(list.nextPageToken);
//                }
//                else {
//                    //list.nextPageToken;
//                    var time = setTimeout("initCtrls();", 4000);
//                }
//
//            } else if (xhr.status == 401) {
//                document.getElementById('status_span').innerHTML = chrome.i18n.getMessage("errorOfUnauthorized");//'未成功授权，请重新授权后再试！';
//                document.getElementById('load1').style.display = 'none';
//            }
//            else {
//                document.getElementById('status_span').innerHTML = chrome.i18n.getMessage("errorOfConnection");//'网络问题，请重试。不行的话，请刷新网页再试！';
//                document.getElementById('load1').style.display = 'none';
//            }
//        }
//        /*else{
//         document.getElementById('status_span').innerHTML = '网络问题，请重试。不行的话，请刷新网页再试！wai';
//         document.getElementById('load1').style.display = 'none';
//         }*/
//    };
//
//    xhr.open('GET', LIST_FETCH_URL + '?q=has%3Aattachment', true);
//
//    xhr.setRequestHeader('Content-Type', 'application/json');
//    xhr.setRequestHeader('Authorization', 'OAuth ' + token);
//
//    xhr.send(null);
//}

//获取附件列表（事实上这个是获取邮件列表）
function fetchNextList0(pagetoken) {
    filterValue = document.getElementById('filter').value;
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function (event) {
        if (xhr.readyState == 4) {
            if (xhr.status == 200) {
                var i = 0;

                var list = JSON.parse(xhr.responseText);
                MsgList = list;
                //id = 0;
                /*				//弄个数组来保存每个message是否处理完的信息

                 */				//Fetch information of the attachments with a for loop
                console.log(list.nextPageToken);
                for (i = 0; i < list.messages.length; i++) {
                    msgFinished[i + msgNow] = false;
                    console.log(list.messages[i].id + ' ' + i + msgNow + ' ' + list.resultSizeEstimate);
                    getMessage(list.messages[i].id, i + msgNow);
                }
                msgNow += i;
                if (list.nextPageToken) {
                    console.log(list.nextPageToken);
                    fetchNextList(list.nextPageToken);
                }
                else {
                    //fetchList();
                    var time = setTimeout("visibleRows=allContent;showRows();initCtrls();", 4000);
                }

            } else if (xhr.status == 401) {
                document.getElementById('status_span').innerHTML = chrome.i18n.getMessage("errorOfUnauthorized");//'未成功授权，请重新授权后再试！';
                document.getElementById('load1').style.display = 'none';
                //console.log(xhr);
                setTimeout(function () {
                    xhr.readyState = 1;
                    //console.log(xhr);
                    xhr.send();
                    console.log(xhr);
                }, 1000);
            }
            else {
                document.getElementById('status_span').innerHTML = chrome.i18n.getMessage("errorOfConnection");//'网络问题，请重试。不行的话，请刷新网页再试！';
                document.getElementById('load1').style.display = 'none';
            }
        }
        /*else{
         document.getElementById('status_span').innerHTML = '网络问题，请重试。不行的话，请刷新网页再试！wai';
         document.getElementById('load1').style.display = 'none';
         }*/
    };
    var otherParams = '';
    if (filterValue) {
        otherParams = '+' + encodeURIComponent(filterValue).replace(/%20/g, '+');
    }
    if (pagetoken) {
        xhr.open('GET', LIST_FETCH_URL + '?pageToken=' + pagetoken + '&q=has%3Aattachment' + otherParams, true);
        console.log('?pageToken=' + pagetoken + '&q=has%3Aattachment' + otherParams);
    } else {
        xhr.open('GET', LIST_FETCH_URL + '?q=has%3Aattachment' + otherParams, true);
        console.log('?q=has%3Aattachment' + otherParams);
    }

    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('Authorization', 'OAuth ' + token);

    console.log('XHR做好了：');
    console.log(xhr);
    xhr.send(null);
    console.time('发一次');
}

function fetchNextList(pagetoken) {
    filterValue = document.getElementById('filter').value;
    var otherParams = '';
    if (filterValue) {
        otherParams = '+' + encodeURIComponent(filterValue).replace(/%20/g, '+');
    }
    if (pagetoken) {
        url = LIST_FETCH_URL + '?pageToken=' + pagetoken + '&q=has%3Aattachment' + otherParams;
    } else {
        url = LIST_FETCH_URL + '?q=has%3Aattachment' + otherParams;
    }
    var settings = {
        /**
         *
         * @param list      即解析过（JSON.parse）之后的xhr.responseText
         * @param textStatus    描述该ajax请求的状态的字符串
         * @param xhr       jqXHR对象
         */
        success: function (list, textStatus,xhr) {
            //var list = JSON.parse(xhr.responseText);
            //id = 0;
            /*				//弄个数组来保存每个message是否处理完的信息

             */				//Fetch information of the attachments with a for loop
            console.log(list.nextPageToken);
            for (i = 0; i < list.messages.length; i++) {
                msgFinished[i + msgNow] = false;
                console.log(list.messages[i].id + ' ' + i + msgNow + ' ' + list.resultSizeEstimate);
                getMessage(list.messages[i].id, i + msgNow);
            }
            msgNow += i;
            if (list.nextPageToken) {
                console.log(list.nextPageToken);
                fetchNextList(list.nextPageToken);
            }
            else {
                //fetchList();
                var time = setTimeout("visibleRows=allContent;showRows();initCtrls();", 2000);
            }
        }
    }
    $.ajax(url, settings);
}

//排序table的控制（翻页）按钮们的初始化
function initCtrls() {
    var flag = true;
    for (i in msgFinished) {
        //console.log(msgFinished+' i='+i);
        //console.log('(before)flag='+flag);
        flag = msgFinished[i] && flag;
        //console.log('(after)flag='+flag);
    }
    if (flag == false) {
        console.log('再等会');
        setTimeout("initCtrls();", 2500);
    }
    else {
        //filterRows();//根据搜索框，过滤不显示的
        //showRows();//根据数组show_thisrow决定是否显示当前行

        //jcLoader().load({type: "js", url: chrome.extension.getURL("injected-js/tableInited.js")}, function () {
        initPageAndSorting();
        console.log("controls inited!");

        document.getElementById('status_span').innerHTML = chrome.i18n.getMessage("finishListing");//'获取附件列表完毕！';
        document.getElementById('load1').style.display = 'none';
        document.getElementById('GmailAssist').style.visibility = 'visible';
        document.getElementById('overlay').style.visibility = 'visible';
        document.getElementById('table_to_sort').getElementsByTagName('tbody')[0].style.visibility = 'visible';

        //setTimeout("document.getElementById('status_span').innerHTML = '';",3000);

    }
}

function getMessage(MessageId, j) {//j为在msgFinished中的下标
    url = MESSAGE_FETCH_URL_prefix + MessageId;
    var settings = {
        success: function (messageObj, textStatus,xhr) {
            //var messageObj = JSON.parse(xhr.responseText);
            var parts = messageObj.payload.parts;

            var headers = messageObj.payload.headers;
            var sender;
            var subject = '-';
            var labels = messageObj.labelIds;
            var date;
            if (parts) {
                //Fetch information of the attachments with a for loop
                for (i in headers) {
                    var header = headers[i];
                    if (header.name == 'From') {
                        sender = header.value;
                    }
                    else if (header.name == 'Subject') {
                        if (header.value) {
                            subject = header.value;
                        }
                    }
                    else if (header.name == 'Date') {
                        date = header.value;
                    }
                }
                //for(var i=0; i<parts.length ; i++)
                for (i in parts) {
                    var part = parts[i];

                    if (part.filename) {
                        for (i in part.headers) {
                            var partheader = part.headers[i];
                            if (partheader.name == 'Content-ID') {
                                var in_content = true;
                            }
                        }

                        if (in_content && not_include_content_pics) {
                            break;
                        }
                        part.body.size = Math.ceil(part.body.size * 0.75 / 1024);
                        var d = new Date(Date.parse(date));

                        allContent[id] = part.filename + '|-|' + part.body.size + '|-|' + sender + '|-|' + labels + '|-|' + subject + '|-|' + d.toLocaleDateString() + '|-|' + MessageId + '|-|' + part.partId;

                        id++;
                    }
                }
            }
            msgFinished[j] = true;
        }
    }
    $.ajax(url, settings);
}

//---草稿操作函数
function makenewdraft(passed, name) {
    //1.获得当前的draft内容（非raw的字符串）
    //var id_in_func = passed;
    getCurrentDraftID(function (draftID) {
        console.log('in draft:' + draftID);
        currentdraftid = draftID;
        getCurrentRawDraft(currentdraftid, function (draftmail) {
            currentDraftString = draftmail;
            //2.获得当前message中相应的附件内容和信息（非raw的字符串）
            console.log(visibleRows[passed].split('|-|')[6] + ' ' + visibleRows[passed].split('|-|')[7]);
            getAttPart(visibleRows[passed].split('|-|')[6], visibleRows[passed].split('|-|')[7], function (attachpart) {
                //console.log(attachpart);
                partBeingInserted = attachpart;
                /*console.log('THE PART BEING APPENDED TO DRAFT IS:' + partBeingInserted);*/
                //3.把2拼到1上
                var updatedRaw = joinPartToDraft(currentDraftString, partBeingInserted);
                //----alert('joined!');
                //4.更新draft
                updateDraft(currentdraftid, updatedRaw, name);
                //----alert('Updated your draft!');
            });
        });
    });//存到变量draftID中
}

//---草稿操作相关函数
{
    function getCurrentDraftID(callback) {
        url = DRAFT_URL_prefix;
        var settings = {
            /**
             *
             * @param result  经JSON.parse解析过的请求返回内容
             */
            success: function (result) {
                //var result = JSON.parse(xhr.responseText);
                if (result.drafts) {
                    draftID = result.drafts[0].id;
                    callback(draftID);
                }
                else {
                    document.getElementById('status_span').innerHTML = chrome.i18n.getMessage("draftBoxEmpty");//'草稿箱为空，请先创建草稿后再试！';
                    document.getElementById('load1').style.display = 'none';
                }
                //	console.log(draftID);
            }
        }
        $.ajax(url, settings);
        //为啥原来写的async是false？？难道这个需要同步才行？？
        //xhr.open('GET', DRAFT_URL_prefix, false);
    }

    function getCurrentRawDraft(DraftId, callback) {
        url = DRAFT_URL_prefix + DraftId + '?format=raw';
        var settings = {
            /**
             *
             * @param oldDraft  经JSON.parse解析过的xhr.responseText
             */
            success: function (oldDraft) {
                //var oldDraft = JSON.parse(xhr.responseText);
                var raw = oldDraft.message.raw;
                callback(atob(raw.replace(/-/g, '+').replace(/_/g, '/')));
            }
        }
        $.ajax(url, settings);
        //这个也是false？？？也要同步才行？不能异步？？
        //xhr.open('GET', DRAFT_URL_prefix + DraftId + '?format=raw', false);
    }

    function getAttPart(MessageId, partid, callback) {
        url = MESSAGE_FETCH_URL_prefix + MessageId + '?format=raw';
        var settings = {
            /**
             *
             * @param rawmail   经JSON.parse解析过的xhr.responseText
             */
            success: function (rawmail) {
                //var rawmail = JSON.parse(xhr.responseText);
                //console.log(rawmail);
                var raw = rawmail.raw;

                var mail = atob(raw.replace(/-/g, '+').replace(/_/g, '/'));
                //console.log(mail);
                var boundstartpos = mail.indexOf('boundary=') + 9;
                var boundary = mail.substring(boundstartpos, mail.indexOf('\r', boundstartpos));
                if (boundary.indexOf('"') == 0) {
                    boundary = boundary.substring(1, boundary.length - 1);
                }
                //console.log(boundary);
                var mailparts = mail.split(boundary);
                partid = parseInt(partid) + 2;

                if (mailparts[partid].indexOf('X-Attachment-Id') == -1) {
                    callback('\nX-Attachment-Id: f_' + MessageId + partid + mailparts[partid]);
                }
                else {
                    callback(mailparts[partid]);
                }
            }
        }
        $.ajax(url, settings);
//又是一个false？？草稿相关的都得false？？
        //xhr.open('GET', MESSAGE_FETCH_URL_prefix + MessageId + '?format=raw', false);
    }

    function joinPartToDraft(currentDraftString, partBeingInserted) {
        var boundstartpos = currentDraftString.indexOf('Content-Type: multipart/mixed; boundary=');
        if (boundstartpos != -1)//找到了mix boundary
        {
            var prepart = currentDraftString.substring(0, currentDraftString.length - 2);//先去掉最后两个--,前提是已经有mix boundary
            boundstartpos += 40;//移动到boundary的起点
            var boundary = currentDraftString.substring(boundstartpos, currentDraftString.indexOf('\r', boundstartpos));//获取最高的boundary
            //newdraft = prepart + '\r\n' + partBeingInserted + boundary +'--';//合并出最终的新草稿
            newdraft = prepart + partBeingInserted + boundary + '--';//合并出最终的新草稿
        }
        else {
            //var alterBoundStartPos = prepart.indexOf('boundary=')+9;
            //在alter boundary起点拆开，prepart1 preapart2
            var alterBoundStartPos = currentDraftString.indexOf('Content-Type: multipart/alternative; boundary=');
            var prepart1 = currentDraftString.substring(0, alterBoundStartPos);
            var prepart2 = currentDraftString.substring(alterBoundStartPos, currentDraftString.length);
            //构造mix boundary
            //	var boundary = currentDraftString.substring(alterBoundStartPos, currentDraftString.indexOf('\r',alterBoundStartPos));
            var boundary = '1218521a9381b1992c2014d0000f';
            //prepart1+'Content-Type: multipart/mixed; boundary='+boundary+'\n\r\n--'+boundary+'\n'+prepart2;
            var prepart = prepart1 + 'Content-Type: multipart/mixed; boundary=' + boundary + '\n\r\n--' + boundary + '\n' + prepart2 + '\n--' + boundary;
            //var boundary = currentDraftString.substring(alterBoundStartPos, currentDraftString.indexOf('\r',alterBoundStartPos));//获取alter boundary

            //newdraft = prepart + '\r\n' + partBeingInserted + boundary +'--';//合并出最终的新草稿
            newdraft = prepart + partBeingInserted + boundary + '--';//合并出最终的新草稿
        }
        /*
         var boundstartpos = currentDraftString.indexOf('boundary=')+9;
         var boundary = currentDraftString.substring(boundstartpos, currentDraftString.indexOf('\r',boundstartpos));//获取最高的boundary
         */

        return btoa(newdraft).replace(/\//g, '_').replace(/\+/g, '-');
    }

    /**废弃了
     *
     * @param oldEmail
     */
    function makeUpdatedDraft(oldEmail) {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function (event) {
            if (xhr.readyState == 4) {
                if (xhr.status == 200) {
                    var drafts = JSON.parse(xhr.responseText);
                    //noinspection JSUnusedLocalSymbols
                    var draftID = drafts[0].id;
                    return btoa(updatedRaw).replace(/\//g, '_').replace(/\+/g, '-');
                } else if (xhr.status == 401) {
                    document.getElementById('status_span').innerHTML = chrome.i18n.getMessage("errorOfUnauthorized");//'未成功授权，请重新授权后再试！';
                    document.getElementById('load1').style.display = 'none';
                } else {
                    document.getElementById('status_span').innerHTML = chrome.i18n.getMessage("errorOfConnection");//'网络问题，请重试。不行的话，请刷新网页再试！';
                    document.getElementById('load1').style.display = 'none';
                }
            } else {
                document.getElementById('status_span').innerHTML = chrome.i18n.getMessage("badRequest");//'网络请求失败，请重试！';
                document.getElementById('load1').style.display = 'none';
            }
        };

        xhr.open('GET', DRAFT_URL_prefix, false);

        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.setRequestHeader('Authorization', 'OAuth ' + token);
        xhr.send(null);
    }

    /**更新当前最新的草稿，即把本地拼好要插入的附件之后的新草稿发回服务器
     *
     * @param DraftId  操作的草稿的DraftId
     * @param updatedRaw  草稿内容全文，完整的MIME格式
     * @param name  插进去的附件的文件名
     */
    function updateDraft(DraftId, updatedRaw, name) {
        var newdraft = {};
        newdraft.message = {};
        newdraft.message.raw = updatedRaw;
        var json = JSON.stringify(newdraft);

        url = DRAFT_URL_prefix + DraftId;
        var settings = {
            type: 'PUT',
            success: function () {
                document.getElementById('status_span').innerHTML = chrome.i18n.getMessage("finishInsert", name);//'附件<strong>'+ name +'</strong>已成功插入至最新草稿！';
                console.log('添加附件成功！');
            }
        }
        $.ajax(url, settings);

        //果然还是个false
        //xhr.open('PUT', DRAFT_URL_prefix + DraftId, false);
    }

}


/**根据搜索框（过滤条件框）内的内容，过滤掉不显示的行
 *
 */
function filterRows() {
    console.log('过滤器工作啦');
    var filterValue = document.getElementById('filter').value;
    {
        var terms = filterValue.split(' ');
        visibleRows = allContent.filter(function (content) {
            for (var termI = 0; termI < terms.length; ++termI) {
                var term = terms[termI];
                if (term.length != 0) {
                    var expected = (term[0] != '-');
                    if (!expected) {
                        term = term.substr(1);
                        if (term.length == 0) {
                            continue;
                        }
                    }
                    var found = (-1 !== content.indexOf(term));
                    if (found != expected) {
                        return false;
                    }
                }
            }
            return true;
        });
    }
}

/**按照filterRows操作过的结果，把全局数组visibleRows[]的内容都显示到sorting table里
 *
 */
function showRows() {
    //console.log(visibleRows);
    for (id3 = 0; id3 < visibleRows.length; id3++) {
        //console.log(visibleRows[id3]);
        var rowcontents = visibleRows[id3].split('|-|');

        var tr = document.createElement('tr');
        tr.id = "attachment_tr_" + id3;
        document.getElementById('table_to_sort').getElementsByTagName('tbody')[0].appendChild(tr);

        //复选框
        var td = document.createElement('td');
        tr.appendChild(td);

        var cb = document.createElement('input');
        cb.id = "checkbox_" + id3;
        cb.type = 'checkbox';
        td.appendChild(cb);
        //附件名
        var td = document.createElement('td');
        tr.appendChild(td);
        td.innerHTML = rowcontents[0];

        //附件大小
        var td = document.createElement('td');
        tr.appendChild(td);
        td.innerHTML = rowcontents[1] + 'K';

        //发件人
        var td = document.createElement('td');
        tr.appendChild(td);
        td.innerHTML = rowcontents[2];

        //标签
        var td = document.createElement('td');
        tr.appendChild(td);
        td.innerHTML = rowcontents[3];

        //标题
        var td = document.createElement('td');
        tr.appendChild(td);
        var a = document.createElement('a');
        td.appendChild(a);
        a.href = 'https://mail.google.com/mail/u/0/#all/' + rowcontents[6];
        a.target = "_blank";
        a.innerHTML = rowcontents[4];

        //日期
        var td = document.createElement('td');
        tr.appendChild(td);
        td.innerHTML = rowcontents[5];
    }

    //id_show = id3;
}
//全选功能
function toggleAll() {
    var checked = document.getElementById('toggle_all').checked;
    for (var k = 0; k < visibleRows.length; k++) {
        document.getElementById("checkbox_" + k).checked = checked;
    }
}
//判断是否完成了GmailAssist的加载
function tellIfLoaded() {
    if (document.getElementById('form').disabled == true)
        document.getElementById('status_span').innerHTML = chrome.i18n.getMessage("failLoading");//'Gmail助手加载失败了，请刷新网页重试。(建议先等页面加载完毕，再打开助手界面)';
    document.getElementById('load1').style.display = 'none';
}
/**
 * 根据当前重试的次数，由指数退避算法计算出下次间隔多长时间再重发
 * @param attempts  当前已尝试次数
 * @returns {number}   下次发送前要间隔的ms数
 */
function nextDelayTime(attempts) {
    return (Math.pow(2, attempts) * 1000) + Math.floor(Math.random() * 1000);//random() 方法可返回介于 0 ~ 1 之间的一个随机数。
}
//如果ajax失败了，就重发（指数退避重试7次以上都按7次算）
function doAjaxRequestLoop(attempts, xhr) {
    attempts += 1;
    if (attempts > 7) {
        attempts = 7;
    }
    setTimeout(function () {
        $.ajax({
            xhr: xhr,
            error: function (error) {
                console.log('未授权哦');
                doAjaxRequestLoop(attempts, xhr);
            }
        });
    }, nextDelayTime(attempts));

}

InitDiv();
//全局ajax设置，ajax失败则指数退避重传(jq ajax的type默认为'GET')
$.ajaxSetup({
    error: function (xhr) {
        if (xhr.status == 401) {
            document.getElementById('status_span').innerHTML = chrome.i18n.getMessage("errorOfUnauthorized");//'未成功授权，请重新授权后再试！';
            document.getElementById('load1').style.display = 'none';
            console.log('未授权哦');
            //doAjaxRequestLoop(0, xhr);//attempts=0 是当前重试的次数，用于指数退避的时间间隔计算。xhr是把当前失败了的这个xhr传下去，重发之。//但这个xhr不是已经readystate==4的了么？？
        } else if (xhr.status == 403 || xhr.status == 429 || xhr.status == 502 || xhr.status == 503) {
            doAjaxRequestLoop(0, xhr);//attempts=0 是当前重试的次数，用于指数退避的时间间隔计算。xhr是把当前失败了的这个xhr传下去，重发之。//但这个xhr不是已经readystate==4的了么？？
        } else {//除了上述错误码，其他的都认为是网络错误，直接提示。
            document.getElementById('status_span').innerHTML = chrome.i18n.getMessage("errorOfConnection");//'网络问题，请重试。不行的话，请刷新网页再试！';
            document.getElementById('load1').style.display = 'none';
        }
    }
});
setTimeout("tellIfLoaded();", 20000);
