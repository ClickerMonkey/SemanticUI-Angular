(function(app)
{

  app.factory('SemanticUI', 
  function SemanticUI() 
  {
    return {
      bindAttribute: function(scope, variable, element, attribute)
      {
        scope.$watch( variable, function(updated)
        {
          element.attr( attribute, updated );
        });
      },
      onEvent: function(settings, evt, func)
      {
        settings[ evt ] = (function(existing) {
          return function EventHandler() {
            if ( angular.isFunction( existing ) ) {
              existing.apply( this, arguments );
            }
            func.apply( this, arguments );
          }
        })( settings[ evt ] );
      },
      linkEvents: function(scope, settings, linkings)
      {
        for (var evt in linkings)
        {
          var scopeVariable = linkings[ evt ];

          this.onEvent( settings, evt, function()
          {
            var scopeValue = scope[ scopeVariable ];

            if ( angular.isFunction( scopeValue ) )
            {
              scopeValue.apply( this, arguments );
            }
          });
        }
      },
      createBind: function(attribute, module)
      {
        var helper = this;
        var scope = {};
        scope[ attribute ] = '=';

        return {
          restrict: 'A',
          scope: scope,
          link: function(scope, element, attributes) {
            helper.initBind( scope, attribute, element, module );
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
        var helper = this;
        var scope = {};
        scope[ attribute ] = '=';

        return {
          restrict: 'A',
          scope: scope,
          link: function(scope, element, attributes) {
            helper.initBehavior( scope, attribute, element, module, method );
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
      watcher: function(scope, expression, func, context) 
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
            if ( scope[ expression ] != value )
            {
              scope.$evalAsync(function()
              {
                scope[ expression ] = value;
                ignoreUpdate = true;
              });
            }
          }
        }
      }
    };
  });

})( angular.module('semantic-ui', []) );