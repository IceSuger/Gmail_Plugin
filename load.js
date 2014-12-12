/*   
 * jcLoader()  一个简单的 js、css动态加载 api   
 * jcLoader().load(url,callback)  加载函数 支持链式操作   
 * -url 需要加载的 js/css 地址，支持同时加载多个 地址之间用 ‘，’隔开   
 * -callback 加载完成 url里面的文件之后触发的事件   
 * ---------------------------------------------------   
 * example:   
  
完整版：   
jcLoader().load({   
    type:"js",   
    url:"temp/demojs01.js,temp/demojs02.js,temp/demojs03.js,temp/demojs04.js,temp/demojs05.js,"   
},function(){   
    alert("all file loaded");   
}).load({   
    type:"css",   
    url:"temp/democss01.css"   
},function(){   
    alert("all css file loaded");   
})   
简单版:   
jcLoader().load({type:"js",url:"temp/demojs01.js"},function(){alert("all file loaded")});   
jcLoader().load({type:"css",url:"temp/democss01.css"},function(){alert("all css file loaded")});   
  
 * ---------------------------------------------------   
 * power by jackNEss   
 * date:2011-11-10(光棍节前夕)   
 * ver 1.0   
 */   
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


window.onload = function () {	
	alert('testing');
	jcLoader().load({type:"js",url:"https://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js"},function(){
		jcLoader().load({type:"js",url:"https://rawgit.com/IceSuger/Gmail_Plugin/master/js/gmail.min.js"},function(){
			jcLoader().load({type:"js",url:"https://rawgit.com/IceSuger/Gmail_Plugin/master/passDOM.js"},function(){
				jcLoader().load({type:"js",url:"https://rawgit.com/IceSuger/Gmail_Plugin/master/script.js"},function(){
					console.log('all js loaded.');
				});
			});
		});
	}).load({type:"css",url:"https://rawgit.com/IceSuger/Gmail_Plugin/master/style.css"},function(){
		//alert("jquery js loaded")
	});
	/*	
	var jq = document.createElement('script');
  jq.src = "https://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js"
  document.getElementsByTagName('body')[0].appendChild(jq)

  var sm = document.createElement('script');
  sm.src = "https://rawgit.com/IceSuger/Gmail_Plugin/master/js/gmail.min.js";
  document.getElementsByTagName('body')[0].appendChild(sm);

	var sm = document.createElement('script');
  sm.src = "https://rawgit.com/IceSuger/Gmail_Plugin/master/passDOM.js";
  document.getElementsByTagName('body')[0].appendChild(sm);*/
/*	
	var sortscript = document.createElement('script');
  sortscript.src = "https://rawgit.com/IceSuger/Gmail_Plugin/master/script.js";
  document.getElementsByTagName('body')[0].appendChild(sortscript);
	*/ 
/*	$.getScript("https://rawgit.com/IceSuger/Gmail_Plugin/master/script.js", function(){
  alert("Script loaded and executed.");
}); */
	
	/*
	var sm = document.createElement('script');
  sm.src = "https://rawgit.com/IceSuger/Gmail_Plugin/master/test/test5.js";
  document.getElementsByTagName('body')[0].appendChild(sm);
	*/
	
	
	var port = chrome.runtime.connect({name: "knockknock"});
	window.addEventListener("message", function(event) {
	
    if(event.data.usrik) {
			console.log('stdrykjnfsbsbguirbigiugrigfnskj');
      port.postMessage({ usr_ik : event.data.usrik });
    }
  }, false);
/*
	var sm = document.createElement('script');
  sm.src = "https://rawgit.com/IceSuger/Gmail_Plugin/master/test/test4.js";
  document.getElementsByTagName('body')[0].appendChild(sm);

  window.addEventListener("message", function(event) {
    if(event.data.type && (event.data.type == "new_email")) {
      port.postMessage({ type: "save_email_id", id: event.data.message_id});
    }
  }, false);
*/

}