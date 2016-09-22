(function(app)
{

  app
    .directive('smTimeAgo', SemanticTimeAgo)
  ;

  function SemanticTimeAgo()
  {
    var MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    var THS = ['th', 'st', 'nd', 'rd', 'th', 'th', 'th', 'th', 'th', 'th'];
    var HOURS = ['12', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11'];

    function getTime(date)
    {
      var hours = date.getHours();
      var minutes = date.getMinutes();
      var minutesPadded = minutes < 10 ? '0' + minutes : minutes;

      return HOURS[ hours % HOURS.length ] + ':' + minutesPadded + ( hours < 12 ? 'AM' : 'PM' );
    }

    function getTh(x)
    {
      return (x >= 11 && x <= 13) ? (x + 'th') : x + THS[ x % THS.length ];
    }

    function getDaysAgo(date)
    {
      return Math.ceil( ( new Date().getTime() - date.getTime() ) / 86400000 );
    }

    return {

      restrict: 'A',

      link: function(scope, element, attributes)
      {
        var timeout = false;
        var value = false;
        var fuzzy = false;

        var updateText = function()
        {
          var now = new Date();
          var today = new Date( now.getFullYear(), now.getMonth(), now.getDate() );
          var yesterday = new Date( now.getFullYear(), now.getMonth(), now.getDate() - 1 );

          var elapsed = now.getTime() - value.getTime();

          var text = '';
          var updateIn = false;

          if ( elapsed < 60000 )
          { // 1 minute
            text = 'Just now';
            updateIn = 60000 - elapsed;
          }
          else if ( elapsed < 3600000 )
          { // 1 hour
            var minutesAgo = Math.floor( elapsed / 60000 );
            text = minutesAgo === 1 ? '1 minute ago' : minutesAgo + ' minutes ago';
            updateIn = elapsed % 60000;
          }
          else if ( value.getTime() > today.getTime() )
          { // today
            text = 'Today at ' + getTime( value );
            updateIn = elapsed % 3600000;
          }
          else if ( value.getTime() > yesterday.getTime() )
          { // yesterday
            text = 'Yesterday at ' + getTime( value );
            updateIn = elapsed % 3600000;
          }
          else if ( value.getMonth() === now.getMonth() && value.getFullYear() === now.getFullYear() )
          { // this month
            text += 'The ' + getTh( value.getDate() );
            text +=' at ' + getTime( value );
            text += ' (' + getDaysAgo( value ) + ' days ago)';
            updateIn = 86400000;
          }
          else
          { // before the current month
            text += MONTHS[ value.getMonth() ] + ' ' + getTh( value.getDate() );
            if ( value.getFullYear() !== now.getFullYear() ) {
              text += ' ' + value.getFullYear();
            }
            text += ' at ' + getTime( value );
            var daysAgo = getDaysAgo( value );
            if ( daysAgo <= 60 ) {
              text += ' (' + getDaysAgo( value ) + ' days ago)'
            }
          }

          element.text( text );

          if ( timeout )
          {
            clearTimeout( timeout );
            timeout = false;
          }

          if ( updateIn )
          {
            timeout = setTimeout(function()
            {
              timeout = false;
              updateText();

            }, updateIn);
          }
        };

        scope.$watch( attributes.smTimeAgo, function(updated)
        {
          value = new Date( updated );
          updateText();
        });
      }
    }
  }

})( angular.module('semantic-ui-timeago', ['semantic-ui-core']) );
