angular.module('starter.controllers', ['ngStorage', 'ionic','pascalprecht.translate'])

.controller('LogoutCtrl', function($scope, Serv, $state, $http, $ionicLoading) {
    $ionicLoading.show({
        template: '<ion-spinner icon="android"></ion-spinner>'
    });
    var link = "https://api.billi.be/mobile/logout";
     $http.get(link).then(function(res) {

                console.log(res);
                $ionicLoading.hide();
                $state.go('login');
            });

})
.controller('DashCtrl', function($scope, Serv, $localStorage, $ionicLoading, $translate) {
	
	$scope.curlang = $translate.use();
    $ionicLoading.show({
        template: '<ion-spinner icon="android"></ion-spinner>'
    });

    var uuid = device.uuid;
    var token = $localStorage.token;
    var billiuser = $localStorage.billiuser;
    console.log(billiuser);
    var link = 'https://api.billi.be/mobile/getdashboard';
    $scope.loading = true;
    $.ajax({
        type: "POST",
        url: link,
        dataType: "json",
        data: {
            uuid: uuid,
            token: token
        },
        success: function(data) {
            //console.log(data);
            if (data.stat.invoice > 0) {
                var style = "assertive";
            } else {
                var style = "balanced";
            }
            $ionicLoading.hide();
            $scope.data = data;
        },
        error: function(e) {
            alert('Error: ' + e.message);
        }
    });



})


.controller('InternetCtrl', function($scope, Serv, $localStorage, $ionicLoading,$translate) {
	
$scope.curlang = $translate.use();
	
  $translate(['recurring', 'status', 'show_details']).then(function (translations) {
   
    $ionicLoading.show({
        template: '<ion-spinner icon="android"></ion-spinner>'
    });
    var uuid = device.uuid;
    var token = $localStorage.token;
    var link = 'https://api.billi.be/mobile/getservices_i';
    $scope.loading = true;
    $.ajax({
        type: "POST",
        url: link,
        dataType: "json",
        data: {
            uuid: uuid,
            token: token
        },
        success: function(data) {
            $ionicLoading.hide();
            $.each(data.data, function(i, item) {
                var orderid = item.orderid;
                var amount = item.amount;
                var status = item.domainstatus;
                var regdate = item.regdate;
                var name = item.name;
                var image = item.image;
                if (image.length == 0) {
                    var image = "internet-xxl.png";
                }
                var d = regdate;
                d = d.substr(0, 10).split("-");
                d = d[2] + "/" + d[1] + "/" + d[0];
                $('#Service-List').append('<div class="item item-thumbnail-left"><img src="img/' + image + '" width="35"><h2>' + name + '</h2><p>' + d + '</p></div>' +
                    '<div class="item item-body"><div class="list"><div class="list">'+translations.status+': ' + status + '<br />'+translations.recurring+': ' + amount + '</div><a class="button ion-unlocked button-block button-simson" href="#/side/internetdetail/' + orderid + '"> '+translations.show_details+' </button></div></div>');
            });
            $('#spin').hide();
        },
        error: function(e) {
            alert('Error: ' + e.message);
        }
    });
 });
})

.controller('InternetDetailsCtrl', function($scope, $http, $state, $stateParams, Serv, $ionicLoading, $compile, $ionicModal,$translate) {
        $scope.curlang = $translate.use();
		$ionicLoading.show({
            template: '<ion-spinner icon="android"></ion-spinner>'
        });

        $scope.data = {};
        var id = $stateParams.id;
        var link = 'https://api.billi.be/mobile/getinternet/' + id;

        $scope.mobilechangessid = function(ssid) {
            $ionicLoading.show({
                template: '<ion-spinner icon="android"></ion-spinner>'
            });
            var linking = 'https://api.billi.be/mobile/mobilechangessid';
            $.ajax({
                type: "POST",
                url: linking,
                dataType: "json",
                data: {
                    orderid: id,
                    ssid: ssid
                },
                success: function(data) {
                    $ionicLoading.hide();
                    console.log(data);
                    $scope.modalssid.hide();
                    $state.reload();

                },
                error: function(e) {
                    alert('Error: ' + e.message);
                }
            });

        };
        $scope.mobilechangekey = function(key) {
            $ionicLoading.show({
                template: '<ion-spinner icon="android">Changing your wifikey....</ion-spinner>'
            });
            var linking = 'https://api.billi.be/mobile/mobilechangekey';
            $.ajax({
                type: "POST",
                url: linking,
                dataType: "json",
                data: {
                    orderid: id,
                    passkey: key
                },
                success: function(data) {
                    $ionicLoading.hide();
                    console.log(data);
                    $scope.modalpasskey.hide();
                    $state.reload();

                },
                error: function(e) {
                    alert('Error: ' + e.message);
                }
            });

        };
        $http.get(link).then(function(res) {
            $ionicLoading.hide();
            var i = res.data;
            //console.log(i);
            $('#ServiceDetail').append('<div class="card list">' +
                '<div class="item item-divider">Package: ' + i.hosting.name + '</div>' +
                '<div class="item item-text-wrap">' +
                '<div class = "row">' +
                '<div class = "col">Recurring</div>' +
                '<div class = "col kanan">&euro;' + i.hosting.amount + '</div>' +
                '</div>' +
                '<div class = "row">' +
                '<div class = "col">Regdate</div>' +
                '<div class = "col kanan">' + i.hosting.regdate + '</div>' +
                '</div>' +
                '<div class = "row">' +
                '<div class = "col">Order ID</div>' +
                '<div class = "col kanan">' + i.hosting.orderid + '</div>' +
                '</div>' +
                '<div class = "row">' +
                '<div class = "col">Line ID#</div>' +
                '<div class = "col kanan">' + i.hosting.domain + '</div>' +
                '</div>' +
                '<div class = "row">' +
                '<div class = "col">Status</div>' +
                '<div class = "col hijau">' + i.hosting.domainstatus + '</div>' +
                '</div>' +
                '<div class = "row">' +
                '<div class = "col">Modem</div>' +
                '<div class = "col kanan">' + i.hosting.serial + '</div>' +
                '</div>' +
                '<div class = "row">' +
                '<div class = "col">Username</div>' +
                '<div class = "col kanan">' + i.hosting.username + '</div>' +
                '</div>' +
                '<div class = "row">' +
                '<div class = "col">Password</div>' +
                '<div class = "col kanan">' + i.hosting.password + '</div>' +
                '</div>' +
                '</div>' +

                '<div class="item item-divider">Location: ' + i.hosting.address + '</div>' +
                '</div>');

            if (i.addons.length > 0) {
                //console.log(i.addons);
                $.each(i.addons, function(i, item) {
                    $('#addons').append('<div class="card list">' +
                        '<div class="item item-divider">Addon Name: ' + item.name + '</div>' +
                        '<div class="item item-text-wrap">' +
                        '<div class = "row">' +
                        '<div class = "col">Recurring</div>' +
                        '<div class = "col kanan">&euro;' + item.recurring + '</div>' +
                        '</div>' +
                        '<div class = "row">' +
                        '<div class = "col">Billing Cycle</div>' +
                        '<div class = "col kanan">&euro;' + item.billingcycle + '</div>' +
                        '</div>' +

                        '</div>' +

                        '<div class="item item-divider">Status: ' + item.status + '</div>' +
                        '</div>');



                });
            }
            if (i.modem.status == "ONLINE") {

                var modem_style = "hijau";
            } else {
                var modem_style = "merah";
            }

            if (i.modem.passkey.length == 0) {

                var passkey = 'Unknown';
            } else {
                var passkey = i.modem.passkey;

            }
            $('#addons').append($compile('<div class="card list">' +
                '<div class="item item-divider">Modem Serial: ' + i.hosting.serial + '</div>' +
                '<div class="item item-text-wrap">' +
                '<div class = "row">' +
                '<div class = "col">IPv4</div>' +
                '<div class = "col kanan">' + i.modem.ip + '</div>' +
                '</div>' +
                '<div class = "row">' +
                '<div class = "col">Status</div>' +
                '<div class = "col ' + modem_style + '">' + i.modem.status + '</div>' +
                '</div>' +
                '<div class = "row">' +
                '<div class = "col">Profile</div>' +
                '<div class = "col kanan">' + i.modem.downstream + 'Mbps/' + i.modem.upstream + 'Mbps</div>' +
                '</div>' +
                '<div class = "row">' +
                '<div class = "col">Wifi SSID:</div>' +
                '<div id="ssidval" class = "col kanan"><a ng-click="openModalSSID(' + i.hosting.orderid + ')">' + i.modem.ssid + '</a></div>' +
                '</div>' +
                '<div class = "row">' +
                '<div class = "col">Wifi KEY:</div>' +
                '<div id="keyval" class = "col kanan"><a ng-click="openModalPASSKEY(' + i.hosting.orderid + ')">' + passkey + '</a></div>' +
                '</div>' +
                '</div>' +

                '<div class="item item-divider">Hardware: ' + i.modem.hardware + '</div>' +
                '</div>')($scope));



        });

        $scope.modalpasskey = $ionicModal.fromTemplate('<ion-modal-view>' +
            ' <ion-header-bar>' +
            '<div class="col">Change WIFI Key </div><div class="col text-right"><button ng-click="closeModaPASSKEY()" class="button button-simson">Close</button></div>' +
            '</ion-header-bar>' +

            '<ion-content>' +

            ' <div class="list">' +

            '<div class="item item-input-inset">' +
            '<label class="item-input-wrapper">' +
            '<input ng-model="wifikey" type="text" value="{{wifikey}}">' +
            '</label>' +
            '<button ng-click="mobilechangekey(wifikey);" class="button button-small button-simson">' +
            '<i class="icon ion-social-buffer"></i> Save KEY' +
            '</button>' +
            '</div>' +

            '</div>' +

            '</ion-content>' +

            '</ion-modal-view>', {
                scope: $scope,
                animation: 'slide-in-up'
            })
        $scope.modalssid = $ionicModal.fromTemplate('<ion-modal-view>' +
            ' <ion-header-bar>' +
            '<div class="col">Change WIFI SSID</div><div class="col text-right"><button ng-click="closeModalSSID()" class="button button-simson">Close</button></div>' +
            '</ion-header-bar>' +

            '<ion-content>' +

            ' <div class="list">' +

            '<div class="item item-input-inset">' +
            '<label class="item-input-wrapper">' +
            '<input ng-model="ssid" type="text" value="{{ssid}}">' +
            '</label>' +
            '<button ng-click="mobilechangessid(ssid);" class="button button-small button-simson">' +
            '<i class="icon ion-social-buffer"></i> Save SSID' +
            '</button>' +
            '</div>' +

            '</div>' +

            '</ion-content>' +

            '</ion-modal-view>', {
                scope: $scope,
                animation: 'slide-in-up'
            })
        $scope.openModalPASSKEY = function(orderid) {

            $http.get(link).then(function(restu) {
                
                $scope.wifikey = restu.data.modem.passkey;
            });
            $scope.id = orderid;
            $scope.modalpasskey.show();
        };
        $scope.openModalSSID = function(orderid) {

            $http.get(link).then(function(res) {
                $scope.ssid = res.data.modem.ssid;
            });
            $scope.id = orderid;
            $scope.modalssid.show();
        };
        $scope.closeModaPASSKEY = function() {
            $scope.modalpasskey.hide();
        };
           $scope.closeModalSSID = function() {
            $scope.modalssid.hide();
        };
        //Cleanup the modal when we're done with it!
        $scope.$on('$destroy', function() {
            $scope.modalssid.remove();
        });
         $scope.$on('$destroy', function() {
            $scope.modalpasskey.remove();
        });

        // Execute action on hide modal
        $scope.$on('modal.hidden', function() {
            // Execute action
        });

        // Execute action on remove modal
        $scope.$on('modal.removed', function() {
            // Execute action
        });

    })
    .controller('MobileCtrl', function($scope, Serv, $localStorage, $ionicLoading,$translate) {
        $scope.curlang = $translate.use();
		$ionicLoading.show({
            template: '<ion-spinner icon="android"></ion-spinner>'
        });
        var uuid = device.uuid;
        var token = $localStorage.token;
        var link = 'https://api.billi.be/mobile/getservices_m';
        $scope.loading = true;
        $.ajax({
            type: "POST",
            url: link,
            dataType: "json",
            data: {
                uuid: uuid,
                token: token
            },
            success: function(data) {
                $ionicLoading.hide();
                $.each(data.data, function(i, item) {
                    var orderid = item.orderid;
                    var mssidn = item.domain;
                    var amount = item.amount;
                    var image = item.image;
                    var status = item.domainstatus;
                    var regdate = item.regdate;
                    var name = item.name;
                    var d = regdate;
                    d = d.substr(0, 10).split("-");
                    d = d[2] + "/" + d[1] + "/" + d[0];
                    if (image.length == 0) {
                        var image = "mobile.png";
                    }
                    $('#Service-List').append('<div class="item item-thumbnail-left"><img src="img/' + image + '" width="30"><h2>' + name + ' </h2><i class="kanan">+' + mssidn + '</i><br /><i class="kanan">' + d + '</i></div>' +
                        '<div class="item item-body"><div class="list"><div class="list">Status: ' + status + '<br />Recurring: ' + amount + '</div><a class="button ion-unlocked button-block button-simson" href="#/side/mobiledetail/' + orderid + '"> Show Details </button></div></div>');
                });
                $('#spin').hide();
            },
            error: function(e) {
                alert('Error: ' + e.message);
            }
        });

    })

.controller('MobileDetailsCtrl', function($scope, $http, $stateParams, Serv, $ionicLoading, $compile, $ionicModal ,$translate) {
    $scope.curlang = $translate.use();
	$ionicLoading.show({
        template: '<ion-spinner icon="android"></ion-spinner>'
    });
    var uuid = device.uuid;
    if(uuid == null){

        var uuid = "1234567890";
    }
    console.log(device);
    $scope.data = {};
    var id = $stateParams.id;
    var link = 'https://api.billi.be/mobile/getmobile/' + id;
    $scope.id = id;
    $http.get(link).then(function(res) {
        $ionicLoading.hide();
        var i = res.data;
        //console.log(i);
        var d = i.hosting.regdate;
        d = d.substr(0, 10).split("-");
        d = d[2] + "/" + d[1] + "/" + d[0];
        $('#ServiceDetail').append('<div class="card list">' +
            '<div class="item item-divider">Package: ' + i.hosting.name + '</div>' +
            '<div class="item item-text-wrap">' +
            '<div class = "row">' +
            '<div class = "col">Number:</div>' +
            '<div class = "col kanan">' + i.hosting.domain + '</div>' +
            '</div>' +
            '<div class = "row">' +
            '<div class = "col">Recurring</div>' +
            '<div class = "col kanan">&euro;' + i.hosting.amount + '</div>' +
            '</div>' +
            '<div class = "row">' +
            '<div class = "col">Regdate</div>' +
            '<div class = "col kanan">' + d + '</div>' +
            '</div>' +
            '<div class = "row">' +
            '<div class = "col">Order ID</div>' +
            '<div class = "col kanan">' + i.hosting.orderid + '</div>' +
            '</div>' +
            '<div class = "row">' +
            '<div class = "col">Status</div>' +
            '<div class = "col hijau">' + i.hosting.domainstatus + '</div>' +
            '</div>' +
            '</div>' +

            '<div class="item item-divider"></div>' +
            '</div>');

        if (i.addons.length > 0) {
            //console.log(i.addons);
            $.each(i.addons, function(i, item) {
                $('#addons').append('<div class="card list">' +
                    '<div class="item item-divider">Addon Name: ' + item.name + '</div>' +
                    '<div class="item item-text-wrap">' +
                    '<div class = "row">' +
                    '<div class = "col">Recurring</div>' +
                    '<div class = "col kanan">&euro;' + item.recurring + '</div>' +
                    '</div>' +
                    '<div class = "row">' +
                    '<div class = "col">Billing Cycle</div>' +
                    '<div class = "col kanan">&euro;' + item.billingcycle + '</div>' +
                    '</div>' +

                    '</div>' +

                    '<div class="item item-divider">Status: ' + item.status + '</div>' +
                    '</div>');



            });
        }

        $('#addons').append($compile('<div class="card list">' +
            '<div class="item item-divider">Number Serial: ' + i.hosting.domain + '</div>' +
            '<div class="item item-text-wrap">' +
            '<div class = "row">' +
            '<div class = "col">PIN</div>' +
            '<div class = "col kanan">1111</div>' +
            '</div>' +
            '<div class = "row">' +
            '<div class = "col">PUK1</div>' +
            '<div class = "col kanan">' + i.hosting.puk1 + '</div>' +
            '</div>' +
            '<div class = "row">' +
            '<div class = "col">PUK2</div>' +
            '<div class = "col kanan">' + i.hosting.puk2 + '</div>' +
            '</div>' +
            '<div class = "row">' +
            '<div class = "col">SIM</div>' +
            '<div class = "col kanan">' + i.hosting.sim_number + '</div>' +
            '</div>' +
              '<div class = "row">' +
            '<div class = "col">DEVICE ID</div>' +
            '<div class = "col kanan">' + uuid.toUpperCase() + '</div>' +
            '</div>' +
            '</div>' +

            '<div class="item item-divider"></div>' +
            '</div>')($scope));
        var link2 = 'https://api.billi.be/mobile/mobile_getparameter/' + id;

        $http.get(link2).then(function(restu) {
            if (restu.data.bar == "0") {
                $scope.bar = "No Barring";
            } else if (restu.data.bar == "1") {

                $scope.bar = "Partial Barring";
            } else if (restu.data.bar == "2") {

                $scope.bar = "Full Barring";
            }
            $scope.bootstrap = true;
            param = restu.data.vars;
            $scope.number = restu.data.number;
            $scope.pushNotificationChange = function(data) {
                $ionicLoading.show({
        template: '<ion-spinner icon="android"></ion-spinner>'
    });
                var str = data.split(':');
                var paramid = str[0];
                if (str[1] == "true") {
                    var value = 1;
                } else {
                    var value = 0;

                }
                //console.log(id + ' ' + value + ' ' + paramid);
                    $.ajax({
            type: "POST",
            url: 'https://api.billi.be/mobile/setoption',
            dataType: "json",
            data: {
                orderid: id,
                id: paramid,
                val: value
            },
            success: function(data) {
                $ionicLoading.hide();
                //console.log(data);
 
            },
            error: function(e) {
                alert('Error: ' + e.message);
            }
        });

            };

            $scope.pushNotification_mms = {
                checked: param.mms.val,
                id: param.mms.id
            };
            $scope.pushNotification_web = {
                checked: param.web.val,
                id: param.web.id
            };
            $scope.pushNotification_international = {
                checked: param.international.val,
                id: param.international.id
            };
            $scope.pushNotification_roaming = {
                checked: param.roaming.val,
                id: param.roaming.id
            };
            $scope.pushNotification_premium = {
                checked: param.premium.val,
                id: param.premium.id
            };
            $scope.pushNotification_lte = {
                checked: param.lte.val,
                id: param.lte.id
            };
        });

    });



})

.controller('MobileCdrCtrl', function($scope, $http, $stateParams, Serv, $ionicLoading, $compile, $ionicModal, $translate) {
        $scope.curlang = $translate.use();
		var id = $stateParams.id;
        $scope.data = {};
        $ionicLoading.show({
            template: '<ion-spinner icon="android"></ion-spinner>'
        });
        var linkcdr = 'https://api.billi.be/mobile/getcdr/' + id;
        $http.get(linkcdr).then(function(cdrs) {
            $ionicLoading.hide();
            $scope.cdrs = cdrs.data;
        });

    })
    .controller('TVCtrl', function($scope, $http, $translate) {
        $scope.curlang = $translate.use();
		var uuid = device.uuid;
        $scope.data = {};
        var link = 'https://api.billi.be/mobile/getservices_t/' + uuid;

        $http.post(link, {
            username: $scope.data.username
        }).then(function(res) {
            $scope.response = res.data;
        });

    })
    .controller('VoipCtrl', function($scope, $http, $translate) {
		$scope.curlang = $translate.use();
        var uuid = device.uuid;
        $scope.data = {};
        var link = 'https://api.billi.be/mobile/getservices_v/' + uuid;

        $http.post(link, {
            username: $scope.data.username
        }).then(function(res) {
            $scope.response = res.data;
        });

    })
    .controller('InvoiceCtrl', function($scope, $stateParams, Serv, $http, $localStorage, $ionicLoading,$translate) {
		$scope.curlang = $translate.use();
        $translate(['date', 'duedate','paid','unpaid', 'status', 'invoiceno', 'download', 'reference','amount','payonline']).then(function (translations) {
		$ionicLoading.show({
            template: '<ion-spinner icon="android"></ion-spinner>'
        });
        var uuid = device.uuid;
        $scope.data = {};
        var token = $localStorage.token;
        var link = 'https://api.billi.be/mobile/getinvoices/' + token;

        $.ajax({
            type: "POST",
            url: link,
            dataType: "json",
            data: {
                uuid: uuid,
                token: token
            },
            success: function(data) {
                $ionicLoading.hide();
                $.each(data, function(i, item) {
                    var invoiceid = item.id;
                    var invoicenum = item.invoicenum;
                    var total = item.total;
                    var status = item.status;
                    var date = item.date;
                    var duedate = item.duedate;
                    var paymentmethod = item.paymentmethod;
                    var notes = item.notes;
                    var d = date;
                    d = d.substr(0, 10).split("-");
                    d = d[2] + "/" + d[1] + "/" + d[0];
                    var dd = duedate;
                    dd = dd.substr(0, 10).split("-");
                    dd = dd[2] + "/" + dd[1] + "/" + dd[0];
                    if (status == "Paid") {

                        var style = "simson";
                        $('#Invoice-List').append('<div class="card">' +
                            '<div class="item item-divider-clear"><h2>'+translations.invoiceno+': ' + invoicenum + '</h2></div>' +
                            '<div class="item item-text-wrap">' +
                            '<div class = "row">' +
                            '<div class = "col">'+translations.amount+'</div>' +
                            '<div class = "col kanan">&euro;' + total + '</div>' +
                            '</div>' +
                            '<div class = "row">' +
                            '<div class = "col">'+translations.date+'</div>' +
                            '<div class = "col kanan">' + d + '</div>' +
                            '</div>' +
                            '<div class = "row">' +
                            '<div class = "col">'+translations.duedate+'</div>' +
                            '<div class = "col kanan">' + dd + '</div>' +
                            '</div>' +
                            '<div class = "row">' +
                            '<div class = "col">'+translations.reference+'</div>' +
                            '<div class = "col kanan">' + notes + '</div>' +
                            '</div>' +
                            '<div class = "row">' +
                            '<div class = "col">'+translations.status+'</div>' +
                            '<div class = "col hijau">' + translations.paid + '</div>' +
                            '</div>' +
                            '</div>' +
                            '<div class="item item-divider-clear"> <a class="button button-block button-' + style + '" href="#/side/download/' + invoiceid + '"><i class="icon ion-code-download"></i> Download </a> </div></div>');

                    } else {
                        var style = "assertive";
                        $('#Invoice-List').append('<div class="card">' +
                            '<div class="item item-divider-clear"><h2>'+translations.invoiceno+'#: ' + invoicenum + '</h2></div>' +
                            '<div class="item item-text-wrap">' +
                            '<div class = "row">' +
                            '<div class = "col">'+translations.amount+'</div>' +
                            '<div class = "col kanan">&euro;' + total + '</div>' +
                            '</div>' +
                            '<div class = "row">' +
                            '<div class = "col">'+translations.date+'</div>' +
                            '<div class = "col kanan">' + d + '</div>' +
                            '</div>' +
                            '<div class = "row">' +
                            '<div class = "col">'+translations.duedate+'</div>' +
                            '<div class = "col kanan">' + dd + '</div>' +
                            '</div>' +
                            '<div class = "row">' +
                            '<div class = "col">'+translations.reference+'</div>' +
                            '<div class = "col kanan">' + notes + '</div>' +
                            '</div>' +
                            '<div class = "row">' +
                            '<div class = "col">'+translations.status+'</div>' +
                            '<div class = "col merah">' + translations.unpaid + '</div>' +
                            '</div>' +
                            '</div>' +
                            '<div class="item item-divider-clear"> <a class="button button-block button-' + style + '" href="#/side/pay/' + invoiceid + '"><i class="icon ion-card"></i> '+translations.payonline+' </button> </div></div>');


                    }

                });
                $('#spin').hide();
            },
            error: function(e) {
                //alert('Error: ' + e.message);
            }
        });
		});
    })
 .controller('PayCtrl', function($scope, $http, $stateParams, Serv, $localStorage, $ionicLoading,$translate) {
 $scope.curlang = $translate.use();
    var id = $stateParams.id;
    var token = $localStorage.token;
    var link = 'https://api.billi.be/mobile/getinvoicedetail/' + id;
    $scope.id = id;
    $http.get(link).then(function(res) {
console.log(res);
    $scope.invoice = res;

    });
   $scope.openExternal = function(m){
      window.open('https://secure.billi.be/gpredirect.php?id='+id+'&gw=' + m+'&token='+token, '_system'); 
};


 })
    .controller('InvoiceDownloadCtrl', function($scope, $http, $stateParams,  $localStorage, Serv, $ionicLoading,$translate) {
		$scope.curlang = $translate.use();
        var uuid = device.uuid;
        var id = $stateParams.id;
        var token =  $localStorage.token;
        window.open('https://secure.billi.be/gdl.php?id=' + id + '&token='+token, '_system'); 
        

    })
    .controller('TicketsCtrl', function($scope, Serv, $localStorage, $ionicLoading, $translate) {
	$scope.curlang = $translate.use();
	$translate(['ticketid', 'ticketdate','ticketstatus','ticketsubject', 'ticketmessage', 'ticketpriority', 'ticketdepartment']).then(function (translations) {
        $ionicLoading.show({
            template: '<ion-spinner icon="android"></ion-spinner>'
        });
       
	
			// var uuid = device.uuid;
		var uuid="mozilla";
        var token = $localStorage.token;
        var link = 'https://api.billi.be/mobile/gettickets';
        $scope.loading = true;
        $.ajax({
            type: "POST",
            url: link,
            dataType: "json",
            data: {
                uuid: uuid,
                token: token
            },
            success: function(data) {
				console.log(data);
                $ionicLoading.hide();
                if (data.data == "empty") {
				$('#Tickets-List').append('<h1>No Tickets Found.</h1>');
                } else {

                    
					 $.each(data.data, function(i, item) {
						  var style = "simson";
                    $('#Tickets-List').append('<div class="card">' +
                            '<div class="item item-divider-clear"><h2>'+translations.ticketid+': ' + item.tid + '</h2></div>' +
                            '<div class="item item-text-wrap">' +
                            '<div class = "row">' +
                            '<div class = "col">'+translations.ticketsubject+'</div>' +
                            '<div class = "col kanan">' + item.title + '</div>' +
                            '</div>' +
                            '<div class = "row">' +
                            '<div class = "col">'+translations.ticketdate+'</div>' +
                            '<div class = "col kanan">' + item.date + '</div>' +
                            '</div>' +
                            '<div class = "row">' +
                            '<div class = "col">'+translations.ticketstatus+'</div>' +
                            '<div class = "col kanan">' + item.status + '</div>' +
                            '</div>' +
                            '<div class = "row">' +
                            '<div class = "col">'+translations.ticketdepartment+'</div>' +
                            '<div class = "col hijau">' + item.deptname + '</div>' +
                            '</div>' +
                            '</div>' +
                            '<div class="item item-divider-clear"> <a class="button button-block button-' + style + '" href="#/side/viewticket/' + item.id + '"><i class="icon ion-code-download"></i> View Ticket </a> </div></div>');

				 });

                }
            },
            error: function(e) {
                alert('Error: ' + e.message);
            }
        });
	});
    })
	 .controller('ViewTicketCtrl', function($scope, $http, $stateParams,  $localStorage, Serv, $ionicModal, $ionicLoading, $translate) {
		 
		$scope.curlang = $translate.use();
		    //var uuid = device.uuid;
		var uuid = "unknown";
        var id = $stateParams.id;
		$scope.ticketid = id;
        var token =  $localStorage.token;
		$translate(['ticketid', 'ticketdate','ticketstatus','ticketsubject', 'ticketmessage', 'ticketpriority', 'ticketdepartment']).then(function (translations) {
		
		   $scope.replyticket = function(message) {
            $ionicLoading.show({
                template: '<ion-spinner icon="android"></ion-spinner>'
            });
            var linking = 'https://api.billi.be/mobile/replyticket';
            $.ajax({
                type: "POST",
                url: linking,
                dataType: "json",
                data: {
                    ticketid: id,
                    message: message
                },
                success: function(data) {
                    $ionicLoading.hide();
                    console.log(data);
                    $scope.modalreplyticket.hide();
                    $state.reload();

                },
                error: function(e) {
                    alert('Error: ' + e.message);
                }
            });

        };
        $scope.closeticket = function(id) {
            $ionicLoading.show({
                template: '<ion-spinner icon="android">Closing your ticket</ion-spinner>'
            });
            var linking = 'https://api.billi.be/mobile/closeticket';
            $.ajax({
                type: "POST",
                url: linking,
                dataType: "json",
                data: {
                    ticketid: id
                },
                success: function(data) {
                    $ionicLoading.hide();
                    console.log(data);
                    $scope.modalcloseticket.hide();
                    $state.reload();

                },
                error: function(e) {
                    alert('Error: ' + e.message);
                }
            });

        };
		
		
		
		$ionicLoading.show({
            template: '<ion-spinner icon="android"></ion-spinner>'
        });
    
        var link = 'https://api.billi.be/mobile/viewticket';
        $scope.loading = true;
        $.ajax({
            type: "POST",
            url: link,
            dataType: "json",
            data: {
                ticketid: id,
                token: token
            },
            success: function(data) {
				console.log(data);
                $ionicLoading.hide();
				if(data.result == "OK"){
				$('#ticketitle').append('<div class="card">' +
                            '<div class="item item-divider-clear bar-simson">'+translations.ticketid+': ' + data.ticket.tid + '</div>' +
                            '<div class="item item-text-wrap">' +
                            '<div class = "row">' +
                            '<div class = "col">'+translations.ticketsubject+'</div>' +
                            '<div class = "col kanan">' + data.ticket.title + '</div>' +
                            '</div>' +
                            '<div class = "row">' +
                            '<div class = "col">'+translations.ticketdate+'</div>' +
                            '<div class = "col kanan">' + data.ticket.date + '</div>' +
                            '</div>' +
                            '<div class = "row">' +
                            '<div class = "col">'+translations.ticketstatus+'</div>' +
                            '<div class = "col kanan">' + data.ticket.status + '</div>' +
                            '</div>' +
                            '<div class = "row">' +
                            '<div class = "col">'+translations.ticketdepartment+'</div>' +
                            '<div class = "col kanan">' + data.ticket.deptname + '</div>' + 
                            '</div>' +
                            '</div>'+
							'<div class="row">'+
							
							 '<div class="item item-text-wrap"><h6>'+
							
							data.ticket.message +
   
   '</h6></div>'+
							'</div>'+
							
							'</div>');
				 $.each(data.replies.data, function(i, item) {
				
					if(item.admin.length > 0){
						
					                    $('#Replies-List').append('<div class="card">'+
   '<div class="item bar bar-simson">Staff replied on: '+item.date+'</div>'+   
   '<div class="item item-text-wrap"><h6>'+item.message+'</h6></div>'+
'</div>');	
					}else{
					                    $('#Replies-List').append('<div class="card">'+
   '<div class="item bar bar-dark">You replied on: '+item.date+'</div>'+   
   '<div class="item item-text-wrap"><h6>'+item.message+'</h6></div>'+
'</div>');	
						
					}


				 });
				}
			}
		});
		$scope.modalreplyticket = $ionicModal.fromTemplate('<ion-modal-view>' +
            ' <ion-header-bar>' +
            '<div class="col">Respong to this ticket </div><div class="col text-right"><button ng-click="closeModalreplyticket()" class="button button-simson">Close</button></div>' +
            '</ion-header-bar>' +

            '<ion-content>' +

           '<div class="list">'+
  '<label class="item item-input">'+
   ' <textarea placeholder="Comments"></textarea>'+
  '</label>'+
  '</div><div class="row">'+
            '<button ng-click="replyticket(id);" class="button button-block button-small button-simson">Submit Respond</button>' +
  '</div>'+

            '</ion-content>' +

            '</ion-modal-view>', {
                scope: $scope,
                animation: 'slide-in-up'
            })
        $scope.modalcloseticket = $ionicModal.fromTemplate('<ion-modal-view>' +
            ' <ion-header-bar>' +
            '<div class="col">Close Ticket</div><div class="col text-right"><button ng-click="closeModalSSID()" class="button button-simson">Close</button></div>' +
            '</ion-header-bar>' +

            '<ion-content>' +

            ' <div class="list">' +

            '<div class="item item-input-inset">' +
            '<label class="item-input-wrapper">' +
            'Are your sure do you want to close this ticket as solved?' +
            '</label>' +
            '<button ng-click="closeticket(id);" class="button button-small button-simson">' +
            '<i class="icon ion-social-buffer"></i>Close Ticket' +
            '</button>' +
            '</div>' +

            '</div>' +

            '</ion-content>' +

            '</ion-modal-view>', {
                scope: $scope,
                animation: 'slide-in-up'
            })
		$scope.openModalreplyticket = function(ticketid) {

            $scope.id = ticketid;
            $scope.modalreplyticket.show();
        };
        $scope.openModalcloseticket = function(ticketid) {

          
            $scope.id = ticketid;
            $scope.modalcloseticket.show();
        };
        $scope.closeModalreplyticket = function() {
            $scope.modalreplyticket.hide();
        };
           $scope.closeModalcloseticket = function() {
            $scope.modalcloseticket.hide();
        };
        //Cleanup the modal when we're done with it!
        $scope.$on('$destroy', function() {
            $scope.modalreplyticket.remove();
        });
         $scope.$on('$destroy', function() {
            $scope.modalcloseticket.remove();
        });

        // Execute action on hide modal
        $scope.$on('modal.hidden', function() {
            // Execute action
        });

        // Execute action on remove modal
        $scope.$on('modal.removed', function() {
            // Execute action
        });
		});
		
		
		
    })
    .controller('loginCtrl', function($scope, $http, $state, $stateParams, Serv, $ionicPopup, $localStorage, $ionicLoading,$translate) {
$scope.curlang = $translate.use();
   var token = $localStorage.token;
   if (token === null){

   }else{
    var link = "https://api.billi.be/mobile/getsession/"+token;
     $http.get(link).then(function(res) {
   if(res.data.result == "true"){
$state.go('side.dash');
   }
                
            });



   }

$scope.login = function() {
            Serv.login($scope.login).then(function(data) {
                 $localStorage.token = data.data.token;

                if (data.data.result == "true") {
                    $scope.login = function(username, password) {
                    

                    };
                    $state.go('side.dash');
                } else {
                    $ionicPopup.alert({
                        title: "Error Message",
                        template: "Error Please Check User And Pass",
                        okText: 'Ok',
                        okType: 'button-positive'
                    });
                }
            });
        };         
    })
    .controller('MobileBlockCtrl', function($scope, $state, $ionicLoading, Serv, $ionicPopup, $localStorage, $stateParams,$translate) {
        var id = $stateParams.id;
$scope.curlang = $translate.use();
        $scope.block = function(reason) {
            $ionicLoading.show({
                template: '<ion-spinner icon="android"></ion-spinner>'
            });
            var link = 'https://api.billi.be/mobile/fullbar';
            $.ajax({
                type: "POST",
                url: link,
                dataType: "json",
                data: {
                    orderid: id,
                    val: '2',
                    reason: reason
                },
                success: function(data) {
                    $ionicLoading.hide();
                    //console.log(data);

                },
                error: function(e) {
                    alert('Error: ' + e.message);
                }
            });

        };
    })
     .controller('MobileUnBlockCtrl', function($scope, $state, $ionicLoading, Serv, $ionicPopup, $localStorage, $stateParams,$translate) {
        var id = $stateParams.id;
$scope.curlang = $translate.use();
        $scope.block = function(reason) {
            $ionicLoading.show({
                template: '<ion-spinner icon="android"></ion-spinner>'
            });
            var link = 'https://api.billi.be/mobile/fullbar';
            $.ajax({
                type: "POST",
                url: link,
                dataType: "json",
                data: {
                    orderid: id,
                    val: '0',
                    reason: reason
                },
                success: function(data) {
                    $ionicLoading.hide();
                    //console.log(data);

                },
                error: function(e) {
                    alert('Error: ' + e.message);
                }
            });

        };
    })
      .controller('ContactCtrl', function($scope,$translate) {

      })

    .controller('AccountCtrl', function($scope, $ionicLoading, $localStorage, Serv, $stateParams, $compile,$translate) {
		$scope.curlang = $translate.use();
        $scope.settings = {
            enableFriends: true
        };
        var dutch = '';
        var french = '';
        var english = '';
        var uuid = device.uuid;
        var link = "https://api.billi.be/mobile/getdetail";
        $ionicLoading.show({
            template: '<ion-spinner icon="android"></ion-spinner>'
        });
        $.ajax({
            type: "POST",
            url: link,
            dataType: "json",
            data: {
                uuid: uuid
            },

            success: function(kuman) {
                //console.log(kuman);

                $.each(kuman.language, function(i, item) {

                    if (item == 'dutch') {

                        var dutch = ' selected';
                    } else if (item == "french") {

                        var french = ' selected';
                    } else {

                        var english = ' selected';
                    }


                });
                $ionicLoading.hide();
                $("#Account").append($compile('<div class="card">' +
                    '<div class="item item-text-wrap">' +
                    '<p>Changing Information below will change your Invoice Information.</p>' +
                    '</div>' +
                    '</div>' +
                    '<div class="card">' +
                    '<div class="item item-text-wrap">' +
                    '<div class="list">' +
                    '<label class="item item-input">' +
                    '<span class="input-label">Firstname</span>' +
                    '<input type="text" class="kanan" value="' + kuman.firstname + '">' +
                    '</label>' +
                    '<label class="item item-input">' +
                    '<span class="input-label">Lastname</span>' +
                    '<input type="text" class="kanan" value="' + kuman.lastname + '">' +
                    '</label>' +
                    '<label class="item item-input">' +
                    '<span class="input-label">Address</span>' +
                    '<input type="text" class="kanan" value="' + kuman.address1 + '">' +
                    '</label>' +
                    '<label class="item item-input">' +
                    '<span class="input-label">Postcode</span>' +
                    '<input type="text" class="kanan" value="' + kuman.postcode + '">' +
                    '</label>' +
                    '<label class="item item-input">' +
                    '<span class="input-label">City</span>' +
                    '<input type="text" class="kanan" value="' + kuman.city + '">' +
                    '</label>' +
                    '<label class="item item-input">' +
                    '<span class="input-label">Country</span>' +
                    '<input type="text" class="kanan" value="' + kuman.country + '">' +
                    '</label>' +
                    '<label class="item item-input">' +
                    '<span class="input-label">Phonenumber</span>' +
                    '<input type="text" class="kanan" value="' + kuman.phonenumber + '">' +
                    '</label>' +
                    '<label class="item item-input">' +
                    '<span class="input-label">Email</span>' +
                    '<input type="text" class="kanan" value="' + kuman.email + '">' +
                    '</label>' +
                    '<label class="item item-input item-select">' +
                    '<div class="input-label">' +
                    'Language' +
                    '</div>' +
                    '<select>' +
                    '<option value="dutch"' + dutch + '>Dutch</option>' +
                    '<option value="english"' + english + '>English</option>' +
                    '<option value="french"' + french + '>French</option>' +
                    '</select>' +
                    '</label>' +
                    '<button class="button button-block button-simson">' +
                    'Save Information' +
                    '</button>' +
                    '</div></div></div>')($scope));


            },
            error: function(e) {
                alert('Error: ' + e.message);
            }
        });



    });