function Profile(){
	this.uid;
	this.imgUrl;
	this.first_name;
	this.last_name;
	this.init = function(id,first_name,last_name){
		this.id = id;
		this.imgUrl = "https://graph.facebook.com/"+id+"/picture?width=100&height=100";
		this.first_name = first_name;
		this.last_name = last_name;
	}
};
var profile = new Profile();

// This is called with the results from from FB.getLoginStatus().
function statusChangeCallback(response) {


	// The response object is returned with a status field that lets the
	// app know the current login status of the person.
	// Full docs on the response object can be found in the documentation
	// for FB.getLoginStatus().
	if (response.status === 'connected') {
	  // Logged into your app and Facebook.
	  document.getElementById('status').innerHTML = 'connected.';
	  fecthInfo();

	} else if (response.status === 'not_authorized') {
	  // The person is logged into Facebook, but not your app.
	  document.getElementById('status').innerHTML = 'Please log ' +
	    'into this app.';
	} else {
	  // The person is not logged into Facebook, so we're not sure if
	  // they are logged into this app or not.
	  document.getElementById('status').innerHTML = 'Please log ' +
	    'into Facebook.';
	}
}

// This function is called when someone finishes with the Login
// Button.  See the onlogin handler attached to it in the sample
// code below.
function checkLoginState() {
	FB.getLoginStatus(function(response) {
	  statusChangeCallback(response);
	});
}




// Here we run a very simple test of the Graph API after login is
// successful.  See statusChangeCallback() for when this call is made.
function fecthInfo() {
	console.log('Welcome!  Fetching your information.... ');
	FB.api('/me', function(response) {
		console.log(JSON.stringify(response));
		profile.init(response.id,response.first_name,response.last_name);
		console.log(profile);
	});
}

