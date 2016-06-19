var system = require('system');
var args = system.args;
var id,pass;

if (args.length < 2) {
  console.log('Please insert parameter [username] [password]');
  phantom.exit(1);
}else{
	id = args[1];
  	pass = args[2];
	var page = require('webpage').create();
	var setURL = 'https://nac.kmitl.ac.th/dana-na/auth/url_default/welcome.cgi';
	var sesionURL = 'https://nac.kmitl.ac.th/dana-na/auth/welcome.cgi?p=extend-session';
	var logedinURL = 'https://nac.kmitl.ac.th/dana/home/infranet.cgi';
	var foff='https://nac.kmitl.ac.th/dana-na/auth/url_default/welcome.cgi?p=forced-off';
	var failed = 'https://nac.kmitl.ac.th/dana-na/auth/url_default/welcome.cgi?p=failed'

	var page = require('webpage').create();
	page.open(setURL, function() {
	  console.log('Start . . .');
	  page.includeJs("http://ajax.googleapis.com/ajax/libs/jquery/1.6.1/jquery.min.js", function() {
	  	  page.onConsoleMessage = function(msg) {
	  		system.stderr.writeLine( 'console: ' + msg );
		  };
	      page.onLoadFinished = function(){
	        page.render("nextPage.png");
	      };
	      page.onUrlChanged = function(targetUrl) {
	        page.render('urlChange.png');
	        console.log('New URL: ' + targetUrl);
	      };
	      if (page.url == setURL | page.url == foff | page.url == sesionURL) {
	        page.evaluate(function(args) {
	          var kmitlID = JSON.stringify(args[1]).replace(/\"/g, ""); //KMITL User 
	          var kmitlPWD = JSON.stringify(args[2]).replace(/\"/g, "");//KMITL Password
	          document.forms[0].elements[1].value = kmitlID;
	          document.forms[0].elements[2].value = kmitlPWD;       
	          document.forms[0].submit();
	          return;
	        },args);
	      };
	      if (page.url == failed) {
	        console.log('Fail to login please check your username and password is correct.');
	        phantom.exit(1);
	      };
	      if (page.url == logedinURL) {
	        page.evaluate(function() {
	          var new_obj = document.getElementById('liveclock2').childNodes[2].textContent;
	          var hours = parseInt(new_obj.substring(2,4));
	          if ( hours <= 4 ) { 
	            document.getElementById('Extendbg').click(); 
	          } 
	          return;
	        });
	      };
	    
	    });
	});
}