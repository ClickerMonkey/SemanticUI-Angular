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
        settings[ evt ] = (function(existing) 
        {
          return function EventHandler() 
          {
            if ( angular.isFunction( existing ) ) 
            {
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
(function(app)
{

  app.directive('smHtml', 
  function SemanticHtml() {
    return {
      restrict: 'A',
      transclude: true,
      link: function(scope, element, attributes) 
      {
        scope.$watch( attributes.smHtml, function(value) {
          element.html( value );
        });
      }
    }
  });

  app.directive('smButton', 
  function SemanticButton() 
  {
    return {
      restrict: 'E',
      replace: true,
      transclude: true,
      template: '<button class="ui button" ng-transclude></button>'
    };
  });

  app.directive('smMenuItem',
  function SemanticItem()
  {
    return {
      restrict: 'E',
      replace: true,
      transclude: true,
      scope: {
        icon: '@'
      },
      template: '<a class="item"><i class="{{ icon }} icon" ng-if="icon"></i><span ng-transclude></span></a>'
    }
  });

  app.directive('smAttrs',
  function SemanticAttrs()
  {
    return {
      restrict: 'A',
      scope: {
        smAttrs: '='
      },
      link: function(scope, element, attributes) {
        angular.forEach( scope.smAttrs, function(val, key) {
          if ( angular.isNumber( val ) || angular.isString( val ) ) {
            element.attr( key, val ); 
          }
        });
      }
    }
  });

  app.directive('smLiveAttrs',
  function SemanticLiveAttrs()
  {
    return {
      restrict: 'A',
      scope: {
        smLiveAttrs: '='
      },
      link: function(scope, element, attributes) {
        var expression = function() {
          return scope.smLiveAttrs;
        };
        var setter = function() {
          angular.forEach( scope.smLiveAttrs, function(val, key) {
            if ( angular.isNumber( val ) || angular.isString( val ) ) {
              element.attr( key, val ); 
            }
          });
        };
        scope.$watch( expression, setter, true );
      }
    }
  });

  app.directive('smData',
  function SemanticData()
  {
    return {
      restrict: 'A',
      scope: {
        smData: '='
      },
      link: function(scope, element, attributes) {
        element.data( scope.smData );
      }
    }
  });

  app.directive('smLiveData',
  function SemanticLiveData()
  {
    return {
      restrict: 'A',
      scope: {
        smData: '='
      },
      link: function(scope, element, attributes) {
        var expression = function() {
          return scope.smData;
        };
        var setter = function() {
          element.data( scope.smData );
        };
        scope.$watch( expression, setter, true );
      }
    }
  });

  app.directive('smFlatMenu', 
  function SemanticFlatMenu() {
    return {
      restrict: 'E',
      replace: true,
      template: [
        '<div class="menu">',
        '  <div class="item" ng-repeat="item in items" data-value="{{ getValue(item) }}" sm-html="label({item:item})"></div>',
        '</div>'
      ].join('\n')
    }
  });

})( angular.module('semantic-ui') );
(function(app)
{

  app.directive('smAccordionBind', ['SemanticUI',
  function SemanticAccordionBind(SemanticUI)
  {
    return SemanticUI.createBind( 'smAccordionBind', 'accordion' );
  }]);

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

  app.directive('smAccordion', ['SemanticUI',
  function SemanticAccordion(SemanticUI) 
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
      link: function(scope, element, attributes)
      {
        element.ready(function()
        {
          var settings = scope.settings || {};

          SemanticUI.linkEvents( scope, settings, {
            onOpening: 'onOpening',
            onOpen: 'onOpen',
            onClosing: 'onClosing',
            onClose: 'onClose',
            onChange: 'onChange'
          });

          element.accordion( settings );

          if ( angular.isFunction( scope.onInit ) )
          {
            scope.onInit( element );
          } 
        })
      }
    };
  }]);

  app.directive('smAccordionGroup',
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
  });

})( angular.module('semantic-ui') );
(function(app)
{

  app.directive('smCheckboxBind', ['SemanticUI',
  function SemanticCheckboxBind(SemanticUI)
  {
    return SemanticUI.createBind( 'smCheckboxBind', 'checkbox' );
  }]);

  var BEHAVIORS = {
    smCheckboxToggle:            'toggle',
    smCheckboxCheck:             'check',
    smCheckboxUncheck:           'uncheck',
    smCheckboxIndeterminate:     'indeterminate',
    smCheckboxDeterminate:       'determinate',
    smCheckboxEnable:            'enable',
    smCheckboxDisable:           'disable'
  };

  angular.forEach( BEHAVIORS, function(method, directive)
  {
    app.directive( directive, ['SemanticUI', function(SemanticUI) 
    {
      return SemanticUI.createBehavior( directive, 'checkbox', method );
    }]);
  });

  app.directive('smCheckbox', ['SemanticUI',
  function SemanticCheckbox(SemanticUI) 
  {
    return {

      restrict: 'E',

      required: ['model', 'label'],

      replace: true,

      transclude: true,

      scope: {
        /* Required */
        model: '=',
        label: '@',
        /* Optional */
        settings: '=',
        enabled: '=',
        indeterminateValue: '=',
        checkedValue: '=',
        uncheckedValue: '=',
        children: '@',
        onInit: '=',
        /* Events */
        onChange:        '=',
        onChecked:       '=',
        onIndeterminate: '=',
        onDeterminate:   '=',
        onUnchecked:     '=',
        onEnable:        '=',
        onDisable:       '='
      },

      template: [
        '<div class="ui checkbox">',
        '  <input type="checkbox">',
        '  <label>{{ label }}</label>',
        '</div>'
      ].join('\n'),

      link: function(scope, element, attrs) 
      {
        element.ready(function()
        {
          var settings = scope.settings || {};

          var checkedValue = function() {
            return angular.isDefined( scope.checkedValue ) ? scope.checkedValue : true;
          };
          var uncheckedValue = function() {
            return angular.isDefined( scope.uncheckedValue ) ? scope.uncheckedValue : false;
          };
          var indeterminateValue = function() {
            return angular.isDefined( scope.indeterminateValue ) ? scope.indeterminateValue : void 0;
          };

          var modelWatcher = SemanticUI.watcher( scope, 'model', 
            function(updated) {
              if ( angular.isDefined( updated ) ) {
                element.checkbox( updated ? 'set checked' : 'set unchecked' );
              }
            }
          );

          var enabledWatcher = SemanticUI.watcher( scope, 'enabled',
            function(updated) {
              if ( angular.isDefined( updated ) ) {
                element.checkbox( updated ? 'set enabled' : 'set disabled' ); 
              }
            }
          );

          SemanticUI.onEvent( settings, 'onChecked', 
            function() {
              modelWatcher.set( checkedValue() );
            }
          );

          SemanticUI.onEvent( settings, 'onUnchecked', 
            function() {
              modelWatcher.set( uncheckedValue() );
            }
          );

          SemanticUI.onEvent( settings, 'onIndeterminate', 
            function() {
              modelWatcher.set( indeterminateValue() );
            }
          );

          SemanticUI.onEvent( settings, 'onEnable', 
            function(value) {
              enabledWatcher.set( true );
            }
          );

          SemanticUI.onEvent( settings, 'onDisable', 
            function(value) {
              enabledWatcher.set( false );
            }
          );

          SemanticUI.linkEvents( scope, settings, {
            onChange:        'onChange',
            onChecked:       'onChecked',
            onIndeterminate: 'onIndeterminate',
            onDeterminate:   'onDeterminate',
            onUnchecked:     'onUnchecked',
            onEnable:        'onEnable',
            onDisable:       'onDisable'
          });

          // If the checkbox has children, link the value of this checkbox to the children
          if ( scope.children )
          {
            var $children = $( scope.children );
            var settingChildren = false;

            SemanticUI.onEvent( settings, 'onChecked',
              function() {
                settingChildren = true;
                $children.checkbox( 'check' );
                settingChildren = false;
              }
            );
            SemanticUI.onEvent( settings, 'onUnchecked',
              function() {
                settingChildren = true;
                $children.checkbox( 'uncheck' );
                settingChildren = false;
              }
            );

            $children.children('input[type=checkbox], input[type=radio]')
              .change(function() {

                if ( settingChildren ) {
                  return;
                }

                var checked = 0;

                $children.each(function(i, child) {
                  if ( $( child ).checkbox( 'is checked') ) {
                    checked++;
                  }
                });

                if ( checked === 0 ) {
                  element.checkbox( 'uncheck' );
                } 
                else if ( checked === $children.length ) {
                  element.checkbox( 'check' );
                }
                else {
                  element.checkbox( 'indeterminate' );
                }
              })
            ;
          }

          // Initialize the element with the given settings.
          element.checkbox( settings ); 

          // Set initial state of the checkbox
          if ( scope.model == checkedValue() )
          {
            element.checkbox( 'set checked' );
          }
          else if ( scope.model === indeterminateValue() )
          {
            element.checkbox( 'set indeterminate' );
          }

          if ( angular.isDefined( scope.enabled ) && !scope.enabled )
          {
            element.checkbox( 'set disabled' );
          }

          if ( angular.isFunction( scope.onInit ) ) {
            scope.onInit( element );
          }
        });
      }
    }
  }]);

})( angular.module('semantic-ui') );
(function(app)
{

  app.directive('smRadioBind', ['SemanticUI',
  function SemanticRadioBind(SemanticUI)
  {
    return SemanticUI.createBind( 'smRadioBind', 'checkbox' );
  }]);

  var BEHAVIORS = {
    smRadioCheck:             'check',
    smRadioEnable:            'enable',
    smRadioDisable:           'disable'
  };

  angular.forEach( BEHAVIORS, function(method, directive)
  {
    app.directive( directive, ['SemanticUI', function(SemanticUI) 
    {
      return SemanticUI.createBehavior( directive, 'checkbox', method );
    }]);
  });

  app.directive('smRadio', ['SemanticUI',
  function SemanticRadio(SemanticUI) 
  {
    return {

      restrict: 'E',

      required: ['value', 'label', 'name', 'model'],

      replace: true,

      transclude: true,

      scope: {
        /* Required */
        model: '=',
        label: '@',
        name: '@',
        value: '=',
        /* Optional */
        settings: '=',
        enabled: '=',
        onInit: '=',
        /* Events */
        onChange:        '=',
        onChecked:       '=',
        onUnchecked:     '=',
        onEnable:        '=',
        onDisable:       '='
      },

      template: [
        '<div class="ui radio checkbox">',
        '  <input name="{{ name }}" type="radio">',
        '  <label>{{ label }}</label>',
        '</div>'
      ].join('\n'),

      link: function(scope, element, attrs) 
      {
        element.ready(function()
        {
          var settings = scope.settings || {};

          var modelWatcher = SemanticUI.watcher( scope, 'model', 
            function(updated) {
              if ( updated === scope.value ) {
                element.checkbox( 'set checked' );
              }
            }
          );

          var enabledWatcher = SemanticUI.watcher( scope, 'enabled',
            function(updated) {
              if ( angular.isDefined( updated ) ) {
                element.checkbox( updated ? 'set enabled' : 'set disabled' ); 
              }
            }
          );

          SemanticUI.onEvent( settings, 'onChecked', 
            function() {
              modelWatcher.set( scope.value );
            }
          );

          SemanticUI.onEvent( settings, 'onEnable', 
            function(value) {
              enabledWatcher.set( true );
            }
          );

          SemanticUI.onEvent( settings, 'onDisable', 
            function(value) {
              enabledWatcher.set( false );
            }
          );

          SemanticUI.linkEvents( scope, settings, {
            onChange:        'onChange',
            onChecked:       'onChecked',
            onUnchecked:     'onUnchecked',
            onEnable:        'onEnable',
            onDisable:       'onDisable'
          });

          // Initialize the element with the given settings.
          element.checkbox( settings ); 

          // Set initial state of the radio
          if ( scope.model === scope.value )
          {
            element.checkbox( 'set checked' );
          }

          // If the radio is a slider, remove the radio class 
          if ( element.hasClass( 'slider' ) )
          {
            element.removeClass( 'radio' );
          }

          if ( angular.isDefined( scope.enabled ) && !scope.enabled )
          {
            element.checkbox( 'set disabled' );
          }

          if ( angular.isFunction( scope.onInit ) ) {
            scope.onInit( element );
          }
        });
      }
    }
  }]);

})( angular.module('semantic-ui') );
(function(app)
{

  app.directive('smDimmerBind', ['SemanticUI', 
  function SemanticDimmerBind(SemanticUI)
  {
    return SemanticUI.createBind( 'smDimmerBind', 'dimmer' );
  }]);

  var BEHAVIORS = {
    smDimmerShow:           'show',
    smDimmerHide:           'hide',
    smDimmerToggle:         'toggle'
  };

  angular.forEach( BEHAVIORS, function(method, directive)
  {
    app.directive( directive, ['SemanticUI', function(SemanticUI) 
    {
      return SemanticUI.createBehavior( directive, 'dimmer', method );
    }]);
  });

  app.directive('smDimmer', ['SemanticUI',
  function SemanticDimmer(SemanticUI)
  {
    return {

      restrict: 'E',

      replace: true,

      transclude: true,

      scope: {
        /* Optional */
        visible: '=',
        settings: '=',
        onInit: '=',
        /* Events */
        onShow: '=',
        onHide: '=',
        onChange: '='
      },

      template: '<div class="ui dimmer" ng-transclude></div>',

      link: function(scope, element, attributes) 
      {
        var settings = scope.settings || {};

        var visibleWatcher = SemanticUI.watcher( scope, 'visible', 
          function(updated) {
            element.dimmer( updated ? 'show' : 'hide' );
          }
        );

        SemanticUI.onEvent( settings, 'onShow', 
          function(value) {
            visibleWatcher.set( true );
          }
        );

        SemanticUI.onEvent( settings, 'onHide', 
          function(value) {
            visibleWatcher.set( false );
          }
        );

        SemanticUI.linkEvents( scope, settings, {
          onShow:   'onShow',
          onHide:   'onHide',
          onChange: 'onChange'
        });

        element.dimmer( settings );

        if ( angular.isFunction( scope.onInit ) ) {
          scope.onInit( element );
        }
      }
    };
  }]);

})( angular.module('semantic-ui') );
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
          '<span class="text" ng-class="{default: hasDefault()}" sm-html="getText()"></span>',
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

          return value ? value.$$hashKey || value : value;
        };

        // Determines whether this dropdown should currently display the default text.
        $scope.hasDefault = function() 
        {
          if ( !$scope.defaultText ) {
            return false;
          }
          if ( $scope.findMatchingItem( $scope.model ) ) {
            return false;
          }
          return true;
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
        var settings = scope.settings || {};

        // When the model changes, set the value on the drop down
        var modelWatcher = SemanticUI.watcher( scope, 'model', 
          function(updated) {
            element.dropdown( 'set value', updated );
          }
        );

        // Inject an onChange function into the settings which sets the model value
        // and causes the scope to be updated.
        SemanticUI.onEvent( settings, 'onChange', 
          function(value) {
            modelWatcher.set( value in hashMap ? hashMap[ value ] : value );
          }
        );

        SemanticUI.linkEvents( scope, settings, {
          onChange:       'onChange',
          onAdd:          'onAdd',
          onRemove:       'onRemove',
          onLabelCreate:  'onLabelCreate',
          onLabelSelect:  'onLabelSelect',
          onNoResults:    'onNoResults',
          onShow:         'onShow',
          onHide:         'onHide'
        });

        // When items changes, rebuild the hashMap
        scope.$watch( 'items', function(updated)
        {
          hashMap = {};

          angular.forEach( updated, function(item)
          {
            if ( item.$$hashKey )
            {
              hashMap[ item.$$hashKey ] = item;
            }
          });

        }, true );

        // Initialize the element with the given settings.
        element.dropdown( settings ); 

        if ( angular.isFunction( scope.onInit ) ) {
          scope.onInit( element );
        }
      }
    }
  }]);

})( angular.module('semantic-ui') );
(function(app)
{

  app.directive('smEmbedBind', ['SemanticUI', 
  function SemanticEmbedBind(SemanticUI)
  {
    return SemanticUI.createBind( 'smEmbedBind', 'embed' );
  }]);

  var BEHAVIORS = {
    smEmbedReset:     'reset',
    smEmbedShow:      'show',
    smEmbedHide:      'hide',
    smEmbedDestroy:   'destroy'
  };

  angular.forEach( BEHAVIORS, function(method, directive)
  {
    app.directive( directive, ['SemanticUI', function(SemanticUI) 
    {
      return SemanticUI.createBehavior( directive, 'embed', method );
    }]);
  });

  app.directive('smEmbed', ['SemanticUI',
  function SemanticEmbed(SemanticUI)
  {
    return {

      restrict: 'E',

      replace: true,

      transclude: true,

      scope: {
        /* Optional */
        source: '@',
        sourceId: '@',
        placeholder: '@',
        icon: '@',
        settings: '=',
        onInit: '=',
        /* Events */
        onCreate: '=',
        onDisplay: '=',
        onPlaceholderDisplay: '=',
        onEmbed: '='
      },

      template: '<div class="ui embed"></div>',

      link: function(scope, element, attributes) 
      {
        var settings = scope.settings || {};

        if ( scope.source ) settings.source = scope.source;
        if ( scope.sourceId ) settings.id = scope.sourceId;
        if ( scope.placeholder ) settings.placeholder = scope.placeholder;
        if ( scope.icon ) settings.icon = scope.icon;

        SemanticUI.linkEvents( scope, settings, {
          onCreate:             'onCreate',
          onDisplay:            'onDisplay',
          onPlaceholderDisplay: 'onPlaceholderDisplay',
          onEmbed:              'onEmbed'
        });

        element.embed( settings );

        if ( angular.isFunction( scope.onInit ) ) {
          scope.onInit( element );
        }
      }
    };
  }]);

})( angular.module('semantic-ui') );
(function(app)
{

  app.directive('smModalBind', ['SemanticUI',
  function SemanticModalBind(SemanticUI)
  {
    return SemanticUI.createBind( 'smModalBind', 'modal' );
  }]);

  var BEHAVIORS = {
    smModalShow:        'show',
    smModalHide:        'hide',
    smModalToggle:      'toggle',
    smModalRefresh:     'refresh',
    smModalShowDimmer:  'show dimmer',
    smModalHideDimmer:  'hide dimmer',
    smModalHideOthers:  'hide others',
    smModalHideAll:     'hide all',
    smModalCacheSizes:  'cache sizes',
    smModalSetActive:   'set active'
  };

  angular.forEach( BEHAVIORS, function(method, directive)
  {
    app.directive( directive, ['SemanticUI', function(SemanticUI) 
    {
      return SemanticUI.createBehavior( directive, 'modal', method );
    }]);
  });

  app.directive('smModal', ['SemanticUI',
  function SemanticModal(SemanticUI) 
  {
    return {

      restrict: 'E',

      replace: true,

      transclude: true,

      scope: {
        /* Optional */
        visible: '=',
        settings: '=',
        onInit: '=',
        /* Events */
        onShow: '=',
        onVisible: '=',
        onHide: '=',
        onHidden: '=',
        onApprove: '=',
        onDeny: '='
      },

      template: '<div class="ui modal" ng-transclude></div>',

      link: function(scope, element, attrs)
      {
        var settings = scope.settings || {};

        var visibleWatcher = SemanticUI.watcher( scope, 'visible', 
          function(updated) {
            element.modal( updated ? 'show' : 'hide' );
          }
        );

        SemanticUI.onEvent( settings, 'onHide', 
          function() {
            visibleWatcher.set( false );
          }
        );

        SemanticUI.linkEvents( scope, settings, {
          onShow:    'onShow',
          onVisible: 'onVisible',
          onHide:    'onHide',
          onHidden:  'onHidden',
          onApprove: 'onApprove',
          onDeny:    'onDeny'
        });

        // Initialize the element with the given settings.
        element.modal( settings );

        if ( angular.isFunction( scope.onInit ) ) {
          scope.onInit( element );
        }
      }
    }
  }]);


})( angular.module('semantic-ui') );
(function(app)
{

  app.directive('smPopupBind', ['SemanticUI',
  function SemanticModalBind(SemanticUI)
  {
    return SemanticUI.createBind( 'smPopupBind', 'popup' );
  }]);

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

  // An attribute directive which displays a popup for this element.
  app.directive('smPopup', ['SemanticUI',
  function SemanticPopup(SemanticUI)
  {
    return {
      restrict: 'A',
      scope: {
        /* Required */
        smPopup: '=',
        /* Optional */
        smPopupTitle: '=',
        smPopupPosition: '@',
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
      link: function(scope, element, attributes) 
      {
        var settings = scope.smPopupSettings || {};

        SemanticUI.bindAttribute( scope, 'smPopup', element, 'data-content' );
        SemanticUI.bindAttribute( scope, 'smPopupTitle', element, 'data-title' );
        SemanticUI.bindAttribute( scope, 'smPopupPosition', element, 'data-position' );

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
      }
    };
  }]);

  // An attribute directive to show the detached popup which follows this element.
  app.directive('smPopupInline', ['SemanticUI',
  function SemanticPopupInline(SemanticUI) 
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
      link: function(scope, element, attributes) 
      {
        var settings = scope.smPopupInline || {};

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
      }
    };
  }]);

  // An attribute directive to show a detached popup over this element given it's name.
  app.directive('smPopupDisplay', ['SemanticUI',
  function SemanticPopupDisplay(SemanticUI) 
  {
    return {
      restrict: 'A',
      scope: {
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
      link: function(scope, element, attributes) 
      {
        var settings = scope.smPopupDisplaySettings || {};

        SemanticUI.linkEvents( scope, settings, {
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
      }
    };
  }]);

  // An element directive for a popup, can be used after an element or can be named and used with sm-popup-display.
  app.directive('smPopupDetached', 
  function SemanticPopupDetached() 
  {
    return {
      restrict: 'E',
      replace: true,
      transclude: true,
      scope: {
        name: '@'
      },
      template: '<div class="ui special popup" data-popup-named="{{ name }}" ng-transclude></div>'
    };
  });

})( angular.module('semantic-ui') );
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
(function(app)
{

  app.directive('smRatingBind', ['SemanticUI', 
  function SemanticRatingBind(SemanticUI)
  {
    return SemanticUI.createBind( 'smRatingBind', 'rating' );
  }]);

  var BEHAVIORS = {
    smRatingSetRating:  'set rating',
    smRatingDisable:    'disable',
    smRatingEnable:     'enable',
    smRatingClear:      'clear rating'
  };

  angular.forEach( BEHAVIORS, function(method, directive)
  {
    app.directive( directive, ['SemanticUI', function(SemanticUI) 
    {
      return SemanticUI.createBehavior( directive, 'rating', method );
    }]);
  });

  app.directive('smRating', ['SemanticUI',
  function SemanticRating(SemanticUI)
  {
    return {

      restrict: 'E',

      replace: true,

      scope: {
        /* Required */
        value: '=',
        total: '=',
        /* Optional */
        type: '@',
        disabled: '=',
        settings: '=',
        onInit: '=',
        /* Events */
        onRate: '='
      },

      template: '<div class="ui rating {{ type }}" data-rating="{{ value }}" data-max-rating="{{ total }}"></div>',

      link: function(scope, element, attributes) 
      {
        element.ready(function() 
        {
          var settings = scope.settings || {};

          var disabledWatcher = SemanticUI.watcher( scope, 'disabled', 
            function(updated) {
              element.rating( updated ? 'disable' : 'enable' );
            }
          );

          var valueWatcher = SemanticUI.watcher( scope, 'value', 
            function(updated) {
              element.rating( 'set rating', updated );
            }
          );

          SemanticUI.onEvent( settings, 'onRate', 
            function(value) {
              valueWatcher.set( value );
            }
          );

          SemanticUI.linkEvents( scope, settings, {
            onRate: 'onRate'
          });

          element.rating( settings );

          if ( angular.isFunction( scope.onInit ) ) {
            scope.onInit( element );
          }
        });
      }
    };
  }]);

})( angular.module('semantic-ui') );
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
(function(app)
{

  app.directive('smSidebarBind', ['SemanticUI', 
  function SemanticSidebarBind(SemanticUI)
  {
    return SemanticUI.createBind( 'smSidebarBind', 'sidebar' );
  }]);

  var BEHAVIORS = {
    smSidebarShow:           'show',
    smSidebarHide:           'hide',
    smSidebarToggle:         'toggle',
    smSidebarPushPage:       'push page',
    smSidebarPullPage:       'pull page',
    smSidebarAddBodyCss:     'add body css',
    smSidebarRemoveBodyCss:  'remove body css'
  };

  angular.forEach( BEHAVIORS, function(method, directive)
  {
    app.directive( directive, ['SemanticUI', function(SemanticUI) 
    {
      return SemanticUI.createBehavior( directive, 'sidebar', method );
    }]);
  });

  app.directive('smSidebar', ['SemanticUI',
  function SemanticSidebar(SemanticUI)
  {
    return {

      restrict: 'E',

      replace: true,

      scope: {
        /* Optional */
        visible: '=',
        settings: '=',
        onInit: '=',
        /* Events */
        onVisible: '=',
        onShow: '=',
        onChange: '=',
        onHide: '=',
        onHidden: '='
      },

      template: '<sm-flat-menu class="ui sidebar"></sm-flat-menu>',

      link: function(scope, element, attributes)
      {
        var settings = scope.settings || {};

        var visibleWatcher = SemanticUI.watcher( scope, 'visible', 
          function(updated) {
            element.sidebar( updated ? 'show' : 'hide' );
          }
        );

        SemanticUI.onEvent( settings, 'onHide', 
          function() {
            visibleWatcher.set( false );
          }
        );

        SemanticUI.onEvent( settings, 'onShow', 
          function() {
            visibleWatcher.set( true );
          }
        );

        SemanticUI.linkEvents( scope, settings, {
          onVisible: 'onVisible',
          onShow:    'onShow',
          onChange:  'onChange',
          onHide:    'onHide',
          onHidden:  'onHidden'
        });

        // Initialize the element with the given settings.
        element.sidebar( settings );

        if ( angular.isFunction( scope.onInit ) ) {
          scope.onInit( element );
        }
      }
    };
  }]);

})( angular.module('semantic-ui') );
(function(app)
{

  app.directive('smStickyBind', ['SemanticUI', 
  function SemanticStickyBind(SemanticUI)
  {
    return SemanticUI.createBind( 'smStickyBind', 'sticky' );
  }]);

  var BEHAVIORS = {
    smStickyRefresh:   'refresh'
  };

  angular.forEach( BEHAVIORS, function(method, directive)
  {
    app.directive( directive, ['SemanticUI', function(SemanticUI) 
    {
      return SemanticUI.createBehavior( directive, 'sticky', method );
    }]);
  });

  app.directive('smSticky', ['SemanticUI',
  function SemanticSticky(SemanticUI)
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
        onReposition: '=',
        onScroll: '=',
        onStick: '=',
        onUnstick: '=',
        onTop: '=',
        onBottom: '='
      },

      template: '<div class="ui sticky" ng-transclude></div>',

      link: function(scope, element, attributes) 
      {
        element.ready(function()
        {
          var settings = scope.settings || {};

          SemanticUI.linkEvents( scope, settings, {
            onReposition:   'onReposition',
            onScroll:       'onScroll',
            onStick:        'onStick',
            onStick:        'onStick',
            onTop:          'onTop',
            onBottom:       'onBottom'
          });

          element.sticky( settings );

          if ( angular.isFunction( scope.onInit ) ) {
            scope.onInit( element );
          }
        });
      }
    };
  }]);

})( angular.module('semantic-ui') );
(function(app)
{

  app.directive('smTabBind', ['SemanticUI', 
  function SemanticTabBind(SemanticUI)
  {
    return SemanticUI.createBind( 'smTabBind', 'tab' );
  }]);

  var BEHAVIORS = {
    smTabReset:     'reset',
    smTabShow:      'show',
    smTabHide:      'hide',
    smTabDestroy:   'destroy'
  };

  angular.forEach( BEHAVIORS, function(method, directive)
  {
    app.directive( directive, ['SemanticUI', function(SemanticUI) 
    {
      return SemanticUI.createBehavior( directive, 'tab', method );
    }]);
  });

  app.directive('smTabMenu', ['SemanticUI', 
  function SemanticTabMenu(SemanticUI)
  {
    return {

      restrict: 'E',

      replace: true,

      scope: {
        tabs: '=',
        active: '@'
      },

      template: [
        '<div class="ui menu">',
        '  <a class="item" ng-repeat="(name, title) in tabs" ng-class="{active: name === active}" data-tab="{{ name }}">{{ title }}</a>',
        '</div>'
      ].join('\n'),

      controller: function($scope)
      {
        if ( !($scope.active in $scope.tabs) )
        {
          for (var prop in $scope.tabs)
          {
            $scope.active = prop;
            break;
          }
        }
      },

      link: function(scope, element, attributes)
      {
        element.ready(function()
        {
          var settings = scope.settings || {};

          element.children('.item').tab( settings );
        });
      }
    }
  }]);

  app.directive('smTab', ['SemanticUI',
  function SemanticTab(SemanticUI)
  {
    return {

      restrict: 'E',

      replace: true,

      transclude: true,

      scope: {
        name: '@'
      },

      template: '<div class="ui bottom attached tab segment" data-tab="{{ name }}" ng-transclude></div>'
    };
  }]);

})( angular.module('semantic-ui') );
(function(app)
{

  // Transitions: scale, fade, flip, drop, fly, swing, browse, slide, jiggle, flash, shake, pulse, tada, bounce

  app.directive('smTransition', ['SemanticUI',
  function SemanticTransition(SemanticUI)
  {
    return {
      restrict: 'A',
      scope: {
        smTransition: '@',
        smTransitionEvents: '@',
        smTransitionOther: '@'
      },
      link: function(scope, element, attributes)
      {
        scope.smTransitionEvents = scope.smTransitionEvents || 'click';

        element.on( scope.smTransitionEvents, function()
        {
          ( scope.smTransitionOther ? $( scope.smTransitionOther ) : element ).transition( scope.smTransition );
        });
      }
    };
  }]);

})( angular.module('semantic-ui') );