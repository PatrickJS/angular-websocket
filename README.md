# angular-websocket
[![Build Status](https://travis-ci.org/gdi2290/angular-websocket.png)](https://travis-ci.org/gdi2290/angular-websocket) [![Bower version](https://badge.fury.io/bo/angular-websocket.svg)](http://badge.fury.io/bo/angular-websocket) [![npm version](https://badge.fury.io/js/angular-websocket.svg)](http://badge.fury.io/js/angular-websocket) [![Dependency Status](https://david-dm.org/gdi2290/angular-websocket.svg)](https://david-dm.org/gdi2290/angular-websocket) [![devDependency Status](https://david-dm.org/gdi2290/angular-websocket/dev-status.svg)](https://david-dm.org/gdi2290/angular-websocket#info=devDependencies)

## Status: Looking for feedback about new API changes

An AngularJS 1.x WebSocket service for connecting client applications to servers.

## How do I add this to my project?

You can download angular-websocket by:

* (prefered) Using bower and running `bower install angular-websocket --save`
* Using npm and running `npm install angular-websocket --save`
* Downloading it manually by clicking [here to download development unminified version](https://raw.github.com/gdi2290/angular-websocket/master/angular-websocket.js)

## Usage

```html
  <script src="http://ajax.googleapis.com/ajax/libs/angularjs/1.2.10/angular.min.js"></script>
  <script src="app/bower_components/angular-websocket/angular-websocket.js"></script>
  <section ng-controller="SomeController">
    <ul>
      <li ng-repeat="data in collection track by $index">
        {{ data }}
      </li>
    </ul>
  </section>
  <script>
    angular.module('YOUR_APP', [
      'ngWebsocket'
    ])
    .factory('MyData', function($webSocket) {
      // Open a WebSocket connection
      var ws = $webSocket('wss://website.com/data');

      var collection = [];

      ws.onMessage(function(message) {
        collection.push(message);
      });

      return {
        collection: data,
        get: function() {
          ws.send({action: 'get'});
        }
      };
    })
    .controller('SomeController', function (MyData) {

      $scope.colection = MyData.data
    });
  </script>
```

## API

### Factory: `$webSocket` (in module `ngWebSocket`)

returns instance of $WebSocket

### Methods

name        | arguments                                              | description
------------|--------------------------------------------------------|------------
$webSocket <br>_constructor_ | url:String                              | Creates and opens a [WebSocket](http://mdn.io/API/WebSocket) instance. `var ws = $webSocket('ws://foo');`
send        | data:String,Object returns                             | Adds data to a queue, and attempts to send if socket is ready. Accepts string or object, and will stringify objects before sending to socket.
onMessage   | callback:Function <br>options{filter:String,RegExp, autoApply:Boolean=true} | Register a callback to be fired on every message received from the websocket, or optionally just when the message's `data` property matches the filter provided in the options object. Each message handled will safely call `$rootScope.$digest()` unless `autoApply` is set to `false in the options. Callback gets called with a [MessageEvent](https://developer.mozilla.org/en-US/docs/Web/API/MessageEvent?redirectlocale=en-US&redirectslug=WebSockets%2FWebSockets_reference%2FMessageEvent) object.
onOpen      | callback:Function                                      | Function to be executed each time a socket connection is opened for this instance.
close       | force:Boolean:_optional_                               | Close the underlying socket, as long as no data is still being sent from the client. Optionally force close, even if data is still being sent, by passing `true` as the `force` parameter. To check if data is being sent, read the value of `socket.bufferedAmount`.

### Properties
name               | type             | description
-------------------|------------------|------------
socket             | window.WebSocket | [WebSocket](http://mdn.io/API/WebSocket) instance.
sendQueue          | Array<function>  | Queue of `send` calls to be made on socket when socket is able to receive data. List is populated by calls to the `send` method, but this array can be spliced if data needs to be manually removed before it's been sent to a socket. Data is removed from the array after it's been sent to the socket.
onOpenCallbacks    | Array<function>  | List of callbacks to be executed when the socket is opened, initially or on re-connection after broken connection. Callbacks should be added to this list through the `onOpen` method.
onMessageCallbacks | Array<function>  | List of callbacks to be executed when a message is received from the socket. Callbacks should be added via the `onMessage` method.
readyState         | Number:readonly  | Returns either the readyState value from the underlying WebSocket instance, or a proprietary value representing the internal state of the lib, e.g. if the lib is in a state of re-connecting.
initialTimeout     | Number           | The initial timeout, should be set at the outer limits of expected response time for the service. For example, if your service responds in 1ms on average but in 10ms for 99% of requests, then set to 10ms.
maxTimeout         | Number           | Should be as low as possible to keep your customers happy, but high enough that the system can definitely handle requests from all clients at that sustained rate.

### CancelablePromise

This type is returned from the `send()` instance method of $webSocket, inherits from [$q.defer().promise](https://ng-click.com/$q).

### Methods

name        | arguments                                              | description
------------|--------------------------------------------------------|------------
cancel      | | Alias to `deferred.reject()`, allows preventing an unsent message from being sent to socket for any arbitrary reason.
then        | resolve:Function, reject:Function | Resolves when message has been passed to socket, presuming the socket has a `readyState` of 1. Rejects if the socket is hopelessly disconnected now or in the future (i.e. the library is no longer attempting to reconnect). All messages are immediately rejected when the library has determined that re-establishing a connection is unlikely.


### Service: `$webSocketBackend` (in module `ngWebSocketMock`)

Similar to [`httpBackend`](https://ng-click.com/$httpBackend) mock in AngularJS's `ngMock` module

### Methods

name                           | arguments  | description
-------------------------------|------------|-----------------------------------
flush                          |            | Executes all pending requests
expectConnect                  | url:String | Specify the url of an expected WebSocket connection
expectClose                    |            | Expect "close" to be called on the WebSocket
expectSend                     | msg:String | Expectation of send to be called, with required message
verifyNoOutstandingExpectation |            | Makes sure all expectations have been satisfied, should be called in afterEach
verifyNoOutstandingRequest     |            | Makes sure no requests are pending, should be called in afterEach

## Logical Questions

 * *Q.*: What if the browser doesn't support WebSockets?
 * *A.*: This module will not help; it does not have a fallback story for browsers that do not support WebSockets.

## Development

```shell
$ npm install
$ bower install
```

### Unit Tests
`$ npm test` Run karma in Chrome, Firefox, and Safari

### Manual Tests

In the project root directory:

`$ node test-server` Starts a sample web socket server to send/receive messages
`$ ./node_modules/.bin http-server` - Basic http server to seve a static file
Open localhost:8081/test-app.html and watch browser console and node console to see messages passing

### Distribute
`$ npm run dist` Builds files with uglifyjs


## TODO
 * Add `protocols` parameter to constructor
 * Allow more control over $digest cycle per WebSocket instance

## License
[MIT](https://github.com/gdi2290/angular-websocket/blob/master/LICENSE)

