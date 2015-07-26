(function(app)
{

  app.directive('smSearchBind', ['SemanticUI', 
  function SemanticSearchBind(SemanticUI)
  {
    return SemanticUI.createBind( 'smSearchBind', 'search' );
  }]);

  var BEHAVIORS = {
    smSearchQuery:        'query',
    smSearchCancelQuery:  'cancel query',
    smSearchSearchLocal:  'search local',
    smSearchSearchRemote: 'search remote',
    smSearchSetValue:     'set value',
    smSearchShowResults:  'show results',
    smSearchHideResults:  'hide results',
    smSearchDestroy:      'destroy'
  };

  angular.forEach( BEHAVIORS, function(method, directive)
  {
    app.directive( directive, ['SemanticUI', function(SemanticUI) 
    {
      return SemanticUI.createBehavior( directive, 'search', method );
    }]);
  });

  app.directive('smSearch', ['SemanticUI',
  function SemanticSearch(SemanticUI)
  {
    return {

      restrict: 'E',

      replace: true,

      scope: {
        /* Required */
        value: '=',
        /* Optional */
        icon: '@',
        placeholder: '@',
        local: '=',
        remove: '@',
        settings: '=',
        onInit: '=',
        /* Events */
        onResultsAdd: '=',
        onSearchQuery: '=',
        onResults: '=',
        onResultsOpen: '=',
        onResultsClose: '='
      },

      template: [
        '<div class="ui search">',
        '  <div class="ui icon input">',
        '    <input class="prompt" type="text" placeholder="{{ placeholder }}" ng-model="value">',
        '    <i class="{{ icon }} icon"></i>',
        '  </div>',
        '  <div class="results"></div>',
        '</div>'
      ].join('\n'),

      controller: function($scope)
      {
        $scope.icon = $scope.icon || 'search';
      },

      link: function(scope, element, attributes) 
      {
        var settings = scope.settings || {};

        if ( scope.local )
        {
          settings.source = scope.local;
        }

        if ( scope.remote )
        {
          settings.apiSettings = {
            url: scope.remote
          };
        }

        SemanticUI.linkEvents( scope, settings, {
          onResultsAdd:     'onResultsAdd',
          onSearchQuery:    'onSearchQuery',
          onResults:        'onResults',
          onResultsOpen:    'onResultsOpen',
          onResultsClose:   'onResultsClose'
        });

        element.search( settings );

        if ( angular.isFunction( scope.onInit ) ) {
          scope.onInit( element );
        }
      }
    };
  }]);

})( angular.module('semantic-ui') );