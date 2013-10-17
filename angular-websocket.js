;(function(module, undefined) {
'use strict';

module.provider('WebSocket', function() {
    // when forwarding events, prefix the event name
    var _prefix = 'websocket:';
    var _WebSocket;
    var _host;

    this.host = function(setHost) {
      _host = setHost;
      return this;
    };

    this.prefix = function(newPrefix) {
      _prefix = newPrefix;
      return this;
    };

    this.WebSocket = function(url, protocols) {
      protocols = Array.prototype.slice.call(arguments, 1);
      _WebSocket = new WebSocket(url, protocols);
      return this;
    };

    // expose to provider
    this.$get = ['$rootScope', '$timeout', function($rootScope, $timeout) {

      var ws = _WebSocket;

      var asyncAngularify = function (callback) {
        return function(args) {
          args = Array.prototype.slice.call(arguments);
          $timeout(function() {
            callback.apply(ws, args);
          });
        };
      };

      var addListener = function(event) {
        event = event && 'on'+event || 'onmessage';
        return function(eventName, callback) {
          ws[event](eventName, asyncAngularify(callback));
        };
      };

      var wrappedWebSocket = {
        on: addListener('message'),
        onmessage: addListener('message'),
        onclose: addListener('close'),
        onopen: addListener('open'),
        onerror: addListener('error'),
        close: function() {
          ws.close();
        },

        send: function(eventName, data, callback) {
          if (angular.isObject(eventName)) {
            ws.send(eventName);
          } else {
            if (callback) {
              ws.send(eventName, data, asyncAngularify(callback));
            } else {
              ws.send(eventName, data);
            }
          }
        },

        removeListener: function(args) {
          args = Array.prototype.slice.call(arguments);
          return ws.removeListener.apply(ws, args);
        },

        // when ws.on('someEvent', fn (data) { ... }),
        // call scope.$broadcast('someEvent', data)
        forward: function(events, scope) {

          if (events instanceof Array === false) {
            events = [events];
          }

          if (!scope) {
            scope = $rootScope;
          }

          events.forEach(function(eventName) {
            var prefixed = _prefix + eventName;
            var forwardEvent = asyncAngularify(function (data) {
              scope.$broadcast(prefixed, data);
            });
            scope.$on('$destroy', function () {
              ws.removeListener(eventName, forwardEvent);
            });
            ws.onmessage(eventName, forwardEvent);
          });
        }
      };

      return wrappedWebSocket;

    }];

});

}(angular.module('angular-websocket', [])));
