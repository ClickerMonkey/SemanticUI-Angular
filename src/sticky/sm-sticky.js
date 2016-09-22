(function(app)
{

  app
    .factory('SemanticStickyLink', ['SemanticUI', SemanticStickyLink])
    .directive('smStickyBind', ['SemanticUI', SemanticStickyBind])
    .directive('smSticky', ['SemanticStickyLink', SemanticSticky])
  ;

  var BEHAVIORS = {
    smStickyRefresh:   'refresh'
  };

  angular.forEach( BEHAVIORS, function(method, directive)
  {
    app.directive( directive, ['SemanticUI', function(SemanticUI)
    {
      return SemanticUI.createBehavior( directive, 'sticky', method );
    }]);
  });

  function SemanticStickyBind(SemanticUI)
  {
    return SemanticUI.createBind( 'smStickyBind', 'sticky' );
  }

  function SemanticSticky(SemanticStickyLink)
  {
    return {

      restrict: 'E',

      replace: true,

      transclude: true,

      scope: {
        /* Optional */
        context: '@',
        settings: '=',
        onInit: '=',
        /* Events */
        onReposition: '=',
        onScroll: '=',
        onStick: '=',
        onUnstick: '=',
        onTop: '=',
        onBottom: '='
      },

      template: '<div class="ui sticky" ng-transclude></div>',

      link: SemanticStickyLink
    };
  }

  function SemanticStickyLink(SemanticUI)
  {
    return function(scope, element, attributes)
    {
      element.ready(function()
      {
        var settings = scope.settings || {};

        SemanticUI.linkSettings( scope, element, attributes, 'sticky', true );

        SemanticUI.linkEvents( scope, settings, $.fn.sticky.settings, {
          onReposition:   'onReposition',
          onScroll:       'onScroll',
          onStick:        'onStick',
          onStick:        'onStick',
          onTop:          'onTop',
          onBottom:       'onBottom'
        });

        if ( !settings.context )
        {
          settings.context = scope.context;
        }

        element.sticky( settings );

        if ( angular.isFunction( scope.onInit ) )
        {
          scope.onInit( element );
        }
      });
    };
  }

})( angular.module('semantic-ui-sticky', ['semantic-ui-core']) );
