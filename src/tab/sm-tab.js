(function(app)
{

  app
    .factory('SemanticTabMenuLink', ['SemanticUI', '$timeout', SemanticTabMenuLink])
    .directive('smTabBind', ['SemanticUI', SemanticTabBind])
    .directive('smTabMenu', ['SemanticTabMenuLink', SemanticTabMenu])
    .directive('smTab', ['SemanticUI', SemanticTab])
  ;

  var BEHAVIORS = {
    smTabSet:       'change tab'
  };

  angular.forEach( BEHAVIORS, function(method, directive)
  {
    app.directive( directive, ['SemanticUI', function(SemanticUI)
    {
      return SemanticUI.createBehavior( directive, 'tab', method );
    }]);
  });

  function SemanticTabBind(SemanticUI)
  {
    return SemanticUI.createBind( 'smTabBind', 'tab' );
  }

  function SemanticTabMenu(SemanticTabMenuLink)
  {
    return {

      restrict: 'E',

      replace: true,

      scope: {
        /* Required */
        tabs: '=',
        /* Optional */
        active: '=?',
        settings: '='
      },

      template: [
        '<div class="ui menu">',
        '  <a class="item" ng-repeat="(name, title) in tabs" ng-class="{active: name === active}" data-tab="{{ name }}" sm-html="title"></a>',
        '</div>'
      ].join('\n'),

      link: SemanticTabMenuLink
    }
  }

  function SemanticTabMenuLink(SemanticUI, $timeout)
  {
    return function(scope, element, attributes)
    {
      var setActiveTab = function( tab )
      {
        if ( tab )
        {
          element.tab( 'change tab', tab );
        }
      };

      $timeout(function()
      {
        var settings = scope.settings || {};
        var elements = element.children('.item');
        var hasActive = !!attributes.active;

        SemanticUI.linkSettings( scope, elements, attributes, 'tab', true );

        if ( hasActive )
        {
          var activeWatcher = SemanticUI.watcher( scope, 'active',
            function( tab ) {
              setActiveTab( tab );
            }
          );

          SemanticUI.onEvent( settings, 'onVisible',
            function(tab) {
              activeWatcher.set( tab );
            }
          );
        }

        elements.tab( settings );

        if ( hasActive )
        {
          setActiveTab( scope.active );
        }
      });
    };
  }

  function SemanticTab(SemanticUI)
  {
    return {

      restrict: 'E',

      replace: true,

      transclude: true,

      scope: {
        name: '@'
      },

      template: '<div class="ui tab" data-tab="{{ name }}" ng-transclude></div>'
    };
  }

})( angular.module('semantic-ui-tab', ['semantic-ui-core']) );
