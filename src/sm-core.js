(function(app)
{

  app.factory('SemanticUI', 
  function SemanticUIFactory() 
  {
    var SemanticUI = 
    {
      bindAttribute: function(scope, variable, element, attribute)
      {
        scope.$watch( variable, function(updated)
        {
          element.attr( attribute, updated );
        });
      },
      onEvent: function(settings, evt, func, undefined)
      {
        settings[ evt ] = (function(existing) 
        {
          return function EventHandler() 
          {
            var result0 = undefined;

            if ( angular.isFunction( existing ) ) 
            {
              result0 = existing.apply( this, arguments );
            }
            
            var result1 = func.apply( this, arguments );

            return ( result0 !== undefined ? result0 : result1 );
          }
        })( settings[ evt ] );
      },
      linkEvents: function(scope, settings, defaults, linkings)
      {
        for (var evt in linkings)
        {
          (function(variable, evt)
          {
            SemanticUI.onEvent( settings, evt, function()
            {
              var scopeValue = scope[ variable ];

              if ( angular.isFunction( scopeValue ) )
              {
                return scopeValue.apply( this, arguments );
              }
              else
              {
                return defaults[ evt ].apply( this, arguments );
              }
            });

          })( linkings[ evt ], evt );
        }
      },
      createBind: function(attribute, module)
      {
        var scope = {};
        scope[ attribute ] = '=';

        return {
          restrict: 'A',
          scope: scope,
          link: function(scope, element, attributes) 
          {
            SemanticUI.initBind( scope, attribute, element, module );
          }
        };
      },
      initBind: function(scope, attribute, element, module)
      {
        element.ready(function()
        {
          element[ module ]( scope[ attribute ] );
        });
      },
      createBehavior: function(attribute, module, method)
      {
        var scope = {};
        scope[ attribute ] = '=';

        return {
          restrict: 'A',
          scope: scope,
          link: function(scope, element, attributes) 
          {
            SemanticUI.initBehavior( scope, attribute, element, module, method );
          }
        };
      },
      initBehavior: function(scope, attribute, element, module, method)
      {
        // Default settings on the attribute.
        var settings = {
          $: undefined,
          evt: 'click',
          enabled: true,
          value: undefined
        };

        // Grab the value the user passed in.
        var input = scope[ attribute ];
        
        // If the attribute value is a string, take it as the selector
        if ( angular.isString( input ) ) 
        {
          settings.$ = input;
        }
        // If the attribute value is an object, overwrite the defaults.
        else if ( angular.isObject( input ) ) 
        {
          if ( !angular.isString( input.evt ) ) input.evt = settings.evt;
          if ( !angular.isDefined( input.enabled ) ) input.enabled = settings.enabled;

          settings = input;
        }

        var onEvent = function() 
        {
          // If the trigger is currently enabled...
          if ( settings.enabled ) 
          {
            // Call the method on the module.
            $( settings.$ )[ module ]( method, settings.value ); 
          }
        };

        element.ready(function()
        {
          element.on( settings.evt, onEvent );
        });
      },
      async: function(scope, func)
      {
        return function() 
        {
          var context = this;
          var args = Array.prototype.slice.call( arguments );

          scope.$evalAsync(function()
          {
            func.apply( context, args );
          })
        }
      },
      watcher: function(scope, expression, func, context, force) 
      {
        var ignoreUpdate = false;

        scope.$watch( expression, function( updated )
        {
          if ( !ignoreUpdate )
          {
            func.call( context, updated );
          }

          ignoreUpdate = false;
        });

        return {
          set: function(value)
          {
            if ( scope[ expression ] != value || force )
            {
              scope.$evalAsync(function()
              {
                scope[ expression ] = value;
                ignoreUpdate = true;
              });
            }
          },
          update: function()
          {
            scope.$evalAsync(function()
            {
              ignoreUpdate = true;
            });
          }
        }
      }
    };

    return SemanticUI;
  });

})( angular.module('semantic-ui', []) );