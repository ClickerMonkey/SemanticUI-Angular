(function(app)
{

  app.directive('smHtml', 
  function SemanticHtml() {
    return {
      restrict: 'A',
      transclude: true,
      link: function(scope, element, attributes) 
      {
        scope.$watch( attributes.smHtml, function(value) {
          element.html( value );
        });
      }
    }
  });

  app.directive('smHtmlOnce', ['$parse',
  function SemanticHtmlOnce($parse) {
    return {
      restrict: 'A',
      link: function(scope, element, attributes) 
      {
        element.html( $parse( attributes.smHtmlOnce )( scope ) );
      }
    }
  }]);

  app.directive('smClassOnce', ['$parse',
  function SemanticClassOnce($parse)
  {
    return {
      restrict: 'A',
      link: function(scope, element, attributes) 
      {
        var classes = $parse( attributes.smClassOnce )( scope );
        
        angular.forEach( classes, function( addClass, className )
        {
          element.toggleClass( className, addClass );
        });
      }
    }
  }]);

  app.directive('smButton', 
  function SemanticButton() 
  {
    return {
      restrict: 'E',
      replace: true,
      transclude: true,
      template: '<button class="ui button" ng-transclude></button>'
    };
  });

  app.directive('smMenuItem',
  function SemanticItem()
  {
    return {
      restrict: 'E',
      replace: true,
      transclude: true,
      scope: {
        icon: '@'
      },
      template: '<a class="item"><i class="{{ icon }} icon" ng-if="icon"></i><span ng-transclude></span></a>'
    }
  });

  app.directive('smAttrs',
  function SemanticAttrs()
  {
    return {
      restrict: 'A',
      scope: {
        smAttrs: '='
      },
      link: function(scope, element, attributes) {
        angular.forEach( scope.smAttrs, function(val, key) {
          if ( angular.isNumber( val ) || angular.isString( val ) ) {
            element.attr( key, val ); 
          }
        });
      }
    }
  });

  app.directive('smLiveAttrs',
  function SemanticLiveAttrs()
  {
    return {
      restrict: 'A',
      scope: {
        smLiveAttrs: '='
      },
      link: function(scope, element, attributes) {
        var expression = function() {
          return scope.smLiveAttrs;
        };
        var setter = function() {
          angular.forEach( scope.smLiveAttrs, function(val, key) {
            if ( angular.isNumber( val ) || angular.isString( val ) ) {
              element.attr( key, val ); 
            }
          });
        };
        scope.$watch( expression, setter, true );
      }
    }
  });

  app.directive('smData',
  function SemanticData()
  {
    return {
      restrict: 'A',
      scope: {
        smData: '='
      },
      link: function(scope, element, attributes) {
        element.data( scope.smData );
      }
    }
  });

  app.directive('smLiveData',
  function SemanticLiveData()
  {
    return {
      restrict: 'A',
      scope: {
        smData: '='
      },
      link: function(scope, element, attributes) {
        var expression = function() {
          return scope.smData;
        };
        var setter = function() {
          element.data( scope.smData );
        };
        scope.$watch( expression, setter, true );
      }
    }
  });

  app.directive('smFlatMenu', 
  function SemanticFlatMenu() {
    return {
      restrict: 'E',
      replace: true,
      template: [
        '<div class="menu">',
        '  <div class="item" ng-repeat="item in items" data-value="{{ getValue(item) }}" sm-html="label({item:item})"></div>',
        '</div>'
      ].join('\n')
    }
  });

})( angular.module('semantic-ui') );