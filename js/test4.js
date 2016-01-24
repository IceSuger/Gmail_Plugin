﻿//===================授权/取消授权模块======================
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
    ['google'].forEach(function (providerName) {
        var provider = window[providerName];
        provider.clearAccessToken();
    });
    checkAuthorized();
}

function checkAuthorized() {
    console.log('checkAuthorized');
    ['google'].forEach(function (providerName) {
        var provider = window[providerName];
        var button = document.querySelector('#' + providerName);
        if (provider.hasAccessToken()) {
            button.classList.add('authorized');
            document.getElementById('google').innerHTML = chrome.i18n.getMessage("alreadyAuthorized");//'已授权';
            document.getElementById('form').style.visibility = "visible";
            document.getElementById('success').style.visibility = "visible";
        } else {
            button.classList.remove('authorized');
            document.getElementById('google').innerHTML = chrome.i18n.getMessage("Authorize");//'授权';
            document.getElementById('form').style.visibility = "hidden";
            document.getElementById('success').style.visibility = "hidden";
        }
    });
}

document.addEventListener('DOMContentLoaded', function () {
    document.querySelector('button#google').addEventListener('click', function () {
        authorize('google');
    });
    document.querySelector('button#clear').addEventListener('click', function () {
        clearAuthorized()
    });

    checkAuthorized();
});

//===================获取信息模块======================

document.addEventListener('DOMContentLoaded', function () {
    var form = document.getElementById('form');
    var success = document.getElementById('success');
    var token = '';
    token = google.getAccessToken();

    function sendShowDiv() {
        chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {token: token}, function (response) {
                //console.log(response.farewell);
            });
        });
    }

    form.addEventListener('submit', function (event) {

        event.preventDefault();

        /*
         //=======下面是引用gmail.min.js的部分，为了获得ik值==============
         chrome.runtime.sendMessage('Hello', function(response){
         ik = response;
         alert('ik is: '+ik);
         });
         //=======上面是引用gmail.min.js的部分，为了获得ik值==============

         */  //2016.1.12 重构中发现这段代码好像已经没用了。应该是用了GMail API后，不再使用gmail.js库了，也不再需要ik的值了。
        sendShowDiv();
        //fetchList();
    });
});