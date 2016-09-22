(function(app)
{

  // Transitions: scale, fade, flip, drop, fly, swing, browse, slide, jiggle, flash, shake, pulse, tada, bounce

  app
    .factory('SemanticTransitionLink', ['SemanticUI', SemanticTransitionLink])
    .directive('smTransition', ['SemanticTransitionLink', SemanticTransition])
  ;

  function SemanticTransition(SemanticTransitionLink)
  {
    return {

      restrict: 'A',

      scope: {
        smTransition: '@',
        smTransitionEvents: '@',
        smTransitionOther: '@'
      },

      link: SemanticTransitionLink
    };
  }

  function SemanticTransitionLink(SemanticUI)
  {
    return function(scope, element, attributes)
    {
      scope.smTransitionEvents = scope.smTransitionEvents || 'click';

      element.on( scope.smTransitionEvents, function()
      {
        ( scope.smTransitionOther ? $( scope.smTransitionOther ) : element ).transition( scope.smTransition );
      });
    };
  }

})( angular.module('semantic-ui-transition', ['semantic-ui-core']) );
