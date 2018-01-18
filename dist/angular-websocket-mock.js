(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["module", "angular"], factory);
  } else if (typeof exports !== "undefined") {
    factory(module, require("angular"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod, global.angular);
    global.angularWebsocketMock = mod.exports;
  }
})(this, function (module, _angular) {
  "use strict";

  var _angular2 = _interopRequireDefault(_angular);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function $WebSocketBackend() {
    var connectQueue = [];
    var pendingConnects = [];
    var closeQueue = [];
    var pendingCloses = [];
    var sendQueue = [];
    var pendingSends = [];
    var pendingMessages = [];
    var mock = false;
    var existingMocks = {};

    function $MockWebSocket(url, protocols) {
      this.url = url;
      this.protocols = protocols;
      this.ssl = /(wss)/i.test(this.url);
      if (!existingMocks[url]) {
        existingMocks[url] = [this];
      } else {
        existingMocks[url].push(this);
      }
    }

    $MockWebSocket.prototype.send = function (msg) {
      pendingSends.push(msg);
    };

    this.mockSend = function () {
      if (mock) {
        return sendQueue.shift();
      }
    };

    this.fakeClose = function (url, code) {
      closeQueue.push(url);
      if (existingMocks[url]) {
        existingMocks[url].map(function (mockSocket) {
          mockSocket.close(code);
        });
      }
    };

    this.fakeMessage = function (url, data) {
      pendingMessages.push({ url: url, data: data });
    };

    this.mock = function () {
      mock = true;
    };

    this.isMocked = function () {
      return mock;
    };

    this.isConnected = function (url) {
      return connectQueue.indexOf(url) > -1;
    };

    $MockWebSocket.prototype.close = function (code) {
      pendingCloses.push({ url: this.url, code: code ? code : 1000 });
    };

    function createWebSocketBackend(url, protocols) {
      pendingConnects.push(url);
      // pendingConnects.push({
      //   url: url,
      //   protocols: protocols
      // });

      if (protocols) {
        return new $MockWebSocket(url, protocols);
      }
      return new $MockWebSocket(url);
    }
    this.create = createWebSocketBackend;
    this.createWebSocketBackend = createWebSocketBackend;

    function callOpenCallbacks(url) {
      existingMocks[url].map(function (socketMock) {
        if (socketMock.onopen && typeof socketMock.onopen === "function") {
          socketMock.onopen();
        }
      });
    }

    function callCloseCallbacks(url, code) {
      existingMocks[url].map(function (socketMock) {
        if (socketMock.onclose && typeof socketMock.onclose === "function") {
          socketMock.onclose({ code: code });
        }
      });
    }

    function callMessageCallbacks(url, data) {
      if (existingMocks[url]) {
        existingMocks[url].map(function (socketMock) {
          if (socketMock.onmessage && typeof socketMock.onmessage === "function") {
            socketMock.onmessage({ data: JSON.stringify(data) });
          }
        });
      }
    }

    function setReadyState(url, state) {
      if (existingMocks[url]) {
        existingMocks[url].map(function (socketMock) {
          socketMock.readyState = state;
        });
      }
    }

    this.flush = function () {
      var url, msg, config;
      while (url = pendingConnects.shift()) {
        var i = connectQueue.indexOf(url);
        if (i > -1) {
          connectQueue.splice(i, 1);
          callOpenCallbacks(url);
          setReadyState(url, 1);
        }
        // if (config && config.url) {
        // }
      }

      var pendingClose;
      while (pendingClose = pendingCloses.shift()) {
        var i = closeQueue.indexOf(pendingClose.url);
        if (i > -1) {
          closeQueue.splice(i, 1);
          callCloseCallbacks(pendingClose.url, pendingClose.code);
          setReadyState(pendingClose.url, 3);
        }
      }

      while (msg = pendingSends.shift()) {
        var j;
        sendQueue.forEach(function (pending, i) {
          if (pending.message === msg.message) {
            j = i;
          }
        });

        if (j > -1) {
          sendQueue.splice(j, 1);
        }
      }

      while (msg = pendingMessages.shift()) {
        callMessageCallbacks(msg.url, msg.data);
      }
    };

    this.expectConnect = function (url, protocols) {
      connectQueue.push(url);
      // connectQueue.push({url: url, protocols: protocols});
    };

    this.expectClose = function (url) {
      closeQueue.push(url);
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

  _angular2.default.module('ngWebSocketMock', []).service('WebSocketBackend', $WebSocketBackend).service('$websocketBackend', $WebSocketBackend);

  _angular2.default.module('angular-websocket-mock', ['ngWebSocketMock']);

  module.exports = _angular2.default.module('ngWebSocketMock');
});