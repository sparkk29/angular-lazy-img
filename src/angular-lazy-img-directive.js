angular.module('angularLazyImg')
  .directive('lazyImg', [
    '$rootScope', 'LazyImgMagic', function ($rootScope, LazyImgMagic) {
      'use strict';

      function link(scope, element, attributes) {
        var lazyImage = new LazyImgMagic(element),
            deregister = attributes.$observe('lazyImg', function (newSource) {
          if (newSource) {
            deregister();
            lazyImage.setSource(newSource);
          }
        });
        scope.$on('$destroy', function () {
          lazyImage.removeImage();
          if(!!$rootScope.lazyImgRefreshEvents) {
            for (var i=0; i< $rootScope.lazyImgRefreshEvents.length; i++) {
              $rootScope.lazyImgRefreshEvents[i]();
            }
          }
        });
        $rootScope.$on('lazyImg.runCheck', function () {
          lazyImage.checkImages();
        });
        if(!$rootScope.lazyImgRefreshEvents) {
          $rootScope.lazyImgRefreshEvents = [];
        }
        $rootScope.lazyImgRefreshEvents.push($rootScope.$on('lazyImg:refresh', function () {
          lazyImage.checkImages();
        }));
      }

      return {
        link: link,
        restrict: 'A'
      };
    }
  ])
  .directive('lazyImgContainer', [
    'LazyImgMagic', function (LazyImgMagic) {
      'use strict';

      function link(scope, element) {
        LazyImgMagic.addContainer(element);
        scope.$on('$destroy', function () {
          LazyImgMagic.removeContainer(element);
        });
      }

      return {
        link: link,
        restrict: 'A'
      };
    }
  ]);
