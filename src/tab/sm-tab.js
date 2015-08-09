(function(app)
{

  app.directive('smTabBind', ['SemanticUI', 
  function SemanticTabBind(SemanticUI)
  {
    return SemanticUI.createBind( 'smTabBind', 'tab' );
  }]);

  var BEHAVIORS = {
    smTabReset:     'reset',
    smTabShow:      'show',
    smTabHide:      'hide',
    smTabDestroy:   'destroy'
  };

  angular.forEach( BEHAVIORS, function(method, directive)
  {
    app.directive( directive, ['SemanticUI', function(SemanticUI) 
    {
      return SemanticUI.createBehavior( directive, 'tab', method );
    }]);
  });

  app.directive('smTabMenu', ['SemanticUI', 
  function SemanticTabMenu(SemanticUI)
  {
    return {

      restrict: 'E',

      replace: true,

      scope: {
        tabs: '=',
        active: '@'
      },

      template: [
        '<div class="ui menu">',
        '  <a class="item" ng-repeat="(name, title) in tabs" ng-class="{active: name === active}" data-tab="{{ name }}">{{ title }}</a>',
        '</div>'
      ].join('\n'),

      controller: function($scope)
      {
        if ( !($scope.active in $scope.tabs) )
        {
          for (var prop in $scope.tabs)
          {
            $scope.active = prop;
            break;
          }
        }
      },

      link: function(scope, element, attributes)
      {
        element.ready(function()
        {
          var settings = scope.settings || {};
          var elements = element.children('.item');

          SemanticUI.linkSettings( scope, elements, attributes, 'tab' );

          elements.tab( settings );
        });
      }
    }
  }]);

  app.directive('smTab', ['SemanticUI',
  function SemanticTab(SemanticUI)
  {
    return {

      restrict: 'E',

      replace: true,

      transclude: true,

      scope: {
        name: '@'
      },

      template: '<div class="ui bottom attached tab segment" data-tab="{{ name }}" ng-transclude></div>'
    };
  }]);

})( angular.module('semantic-ui') );