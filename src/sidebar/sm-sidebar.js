(function(app)
{

  app.directive('smSidebarBind', ['SemanticUI', 
  function SemanticSidebarBind(SemanticUI)
  {
    return SemanticUI.createBind( 'smSidebarBind', 'sidebar' );
  }]);

  var BEHAVIORS = {
    smSidebarShow:           'show',
    smSidebarHide:           'hide',
    smSidebarToggle:         'toggle',
    smSidebarPushPage:       'push page',
    smSidebarPullPage:       'pull page',
    smSidebarAddBodyCss:     'add body css',
    smSidebarRemoveBodyCss:  'remove body css'
  };

  angular.forEach( BEHAVIORS, function(method, directive)
  {
    app.directive( directive, ['SemanticUI', function(SemanticUI) 
    {
      return SemanticUI.createBehavior( directive, 'sidebar', method );
    }]);
  });

  app.directive('smSidebar', ['SemanticUI',
  function SemanticSidebar(SemanticUI)
  {
    return {

      restrict: 'E',

      replace: true,

      scope: {
        /* Optional */
        visible: '=',
        settings: '=',
        onInit: '=',
        /* Events */
        onVisible: '=',
        onShow: '=',
        onChange: '=',
        onHide: '=',
        onHidden: '='
      },

      template: '<sm-flat-menu class="ui sidebar"></sm-flat-menu>',

      link: function(scope, element, attributes)
      {
        var settings = scope.settings || {};

        var visibleWatcher = SemanticUI.watcher( scope, 'visible', 
          function(updated) {
            element.sidebar( updated ? 'show' : 'hide' );
          }
        );

        SemanticUI.onEvent( settings, 'onHide', 
          function() {
            visibleWatcher.set( false );
          }
        );

        SemanticUI.onEvent( settings, 'onShow', 
          function() {
            visibleWatcher.set( true );
          }
        );

        SemanticUI.linkEvents( scope, settings, {
          onVisible: 'onVisible',
          onShow:    'onShow',
          onChange:  'onChange',
          onHide:    'onHide',
          onHidden:  'onHidden'
        });

        // Initialize the element with the given settings.
        element.sidebar( settings );

        if ( angular.isFunction( scope.onInit ) ) {
          scope.onInit( element );
        }
      }
    };
  }]);

})( angular.module('semantic-ui') );

