var clientId = '338238388612';
var scopes = 'https://www.googleapis.com/auth/gmail.readonly';

      // Use a button to handle authentication the first time.


      function handleAuthResult(authResult) {
        var authorizeButton = document.getElementById('authorize-button');
		var suc = document.getElementById("s");
		var fai = document.getElementById("f");
        if (authResult && !authResult.error) {
          authorizeButton.style.visibility = 'hidden';
		  fai.style.visibility = 'hidden';
          console.log('login complete');
		  console.log(gapi.auth.getToken());
        } else {
          authorizeButton.style.visibility = '';
		  suc.style.visibility = 'hidden';
          authorizeButton.onclick = function(){handleAuthClick();};
		  authorizeButton.innerHTML="My First JavaScript Function";
		  console.log('login failed');
        }
      }

      function handleAuthClick(event) {
        gapi.auth.authorize({client_id: clientId, scope: scopes, immediate: true}, handleAuthResult);
		document.write("Hello World!");
        return false;
      }