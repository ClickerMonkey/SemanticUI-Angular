(function(app)
{

  app.directive('smDropdownBind', ['SemanticUI',
  function SemanticDropdownBind(SemanticUI)
  {
    return SemanticUI.createBind( 'smDropdownBind', 'dropdown' );
  }]);

  var BEHAVIORS = {
    smDropdownToggle:               'toggle',
    smDropdownShow:                 'show',
    smDropdownHide:                 'hide',
    smDropdownClear:                'clear',
    smDropdownHideOthers:           'hide others',
    smDropdownRestoreDefaults:      'restore defaults',
    smDropdownRestoreDefaultText:   'restore default text',
    smDropdownRestoreDefaultValue:  'restore default value',
    smDropdownSaveDefaults:         'save defaults',
    smDropdownSetSelected:          'set selected',
    smDropdownSetText:              'set text',
    smDropdownSetValue:             'set value',
    smDropdownBindTouchEvents:      'bind touch events',
    smDropdownMouseEvents:          'mouse events',
    smDropdownBindIntent:           'bind intent',
    smDropdownUnbindIntent:         'unbind intent',
    smDropdownSetActive:            'set active',
    smDropdownSetVisible:           'set visible',
    smDropdownRemoveActive:         'remove active',
    smDropdownRemoveVisible:        'remove visible'
  };

  angular.forEach( BEHAVIORS, function(method, directive)
  {
    app.directive( directive, ['SemanticUI', function(SemanticUI) 
    {
      return SemanticUI.createBehavior( directive, 'dropdown', method );
    }]);
  });

  app.directive('smDropdown', ['SemanticUI',
  function SemanticDropdown(SemanticUI) 
  {
    return {

      restrict: 'E',

      replace: true,

      transclude: true,

      scope: {
        /* Required */
        model: '=',
        items: '=',
        label: '&',
        value: '&',
        /* Optional */
        settings: '=',
        defaultText: '=',
        onInit: '=',
        /* Events */
        onChange: '=',
        onAdd: '=',
        onRemove: '=',
        onLabelCreate: '=',
        onLabelSelect: '=',
        onNoResults: '=',
        onShow: '=',
        onHide: '='
      },

      template: [
        '<div class="ui dropdown">',
          '<div class="text" sm-class-once="{default: hasDefault()}" sm-html-once="getText()"></div>',
          '<i class="dropdown icon"></i>',
          '<sm-flat-menu></sm-flat-menu>',
        '</div>'
      ].join('\n'),

      controller: function($scope) 
      {
        // Returns the value to be placed in the data-value attribute. If the computed value has a $$hashKey,
        // then return the hashKey. This enables the exact instance of the item to be set to the model.
        $scope.getValue = function(item)
        {
          // Computes the value given the expression in the 'value' attribute
          var value = $scope.value({item: item});

          return (value ? value.$$hashKey || value : value) + '';
        };

        // Determines whether this dropdown should currently display the default text.
        $scope.hasDefault = function() 
        {
          return ( $scope.defaultText && !$scope.findMatchingItem( $scope.model ) );
        }; 

        // Gets the current text for the drop down. If the current model has a value which is found
        // in the items, the appropriate item's label is displayed. Otherwise return the default text.
        $scope.getText = function() 
        {
          var selected = $scope.findMatchingItem( $scope.model );

          if ( selected ) 
          {
            return $scope.label({item: selected});
          }

          return $scope.defaultText;
        };

        // Finds an item instance that has the exact same value as the given value.
        $scope.findMatchingItem = function(value) 
        {
          var matching = null;

          angular.forEach( $scope.items, function(item) 
          {
            var itemValue = $scope.value({item: item});

            if ( itemValue === value ) 
            {
              matching = item;
            }
          });
          return matching;
        };
      },
      link: function(scope, element, attrs) 
      {
        var hashMap = {};

        var updateHashMap = function( items )
        {
          hashMap = {};

          angular.forEach( items, function(item)
          {
            if ( item.$$hashKey )
            {
              hashMap[ item.$$hashKey ] = item;
            }
          });
        };

        var unhash = function( x )
        {
          return x in hashMap ? hashMap[ x ] : x;
        };

        var applyValue = function( value )
        {
          if ( element.dropdown('is multiple') )
          {
            if ( value instanceof Array )
            {
              var translatedValue = [];

              for (var i = 0; i < value.length; i++)
              {
                var matching = scope.findMatchingItem( value[ i ] );

                if ( matching !== null )
                {
                  translatedValue.push( scope.getValue( matching ) );
                }
              }

              element.dropdown( 'set exactly', translatedValue );
            }
          }
          else
          {
            var matching = scope.findMatchingItem( value );

            if ( matching !== null )
            {
              element.dropdown( 'set selected', scope.getValue( matching ) );
            }
          }
        };

        element.ready(function()
        {
          var settings = scope.settings || {};

          // When the model changes, set the value on the drop down
          var modelWatcher = SemanticUI.watcher( scope, 'model', 
            function(updated) {
              applyValue( updated );
            }
          );

          // Inject an onChange function into the settings which sets the model value
          // and causes the scope to be updated.
          SemanticUI.onEvent( settings, 'onChange', 
            function(value) {
              if ( !element.dropdown('is multiple') ) {
                modelWatcher.set( unhash( value ) );
              }
            }
          );

          // When a new item is selected for multiple selection dropdowns, add it to the model.
          SemanticUI.onEvent( settings, 'onAdd',
            function(value) {
              var translated = unhash( value );
              var indexOf = $.inArray( translated, scope.model );
              if ( indexOf === -1 ) {
                var copy = $.extend( [], scope.model );
                copy.push( translated );
                modelWatcher.set( copy );
              }
            }
          );

          // When an item is deselected for multiple selection dropdowns, remove it from the model.
          SemanticUI.onEvent( settings, 'onRemove',
            function(value) {
              var translated = unhash( value );
              var indexOf = $.inArray( translated, scope.model );
              if ( indexOf !== -1 ) {
                var copy = $.extend( [], scope.model );
                copy.splice( indexOf, 1 );
                modelWatcher.set( copy );
              }
            }
          );

          SemanticUI.linkEvents( scope, settings, $.fn.dropdown.settings, {
            onChange:       'onChange',
            onAdd:          'onAdd',
            onRemove:       'onRemove',
            onLabelCreate:  'onLabelCreate',
            onLabelSelect:  'onLabelSelect',
            onNoResults:    'onNoResults',
            onShow:         'onShow',
            onHide:         'onHide'
          });

          // When items changes, rebuild the hashMap & reapply the values.
          scope.$watch( 'items', function( updated ) 
          {
            updateHashMap( scope.items );
            applyValue( scope.model );

          }, true );

          // Initialize the element with the given settings.
          element.dropdown( settings );

          // Rebuild the hashmap now
          updateHashMap( scope.items );

          // Apply current value
          applyValue( scope.model );

          // Save defaults
          element.dropdown( 'save defaults' );

          // Notify initialized callback.
          if ( angular.isFunction( scope.onInit ) ) 
          {
            scope.onInit( element );
          }

        });
      }
    }
  }]);

})( angular.module('semantic-ui') );