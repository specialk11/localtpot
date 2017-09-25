(function($) {
    'use strict';
 
    angular
        .module('app')
        .factory('UserService', UserService);

    function UserService($http) {
        var service = {};
        
        service.login = login;
        service.logout = logout;
        service.isLoggedIn = isLoggedIn;
        service.getUserId = getUserId;
 
        return service;

        function login(response_token, auth_response, profile) {
            // output login information
            console.log(response_token);
            console.log(auth_response);
            console.log(profile);

            // set the data to be sent to server
            var toserver = { 'idToken': auth_response.id_token, 'aud': "264007239616-gv1ib14d9qdju864gbp529249mm62ucq.apps.googleusercontent.com" , 'authCode': response_token.code, 'platform': 'webapp' };
            
            // output the data sent to server
            console.log(JSON.stringify(toserver));

            console.log('https://tpot.space/checkUser/' + profile.Eea);
            $http.get('https://tpot.space/checkUser/' + profile.Eea).then(function(response) {
                console.log(response);
                var newUser = 0;
                if(response.data.error == 401) {
                    newUser = 1;
                }

                console.log('https://tpot.space/auth' + JSON.stringify(toserver));
                // send the login data to server
                $http.post('https://tpot.space/auth', toserver).then(function(response) {
                    if(response.status == 200) {
                        console.log(response.data.userId);
                        console.log(profile);

                        // set the cookies
                        var date = new Date();
                        date.setTime(date.getTime()+(28*24*60*60*1000));
                        document.cookie = "userid=" + JSON.stringify(response.data.userId) + "; expires=" + date.toGMTString() + "; path=/";
                        document.cookie = "profile=" + JSON.stringify(profile) + "; expires=Thu, 18 Feb 2017 12:00:00 UTC; path=/";

                        // redirect to welcome page if new user
                        if(newUser == 1) {
                            document.location = '/#/welcome';
                        } else {
                            document.location = '/';
                        }
                    } else {
                        console.log(response);
                    }
                });
            });
        }

        function logout() {
            // delete the login cookies
            document.cookie = "userid=; expires=Thu, 01 Jan 1970 00:00:00 UTC";
            document.cookie = "profile=; expires=Thu, 01 Jan 1970 00:00:00 UTC";
        }

        function isLoggedIn() {
            // check if the login cookie is set
            if(getUserId() == "") {
                return false;
            } else {
                return true;
            }
        }

        function getUserId() {
            var name = "userid=";
            var ca = document.cookie.split(';');
            for(var i = 0; i < ca.length; i++) {
                var c = ca[i];
                while(c.charAt(0) == ' ') {
                    c = c.substring(1);
                }
                if (c.indexOf(name) == 0) {
                    return c.substring(name.length + 1, c.length - 1);
                }
            }
            return "";
        }
    }
}()
);