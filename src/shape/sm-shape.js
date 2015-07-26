(function(app)
{

  app.directive('smShapeBind', ['SemanticUI', 
  function SemanticShapeBind(SemanticUI)
  {
    return SemanticUI.createBind( 'smShapeBind', 'shape' );
  }]);

  var BEHAVIORS = {
    smShapeFlipUp:          'flip up',
    smShapeFlipDown:        'flip down',
    smShapeFlipLeft:        'flip left',
    smShapeFlipRight:       'flip right',
    smShapeFlipOver:        'flip over',
    smShapeFlipBack:        'flip back',
    smShapeSetNextSide:     'set next side',
    smShapeReset:           'reset',
    smShapeQueue:           'queue',
    smShapeRepaint:         'repaint',
    smShapeSetDefaultSide:  'set default side',
    smShapeSetStageSize:    'set stage size',
    smShapeRefresh:         'refresh'
  };

  angular.forEach( BEHAVIORS, function(method, directive)
  {
    app.directive( directive, ['SemanticUI', function(SemanticUI) 
    {
      return SemanticUI.createBehavior( directive, 'shape', method );
    }]);
  });

})( angular.module('semantic-ui') );