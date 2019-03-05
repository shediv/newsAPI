'use strict';

/* Controllers */

angular.module('angularRestfulAuth')
    .controller('HomeCtrl', ['$rootScope', '$scope', '$location', 'Main', function($rootScope, $scope, $location, Main) {
        //
        $scope.showCarousel = false;
        $scope.slides = [];

        //Get  trending News
        $scope.trending = function() {
            console.log($scope.countryCode)
            $scope.newsAPI = 'https://newsapi.org/v2/top-headlines?country='+$scope.countryCode+'&pageSize=5&apiKey=b716b542cff64c48a68f946325d45fd3';

            Main.trending($scope.newsAPI, function(res) {
                //console.log(res.data.articles[0].title)
                $scope.newsData = res.data.articles;
                $scope.newsArticles = res.data.articles;
                $scope.slides = res.data.articles;
                $scope.count = res.data.articles.length;
                if(res.data.articles.length) $scope.showCarousel = true;
                $location.path('/')                                
            }, function() {
                $rootScope.error = 'Failed to Get Videos';
            })
        };

    }])

.controller('MeCtrl', ['$rootScope', '$scope', '$location', 'Main', function($rootScope, $scope, $location, Main) {

        Main.me(function(res) {
            $scope.myDetails = res;
        }, function() {
            $rootScope.error = 'Failed to fetch details';
        })
}])