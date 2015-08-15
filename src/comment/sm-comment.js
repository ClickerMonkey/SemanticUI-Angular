(function(app)
{

  app.directive('smComments', ['SemanticUI',
  function SemanticComments(SemanticUI)
  {
    return {

      restrict: 'E',

      replace: true,

      scope: {
        /* Required */
        comments: '=',
        content: '&',
        /* Optional */
        avatar: '&',
        author: '&',
        authorClick: '&',
        date: '&',
        replies: '&',
        reply: '=',
        replyClick: '&',
        replyText: '@'
      },

      template: [
        '<div class="ui comments" ng-class="{threaded: reply}">',
        ' <div class="comment" ng-repeat="c in comments" ng-init="$ = {comment: c}">',
        '  <a ng-if="avatar($)" class="avatar" ng-click="authorClick($)">',
        '    <img ng-src="{{ avatar($) }}">',
        '  </a>',
        '  <div class="content">',
        '   <a class="author" ng-click="authorClick($)" sm-html="author($)"></a>',
        '   <div class="metadata">',
        '    <span class="date" sm-time-ago="date($)"></span>',
        '   </div>',
        '   <div class="text" sm-html="content($)"></div>',
        '   <div class="actions">',
        '     <a class="reply" ng-click="replyClick($)" ng-show="reply" sm-html-once="replyText"></a>',
        '   </div>',
        '  </div>',
        '  <sm-comments ng-if="hasReplies($)" comments="replies($)" content="content({comment: comment})" avatar="avatar({comment: comment})" author="author({comment: comment})" author-click="authorClick({comment: comment})" date="date({comment: comment})" replies="replies({comment: comment})" reply="reply" reply-click="replyClick({comment: comment})" reply-text="{{ replyText }}"></sm-comments>',
        ' </div>',
        '</div>'
      ].join('\n'),

      controller: function($scope)
      {
        $scope.hasReplies = function($)
        {
          if ( !$scope.reply )
          {
            return false;
          }

          var replies = $scope.replies($);

          return replies && replies.length;
        };
      },

      compile: SemanticUI.RecursiveCompiler

    };
  }]);

})( angular.module('semantic-ui') );