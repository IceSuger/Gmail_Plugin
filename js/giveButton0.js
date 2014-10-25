function auth() {
    var config = {
      'client_id': '338238388612',
      'scope': ['https://mail.google.com/','https://www.googleapis.com/auth/gmail.modify','https://www.googleapis.com/auth/gmail.readonly','https://www.googleapis.com/auth/gmail.compose']
    };
    gapi.auth.authorize(config, function() {
      console.log('login complete');
      console.log(gapi.auth.getToken());
    });
  }

var authbtn = document.getElementById("authbtn"); 
authbtn.onclick=auth();