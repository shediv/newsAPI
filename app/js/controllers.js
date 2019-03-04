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
                console.log(res.data.articles[0].title)
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

.controller('SliderController', function($scope, $timeout) {

    var settings = {
      animation: $scope.animation || 'animate-fade',
      interval: $scope.interval || 6000
    };

    $scope.activeIndex = 0;

    $scope.setActiveIndex = function(index) {

      $scope.isPrev = index < $scope.activeIndex;

      $scope.activeIndex = index;
    };

    $scope.setAnimation = function(animation) {

      return animation || settings.animation;
    };

    $scope.isActiveIndex = function(index) {

      return $scope.activeIndex === index;
    };

    $scope.next = function() {

      $scope.isPrev = false;

      $scope.activeIndex = $scope.activeIndex < $scope.slides.length - 1 ? $scope.activeIndex + 1 : 0;
    };

    $scope.prev = function() {

      $scope.isPrev = true;

      $scope.activeIndex = $scope.activeIndex > 0 ? $scope.activeIndex - 1 : $scope.slides.length - 1;
    };

    $scope.readMore = function() {
        debugger

        $scope.isPrev = true;
  
        $scope.activeIndex = $scope.activeIndex > 0 ? $scope.activeIndex - 1 : $scope.slides.length - 1;
      };

    if (settings.interval) {

      var interval;

      $scope.play = function() {

        interval = $timeout(function() {

           $scope.next();
        }, settings.interval);
      };

      $scope.pause = function() {

        $timeout.cancel(interval);
      };

      $scope.$watch('activeIndex', function() {

        $scope.pause();
        $scope.play();
      });
    }
  })

  .directive('slider', function() {

    return {
      restrict: 'EA',
      replace: true,
      transclude: true,
      scope: {
        slides: '=',
        animation: '=',
        interval: '='
      },
      controller: 'SliderController',
      templateUrl: 'slider.html'
    };
  });