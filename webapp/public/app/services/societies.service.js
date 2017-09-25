(function($) {
    'use strict';
 
    angular
        .module('app')
        .factory('SocietiesService', SocietiesService);

    function SocietiesService($http) {
        var service = {};
        
        service.login = login;
        service.logout = logout;
        service.isLoggedIn = isLoggedIn;
        service.getCookie = getCookie;
 
        return service;

        function login(college, email, password) {
            var req = {
                method: 'POST',
                url: 'https://tpot.space/soc/auth/',
                headers: {
                    'college': college,
                    'email': email,
                    'password': password
                }
            }

            $http(req).then(function(response) {
                console.log(response);
                var society = response.data;

                var date = new Date();
                date.setTime(date.getTime()+(28*24*60*60*1000));
                document.cookie = "college=" + college + "; expires=" + date.toGMTString() + "; path=/";
                document.cookie = "email=" + email + "; expires=" + date.toGMTString() + "; path=/";
                document.cookie = "password=" + password + "; expires=" + date.toGMTString() + "; path=/";
                document.cookie = "society=" + society + "; expires=" + date.toGMTString() + "; path=/";
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

        function getCookie(cookiename) {
            var nameEQ = cookiename + "=";
            var ca = document.cookie.split(';');
            for(var i=0;i < ca.length;i++) {
                var c = ca[i];
                while (c.charAt(0)==' ') c = c.substring(1,c.length);
                if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
            }
            return null;
        }
    }
}()
);