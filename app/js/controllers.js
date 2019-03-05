'use strict';

/* Controllers */

angular.module('angularRestfulAuth')
    .controller('HomeCtrl', ['$rootScope', '$scope', '$location', 'Main', function($rootScope, $scope, $location, Main) {
        //
        $scope.showCarousel = false;
        $scope.newsArticles = [];

        //Get  trending News
        $scope.trending = function() {
            console.log($scope.countryCode)
            $scope.newsAPI = 'https://newsapi.org/v2/top-headlines?country='+$scope.countryCode+'&pageSize=5&apiKey=b716b542cff64c48a68f946325d45fd3';

            Main.trending($scope.newsAPI, function(res) {
                //console.log(res.data.articles[0].title)
                $scope.newsData = res.data.articles;
                $scope.newsArticles = res.data.articles;
                $scope.count = res.data.articles.length;
                if(res.data.articles.length) $scope.showCarousel = true;
                $location.path('/')                                
            }, function() {
                $rootScope.error = 'Failed to Get Videos';
            })
        };


        //Get  Get Article Details
        $scope.getArticleDetails = function(url) {
          console.log("$scope.countryCode = ", url)
          $scope.diffBotAPI = 'https://api.diffbot.com/v3/article?token=8838f4cab8cb03773198988f371eb5a2&url='+ url;

          Main.articleDetails($scope.diffBotAPI, function(res) {
              console.log(res.data.objects[0].text)
              $scope.newsArticles.forEach(function(newsArticle){
                  if(newsArticle.url === url){
                    newsArticle.text = res.data.objects[0].text;
                  }
               })
              $location.path('/')                                
          }, function() {
              $rootScope.error = 'Failed article details';
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