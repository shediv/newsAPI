'use strict';

angular.module('angularRestfulAuth', [
    'ngRoute',
    'angular-loading-bar'
])
.config(['$routeProvider', '$httpProvider', function ($routeProvider, $httpProvider) {

    $routeProvider.
        when('/', {
            templateUrl: 'partials/videos.html',
            controller: 'HomeCtrl'
        }).
        otherwise({
            redirectTo: '/'
        });
    }
]);