angular.module('starter.services', [])
 
        .factory('Serv', function ($http, $localStorage) {
            // Might use a resource here that returns a JSON array
 
            // Some fake testing data
              return {
                login: function (login) {
                  var uuid = device.uuid;
                  var name = device.platform;
                  $localStorage.billiuser = login.username;
                  $localStorage.billipass = login.password;

                 return $http.get("https://api.billi.be/mobile/login/?login=" + login.username + "&pass=" + login.password + "&uuid="+uuid+"&name="+name);
                },
                 block: function (id) {
                  var uuid = device.uuid;
                  var name = device.platform;
                 return $http.get("https://api.billi.be/mobile/block/?number=" + id);
                },
                autologin: function (token) {
                 return $http.get("https://api.billi.be/mobile/getsession");
                },
                findByOrderId: function (data){

                 return $http.get("https://api.billi.be/mobile/getservicedetail/");   

                }
            };
        });