(function(app)
{

  app
    .controller('SemanticMenuController', ['$scope', SemanticMenuController])
    .directive('smMenu', ['SemanticUI', SemanticMenu])
  ;

  function SemanticMenu(SemanticUI)
  {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        /* Required */
        items: '=',
        label: '&',
        /* Optional */
        onClick: '&',
        children: '&',
        description: '&',
        icon: '&',
        hidden: '&',
        divider: '&'
      },
      template: [
        '<div class="menu">',
          '<div ng-repeat="i in items" ng-hide="isHidden( i )" ng-class="{item: !isDivider( i ), divider: isDivider( i )}" ng-click="onClick({item: i, $event:$event})">',
            '<i class="{{ getIcon( i ) }} icon" ng-if="getIcon( i )"></i>',
            '<span class="description" ng-if="getDescription( i )">{{ getDescription( i ) }}</span>',
            '{{ getLabel( i ) }}',
            '<sm-menu ng-if="hasChildren( i )" items="getChildren( i )" label="getLabel( item )" children="getChildren( item )" description="getDescription( item )" icon="getIcon( item )" hidden="isHidden( item )" divider="isDivider( item )" on-click="onClick({item: item, $event: $event})"></sm-menu>',
          '</div>',
        '</div>'
      ].join('\n'),

      controller: 'SemanticMenuController',

      compile: SemanticUI.RecursiveCompiler()
    };
  }

  function SemanticMenuController($scope)
  {
    $scope.hasChildren = function(item) {
      var children = $scope.children({item: item});
      return children && children.length;
    };
    $scope.getChildren = function(item) {
      return $scope.children({item: item});
    };

    $scope.getLabel = function(item) {
      return $scope.label({item: item});
    };
    $scope.getIcon = function(item) {
      return $scope.icon({item: item});
    }
    $scope.getDescription = function(item) {
      return $scope.description({item: item});
    };
    $scope.isHidden = function(item) {
      return $scope.hidden({item: item});
    };
    $scope.isDivider = function(item) {
      return $scope.divider({item: item});
    };
  }


})( angular.module('semantic-ui-menu', ['semantic-ui-core']) );
