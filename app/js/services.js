'use strict';

angular.module('angularRestfulAuth')
    .factory('Main', ['$http', function($http){
        return {
            //Get Trending News
            trending: function(getUrl, success, error) {
                $http.get(getUrl).then(success, error);
            },
            
            //Get Trending News
            articleDetails: function(getUrl, success, error) {
                $http.get(getUrl).then(success, error);
            }
        };
    }
]);