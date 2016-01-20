//动态载入(as injected)js，css并执行回调
var jcLoader = function () {

    var dc = document;

    function createScript(url, callback) {
        var urls = url.replace(/[,]\s*$/ig, "").split(",");
        var scripts = [];
        var completeNum = 0;
        for (var i = 0; i < urls.length; i++) {

            scripts[i] = dc.createElement("script");
            scripts[i].type = "text/javascript";
            scripts[i].src = urls[i];
            dc.getElementsByTagName("head")[0].appendChild(scripts[i]);

            if (!callback instanceof Function) {
                return;
            }

            if (scripts[i].readyState) {
                scripts[i].onreadystatechange = function () {

                    if (this.readyState == "loaded" || this.readyState == "complete") {
                        this.onreadystatechange = null;
                        completeNum++;
                        completeNum >= urls.length ? callback() : "";
                    }
                }
            }
            else {
                scripts[i].onload = function () {
                    completeNum++;
                    completeNum >= urls.length ? callback() : "";
                }
            }

        }

    }

    function createLink(url, callback) {
        var urls = url.replace(/[,]\s*$/ig, "").split(",");
        var links = [];
        for (var i = 0; i < urls.length; i++) {
            links[i] = dc.createElement("link");
            links[i].rel = "stylesheet";
            links[i].href = urls[i];
            dc.getElementsByTagName("head")[0].appendChild(links[i]);
        }
        callback instanceof Function ? callback() : "";
    }

    return {
        load: function (option, callback) {
            var _type = "", _url = "";
            var _callback = callback
            option.type ? _type = option.type : "";
            option.url ? _url = option.url : "";
            typeof option.filtration == "boolean" ? filtration = option.filtration : "";

            switch (_type) {
                case "js":
                case "javascript":
                    createScript(_url, _callback);
                    break;
                case "css":
                    createLink(_url, _callback);
                    break;
            }

            return this;
        }
    }
}

window.onload = function () {
    //jcLoader().load({type:"js",url:"https://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js"},function(){
    jcLoader().load({type: "css", url: chrome.extension.getURL("css/main-UI-style.css")}, function () {
    //}).load({type: "js", url: chrome.extension.getURL("injected-js/table_sort_script.js")}, function () {
        //jcLoader().load({type:"js",url:"table_sort_script.js"},function(){
        console.log('all js loaded.');
        console.log('按钮可用起来！');
        document.getElementById('form').disabled = false;
        document.getElementById('btndown').disabled = false;
        document.getElementById('btninsert').disabled = false;
        document.getElementById('status_span').innerHTML = chrome.i18n.getMessage("completeLoading");//'Gmail附件助手加载完毕！';
        document.getElementById('load1').style.display = 'none';

        chrome.runtime.onMessage.addListener(
            function (request, sender, sendResponse) {
                //alert('TOKEN IS: '+request.token);
                if (request.token != '') {
                    token = request.token;
                    //alert(token);
                    document.getElementById('GmailAssist').style.visibility = "visible";
                    document.getElementById('overlay').style.visibility = "visible";
                    document.getElementById('table_to_sort').getElementsByTagName('tbody')[0].style.visibility = 'visible';
                    //sendResponse({farewell: "goodbye"});
                }
            });
        console.log('绑定了监听事件，按下show up按钮，将会显示助手界面');
        //});
    }).load({type: "css", url: chrome.extension.getURL("css/component.css")}, function () {
    });


}