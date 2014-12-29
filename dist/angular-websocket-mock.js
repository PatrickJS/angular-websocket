(function() {

  function $WebSocketBackend() {
    var connectQueue = [];
    var pendingConnects = [];
    var closeQueue = [];
    var pendingCloses = [];
    var sendQueue = [];
    var pendingSends = [];


    function $MockWebSocket(url) {

    }

    $MockWebSocket.prototype.send = function (msg) {
      pendingSends.push(msg);
    };

    $MockWebSocket.prototype.close = function () {
      pendingCloses.push(true);
    };


    this.createWebSocketBackend = function (url) {
      pendingConnects.push(url);

      return new $MockWebSocket(url);
    };

    this.flush = function () {
      var url, msg;
      while (url = pendingConnects.shift()) {
        var i = connectQueue.indexOf(url);
        if (i > -1) {
          connectQueue.splice(i, 1);
        }
      }

      while (pendingCloses.shift()) {
        closeQueue.shift();
      }

      while (msg = pendingSends.shift()) {
        var j;
        sendQueue.forEach(function(pending, i) {
          if (pending.message === msg.message) {
            j = i;
          }
        });

        if (j > -1) {
          sendQueue.splice(j, 1);
        }
      }
    };

    this.expectConnect = function (url) {
      connectQueue.push(url);
    };

    this.expectClose = function () {
      closeQueue.push(true);
    };

    this.expectSend = function (msg) {
      sendQueue.push(msg);
    };

    this.verifyNoOutstandingExpectation = function () {
      if (connectQueue.length || closeQueue.length || sendQueue.length) {
        throw new Error('Requests waiting to be flushed');
      }
    };

    this.verifyNoOutstandingRequest = function () {
      if (pendingConnects.length || pendingCloses.length || pendingSends.length) {
        throw new Error('Requests waiting to be processed');
      }
    };

  } // end $WebSocketBackend

  angular.module('ngWebSocketMock', [])
  .service('WebSocketBackend',  $WebSocketBackend)
  .service('$webSocketBackend', $WebSocketBackend);

  angular.module('angular-websocket-mock', ['ngWebSocketMock']);

}());
