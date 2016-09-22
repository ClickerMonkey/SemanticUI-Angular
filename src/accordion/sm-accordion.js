(function(app)
{

  app
    .factory('SemanticAccordionLink', ['SemanticUI', SemanticAccordionLink])
    .directive('smAccordionBind', ['SemanticUI', SemanticAccordionBind])
    .directive('smAccordion', ['SemanticAccordionLink', SemanticAccordion])
    .directive('smAccordionGroup', SemanticAccordionGroup)
  ;

  var BEHAVIORS = {
    smAccordionOpen:        'open',
    smAccordionCloseOthers: 'close others',
    smAccordionClose:       'close',
    smAccordionToggle:      'toggle'
  };

  angular.forEach( BEHAVIORS, function(method, directive)
  {
    app.directive( directive, ['SemanticUI', function(SemanticUI)
    {
      return SemanticUI.createBehavior( directive, 'accordion', method );
    }]);
  });

  function SemanticAccordionBind(SemanticUI)
  {
    return SemanticUI.createBind( 'smAccordionBind', 'accordion' );
  }

  function SemanticAccordion(SemanticAccordionLink)
  {
    return {

      restrict: 'E',

      replace: true,

      transclude: true,

      scope: {
        /* Optional */
        settings: '=',
        onInit: '=',
        /* Events */
        onOpening: '=',
        onOpen: '=',
        onClosing: '=',
        onClose: '=',
        onChange: '='
      },

      template: '<div class="ui accordion" ng-transclude></div>',

      link: SemanticAccordionLink
    };
  }

  function SemanticAccordionLink(SemanticUI)
  {
    return function(scope, element, attributes)
    {
      element.ready(function()
      {
        var settings = scope.settings || {};

        SemanticUI.linkSettings( scope, element, attributes, 'accordion', true );

        SemanticUI.linkEvents( scope, settings, $.fn.accordion.settings, {
          onOpening:  'onOpening',
          onOpen:     'onOpen',
          onClosing:  'onClosing',
          onClose:    'onClose',
          onChange:   'onChange'
        });

        element.accordion( settings );

        if ( angular.isFunction( scope.onInit ) )
        {
          scope.onInit( element );
        }
      });
    };
  }

  function SemanticAccordionGroup()
  {
    return {
      restrict: 'E',
      required: 'title',
      transclude: true,
      scope: {
        /* Required */
        title: '=',
        /* Optional */
        active: '='
      },
      template: [
        '<div class="title" ng-class="{active: active}">',
        '  <i class="dropdown icon"></i>',
        '  {{ title }}',
        '</div>',
        '<div class="content" ng-class="{active: active}" ng-transclude>',
        '</div>'
      ].join('\n')
    }
  }

})( angular.module('semantic-ui-accordion', ['semantic-ui-core']) );
