(function(app)
{

  app
    .factory('SemanticSearchLink', ['SemanticUI', SemanticSearchLink])
    .directive('smSearchBind', ['SemanticUI', SemanticSearchBind])
    .directive('smSearch', ['SemanticSearchLink', SemanticSearch])
  ;

  var BEHAVIORS = {
    smSearchQuery:        'query',
    smSearchCancelQuery:  'cancel query',
    smSearchSearchLocal:  'search local',
    smSearchSearchRemote: 'search remote',
    smSearchSet:          'set value',
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

  function SemanticSearchBind(SemanticUI)
  {
    return SemanticUI.createBind( 'smSearchBind', 'search' );
  }

  function SemanticSearch(SemanticSearchLink)
  {
    return {

      restrict: 'E',

      replace: true,

      scope: {
        /* Required */
        model: '=',
        /* Optional */
        text: '=?',
        icon: '@',
        placeholder: '@',
        category: '@',
        local: '=',
        remote: '@',
        settings: '=',
        onInit: '=',
        /* Events */
        onSelect: '=',
        onResultsAdd: '=',
        onSearchQuery: '=',
        onResults: '=',
        onResultsOpen: '=',
        onResultsClose: '='
      },

      template: [
        '<div class="ui search" ng-class="{category: category}">',
        '  <div class="ui input" ng-class="{icon: icon}">',
        '    <input class="prompt" type="text" placeholder="{{ placeholder }}" ng-model="text">',
        '    <i ng-if="icon" class="{{ icon }} icon"></i>',
        '  </div>',
        '  <div class="results"></div>',
        '</div>'
      ].join('\n'),

      link: SemanticSearchLink
    };
  }

  function SemanticSearchLink(SemanticUI)
  {
    var defaultTitle = $.fn.search && $.fn.search.settings && $.fn.search.settings.fields ? $.fn.search.settings.fields.title : '';

    return function(scope, element, attributes)
    {
      var settings = scope.settings || {};
      var textProperty = settings.fields && settings.fields.title ? settings.fields.title : defaultTitle;

      SemanticUI.linkSettings( scope, element, attributes, 'search' );

      if ( scope.local ) settings.source = scope.local;
      if ( scope.remote ) settings.apiSettings = { url: scope.remote };
      if ( scope.category ) settings.type = 'category';

      var modelWatcher = SemanticUI.watcher( scope, 'model',
        function(value) {
          element.search( 'set value', value && (textProperty in value) ? value[ textProperty ] : value );
        }
      );

      SemanticUI.onEvent( settings, 'onSelect',
        function(result, response) {
          modelWatcher.set( result );
          if ( attributes.text ) {
            scope.$evalAsync(function() {
              scope.text = result[ textProperty ];
            });
          }
        }
      );

      SemanticUI.linkEvents( scope, settings, $.fn.search.settings, {
        onSelect:         'onSelect',
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

      if ( scope.model && attributes.text && textProperty in scope.model ) {
        scope.text = scope.model[ textProperty ];
      }
    };
  }

})( angular.module('semantic-ui-search', ['semantic-ui-core']) );
