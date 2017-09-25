//DO NOT MESS UNLESS YOU ARE SURE WHAT YOU ARE DOING. DO NOT ADD TO REPO

var oauth2 = require('google-auth-library/lib/auth/oauth2client');
var client = '264007239616-gv1ib14d9qdju864gbp529249mm62ucq.apps.googleusercontent.com';
var secret = 'ODVkwsqjsjdlfaKLuJuwHq59';
var redirect = '';
var redirectWebApp = 'postmessage';
var OAuth2Client = new oauth2(client, secret, redirect);
var OAuth2ClientWebApp = new oauth2(client, secret, redirectWebApp);
exports.getOAuth2Client = function(platform) {
	// MAKES IT AN OPTIONAL PARAMETER, WHICH DEFAULTS TO "android" IF NONE GIVEN
    platform = platform || "android";
	if(platform == 'webapp') {
		return OAuth2ClientWebApp;
	} else {
		return OAuth2Client;
	}
}
exports.client = client;
