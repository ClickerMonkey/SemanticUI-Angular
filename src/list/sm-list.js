(function(app)
{

  app
    .factory('SemanticListLink', ['SemanticUI', SemanticListLink])
    .directive('smList', ['SemanticUI', 'SemanticListLink', SemanticList])
  ;

  function SemanticList(SemanticUI, SemanticListLink)
  {
    return {

      restrict: 'E',

      replace: true,

      scope:
      {
        /* Required */
        items: '=',
        /* Optional */
        description: '&',
        icon: '&',
        image: '&',
        header: '&',
        headerHref: '&',
        children: '&',
        onHeader: '&',
        /* Private */
        has: '=?'
      },

      template: [
        '<div class="ui list">',
        ' <div class="item" ng-repeat="i in items" ng-init="$ = {item: i}">',
        '   <i ng-if="has.icon" class="icon {{ icon($) }}"></i>',
        '   <img ng-if="has.image" class="ui avatar image" ng-src="{{ image($) }}">',
        '   <div ng-if="has.header || has.children" class="content">',
        '     <div ng-if="!has.headerLink" class="header" sm-html="header($)"></div>',
        '     <a ng-if="has.headerLink" class="header" ng-href="{{ headerHref($) }}" ng-click="onHeader($)" sm-html="header($)"></a>',
        '     <div class="description" sm-html="description($)"></div>',
        '     <sm-list ng-if="has.children && getChildCount($)" has="has" items="children($)" description="description({item: item})" icon="icon({item: item})" header="header({item: item})" header-href="headerHref({item: item})" children="children({item: item})" on-header="onHeader({item: item})"></sm-list>',
        '   </div>',
        '   <div ng-if="!has.header && !has.children" class="content" sm-html="description($)"></div>',
        ' </div>',
        '</div>'
      ].join('\n'),

      compile: SemanticUI.RecursiveCompiler(SemanticListLink)
    }
  }

  function SemanticListLink(SemanticUI)
  {
    return function(scope, element, attributes)
    {
      if ( !scope.has )
      {
        scope.has = {
          icon:         !!attributes.icon,
          image:        !!attributes.image,
          header:       !!attributes.header,
          headerLink:   !!attributes.headerHref,
          description:  !!attributes.description,
          children:     !!attributes.children
        };
      }

      scope.getChildCount = function($)
      {
        var children = scope.children($);

        return children ? children.length : 0;
      };

      SemanticUI.setDefaultFunction( scope, 'description', attributes, function(locals){return locals.item} );
      SemanticUI.setDefaultFunction( scope, 'icon', attributes, function(locals){return locals.item.icon} );
      SemanticUI.setDefaultFunction( scope, 'header', attributes, function(locals){return locals.item.header} );
      SemanticUI.setDefaultFunction( scope, 'children', attributes, function(locals){return locals.item.children} );
    };
  }

})( angular.module('semantic-ui-list', ['semantic-ui-core']) );
