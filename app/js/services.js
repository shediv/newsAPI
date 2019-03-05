'use strict';

angular.module('angularRestfulAuth')
    .factory('Main', ['$http', function($http){
        return {
            //Get Trending News
            trending: function(getUrl, success, error) {
                $http.get(getUrl).then(success, error);
            },
            
            //Get article details
            articleDetails: function(getUrl, success, error) {
                $http.get(getUrl).then(success, error);
            },

            //Get article summary
            articleDetails2: function(content) {
                var text = content;
                var data = $.param({
                    text: text,
                });
                var config = {
                    headers : {
                        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;',
                        'Api-Key': '2f48bcb7-ae37-4ba8-9b3c-ed2bad081c93'
                    }
                }
    
                return $http.post('https://api.deepai.org/api/summarization', data, config).then(function(response){
                    return response.data;
                });

            }
        };
    }
]);