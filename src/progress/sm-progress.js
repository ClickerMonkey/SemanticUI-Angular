(function(app)
{

  app.directive('smProgressBind', ['SemanticUI',
  function SemanticModalBind(SemanticUI)
  {
    return SemanticUI.createBind( 'smProgressBind', 'progress' );
  }]);

  var BEHAVIORS = {
  };

  angular.forEach( BEHAVIORS, function(method, directive)
  {
    app.directive( directive, ['SemanticUI', function(SemanticUI) 
    {
      return SemanticUI.createBehavior( directive, 'progress', method );
    }]);
  });

  app.directive('smProgress', ['SemanticUI',
  function SemanticProgress(SemanticUI) 
  {
    return {

      restrict: 'E',

      replace: true,

      transclude: true,

      scope: {
        /* Required */
        value: '=',
        /* Optional */
        showPercent: '@',
        onInit: '=',
        /* Events */
        onChange: '=',
        onSuccess: '=',
        onActive: '=',
        onError: '=',
        onWarning: '='
      },

      template: [
        '<div class="ui progress">',
        '  <div class="bar" style="transition-duration: 300ms; -webkit-transition-duration: 300ms; width: {{ value }}%;">',
        '    <div class="progress" ng-if="showPercent">{{ value }}%</div>',
        '  </div>',
        '  <div class="label" ng-transclude></div>',
        '</div>'
      ].join('\n'),

      link: function(scope, element, attributes)
      {
        var settings = scope.settings || {};

        SemanticUI.linkEvents( scope, settings, {
          onChange:   'onChange',
          onSuccess:  'onSuccess',
          onActive:   'onActive',
          onError:    'onError',
          onWarning:  'onWarning'
        });

        if ( angular.isFunction( scope.onInit ) ) {
          scope.onInit( element );
        }
      }
    };
  }]);

})( angular.module('semantic-ui') );



