// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic'])
    .run(function ($ionicPlatform) {
        $ionicPlatform.ready(function () {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if (window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            }
            if (window.StatusBar) {
                StatusBar.styleDefault();
            }
        });
    })
    .directive('collection', function () {
        return {
            restrict: "E",
            replace: true,
            scope: {
                collection: '='
            },
            template: "<ul><ion-item class='item-stable' ng-click='toggleGroup(groups)' ng-class='{active: isGroupShown(groups)}'> <i class='icon' ng-class=\"isGroupShown(groups) ? 'ion-minus' : 'ion-plus'\"></i><member ng-repeat='member in collection' member='member'></member></ion-item></ul>"
        }
    })

    .directive('member', function ($compile) {
        return {
            restrict: "E",
            replace: true,
            scope: {
                member: '='
            },
            template: "<li> {{member.training_resource_name}}</li>",
            link: function (scope, element, attrs) {
                if (angular.isArray(scope.member.items)) {
                    element.append("<collection collection='member.items'></collection>");
                    $compile(element.contents())(scope)
                }
            }
        }
    })

    .controller('MyCtrl', function ($scope, $http) {
        $scope.groups = [];
        $scope.loading = false;


        $scope.init = function () {
            $scope.loading = true;
            $http.get('http://trainingresource.app/api/training_resource').
                success(function (data, status, headers, config) {

                    function convert(data) {

                        var map = {};
                        for (var i = 0; i < data.length; i++) {
                            var obj = data[i];
                            obj.items = [];

                            map[obj.training_resource_id] = obj;

                            var parent = obj.training_resource_parentResourceId || '-';
                            if (!map[parent]) {
                                map[parent] = {
                                    items: []
                                };
                            }
                            map[parent].items.push(obj);
                            //var prova = map[parent].items.count();
                        }

                        return map['-'].items;

                    }

                    var r = convert(data)
                    $scope.groups = r;
                    $scope.loading = false;

                    /*for (var i=0; i < r.length; i++) {
                        $scope.groups[i] = {

                            items: [groups[i].items]
                        };
                        for (var j=0; j < groups[i].items.length; j++) {
                            $scope.groups[i].items.push(groups[i].items);
                        }
                    }*/

                    /*
                     * if given group is the selected group, deselect it
                     * else, select the given group
                     */
                    $scope.toggleGroup = function(group) {
                        if ($scope.isGroupShown(group)) {
                            $scope.shownGroup = null;
                        } else {
                            $scope.shownGroup = group;
                        }
                    };
                    $scope.isGroupShown = function(group) {
                        return $scope.shownGroup === group;
                    };

                });
        }
        $scope.init();


    });