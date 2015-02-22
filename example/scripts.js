angular.module('chat', [
  'ngAnimate',
  'ngWebSocket'
])
.factory('Messages', function($websocket) {
  var ws = $websocket('ws://echo.websocket.org/');
  var collection = [];

  ws.onMessage(function(event) {
    console.log('message: ', event);
    var res;
    try {
      res = JSON.parse(event.data);
    } catch(e) {
      res = {'username': 'anonymous', 'message': event.data};
    }

    collection.push({
      username: res.username,
      content: res.message,
      timeStamp: event.timeStamp
    });
  });

  ws.onError(function(event) {
    console.log('connection Error', event);
  });

  ws.onClose(function(event) {
    console.log('connection closed', event);
  });

  ws.onOpen(function() {
    console.log('connection open');
    ws.send('Hello World');
    ws.send('again');
    ws.send('and again');
  });
  // setTimeout(function() {
  //   ws.close();
  // }, 500)

  return {
    collection: collection,
    status: function() {
      return ws.readyState;
    },
    send: function(message) {
      if (angular.isString(message)) {
        ws.send(message);
      }
      else if (angular.isObject(message)) {
        ws.send(JSON.stringify(message));
      }
    }

  };
})
.controller('MessengerController', function($scope, Messages) {
  $scope.username = 'anonymous';

  $scope.Messages = Messages;

  $scope.submit = function(new_message) {
    if (!new_message) { return; }
    Messages.send({
      username: $scope.username,
      message: new_message
    });
    $scope.new_message = '';
  };


})
.filter('capitalize', function() {
  function capWord(txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  }
  return function(input, isEveryWord) {
     return (!input) ? '' : (!isEveryWord) ? capWord(input) : input.replace(/([^\W_]+[^\s-]*) */g, capWord);
  };
});
