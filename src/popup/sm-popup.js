(function(app)
{

  app
    .factory('SemanticPopupLink', ['SemanticUI', SemanticPopupLink])
    .factory('SemanticPopupInlineLink', ['SemanticUI', SemanticPopupInlineLink])
    .factory('SemanticPopupDisplayLink', ['SemanticUI', SemanticPopupDisplayLink])
    .directive('smPopupBind', ['SemanticUI', SemanticModalBind])
    .directive('smPopup', ['SemanticPopupLink', SemanticPopup])
    .directive('smPopupInline', ['SemanticPopupInlineLink', SemanticPopupInline])
    .directive('smPopupDisplay', ['SemanticPopupDisplayLink', SemanticPopupDisplay])
    .directive('smPopupDetached', [SemanticPopupDetached])
  ;

  var BEHAVIORS = {
    smPopupShow:        'show',
    smPopupHide:        'hide',
    smPopupHideAll:     'hide all',
    smPopupToggle:      'toggle',
    smPopupReposition:  'reposition',
    smPopupDestroy:     'destroy',
    smPopupRemove:      'remove popup'
  };

  angular.forEach( BEHAVIORS, function(method, directive)
  {
    app.directive( directive, ['SemanticUI', function(SemanticUI)
    {
      return SemanticUI.createBehavior( directive, 'popup', method );
    }]);
  });

  function SemanticModalBind(SemanticUI)
  {
    return SemanticUI.createBind( 'smPopupBind', 'popup' );
  }

  // An attribute directive which displays a popup for this element.
  function SemanticPopup(SemanticPopupLink)
  {
    return {

      restrict: 'A',

      scope: {
        /* Required */
        smPopup: '=',
        /* Optional */
        smPopupTitle: '=',
        smPopupHtml: '=',
        smPopupPosition: '@',
        smPopupVariation: '@',
        smPopupSettings: '=',
        smPopupOnInit: '=',
        /* Events */
        smPopupOnCreate: '=',
        smPopupOnRemove: '=',
        smPopupOnShow: '=',
        smPopupOnVisible: '=',
        smPopupOnHide: '=',
        smPopupOnHidden: '='
      },

      link: SemanticPopupLink
    };
  }

  function SemanticPopupLink(SemanticUI)
  {
    return function(scope, element, attributes)
    {
      var settings = scope.smPopupSettings || {};

      SemanticUI.linkSettings( scope, element, attributes, 'popup', false, 'smPopupSettings' );

      SemanticUI.bindAttribute( scope, 'smPopup', element, 'data-content' );
      SemanticUI.bindAttribute( scope, 'smPopupTitle', element, 'data-title' );
      SemanticUI.bindAttribute( scope, 'smPopupHtml', element, 'data-html' );
      SemanticUI.bindAttribute( scope, 'smPopupPosition', element, 'data-position' );
      SemanticUI.bindAttribute( scope, 'smPopupVariation', element, 'data-variation' );

      SemanticUI.linkEvents( scope, settings, {
        onCreate:  'smPopupOnCreate',
        onRemove:  'smPopupOnRemove',
        onShow:    'smPopupOnShow',
        onVisible: 'smPopupOnVisible',
        onHide:    'smPopupOnHide',
        onHidden:  'smPopupOnHidden'
      });

      element.popup( settings );

      if ( angular.isFunction( scope.smPopupOnInit ) )
      {
        scope.smPopupOnInit( element );
      }
    };
  }

  // An attribute directive to show the detached popup which follows this element.
  function SemanticPopupInline(SemanticPopupInlineLink)
  {
    return {

      restrict: 'A',

      scope: {
        /* Optional */
        smPopupInline: '=',
        smPopupInlineOnInit: '=',
        /* Events */
        smPopupInlineOnCreate: '=',
        smPopupInlineOnRemove: '=',
        smPopupInlineOnShow: '=',
        smPopupInlineOnVisible: '=',
        smPopupInlineOnHide: '=',
        smPopupInlineOnHidden: '='
      },

      link: SemanticPopupInlineLink
    };
  }

  function SemanticPopupInlineLink(SemanticUI)
  {
    return function(scope, element, attributes)
    {
      var settings = scope.smPopupInline || {};

      SemanticUI.linkSettings( scope, element, attributes, 'popup', false, 'smPopupInline' );

      SemanticUI.linkEvents( scope, settings, {
        onCreate:  'smPopupInlineOnCreate',
        onRemove:  'smPopupInlineOnRemove',
        onShow:    'smPopupInlineOnShow',
        onVisible: 'smPopupInlineOnVisible',
        onHide:    'smPopupInlineOnHide',
        onHidden:  'smPopupInlineOnHidden'
      });

      settings.inline = true;

      element.popup( settings );

      if ( angular.isFunction( scope.smPopupInlineOnInit ) ) {
        scope.smPopupInlineOnInit( element );
      }
    };
  }

  // An attribute directive to show a detached popup over this element given it's name.
  function SemanticPopupDisplay(SemanticPopupDisplayLink)
  {
    return {

      restrict: 'A',

      scope: {
        /* Required */
        smPopupDisplay: '@',
        /* Optional */
        smPopupDisplaySettings: '=',
        smPopupDisplayOnInit: '=',
        /* Events */
        smPopupDisplayOnCreate: '=',
        smPopupDisplayOnRemove: '=',
        smPopupDisplayOnShow: '=',
        smPopupDisplayOnVisible: '=',
        smPopupDisplayOnHide: '=',
        smPopupDisplayOnHidden: '='
      },

      link: SemanticPopupDisplayLink
    };
  }

  function SemanticPopupDisplayLink(SemanticUI)
  {
    return function(scope, element, attributes)
    {
      var settings = scope.smPopupDisplaySettings || {};

      SemanticUI.linkSettings( scope, element, attributes, 'popup', false, 'smPopupDisplaySettings' );

      SemanticUI.linkEvents( scope, settings, $.fn.popup.settings, {
        onCreate:  'smPopupDisplayOnCreate',
        onRemove:  'smPopupDisplayOnRemove',
        onShow:    'smPopupDisplayOnShow',
        onVisible: 'smPopupDisplayOnVisible',
        onHide:    'smPopupDisplayOnHide',
        onHidden:  'smPopupDisplayOnHidden'
      });

      settings.popup = '[data-popup-named="' + attributes.smPopupDisplay + '"]';

      element.popup( settings );

      if ( angular.isFunction( scope.smPopupDisplayOnInit ) ) {
        scope.smPopupDisplayOnInit( element );
      }
    };
  }

  // An element directive for a popup, can be used after an element or can be named and used with sm-popup-display.
  function SemanticPopupDetached()
  {
    return {

      restrict: 'E',

      replace: true,

      transclude: true,

      scope: {
        name: '@'
      },

      template: '<div class="ui popup" data-popup-named="{{ name }}" ng-transclude></div>'
    };
  }

})( angular.module('semantic-ui-popup', ['semantic-ui-core']) );
