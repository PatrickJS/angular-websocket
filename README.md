# angular-websocket [![Build Status](https://travis-ci.org/gdi2290/angular-websocket.png?branch=master)](https://travis-ci.org/gdi2290/angular-websocket)

WebSockets for Angular.js
<br>
Email me if something is broken.

#How do I add this to my project?

You can download angular-websocket by:

* (prefered) Using bower and running `bower install angular-websocket --save`
* Using npm and running `npm install angular-websocket --save`
* Downloading it manually by clicking [here to download development unminified version](https://raw.github.com/gdi2290/angular-websocket/master/angular-websocket.js)


````html
<script src="http://ajax.googleapis.com/ajax/libs/angularjs/1.2.0-rc.2/angular.min.js"></script>
<script src="app/bower_components/angular-websocket/angular-websocket.js"></script>
<script>
  angular.module('YOUR_APP', [
    'angular-websocket',
    'controllers'
  ])
  .config(function(WebSocketProvider){
    WebSocketProvider
      .prefix('')
      .uri('ws://echo.websocket.org/');
  });

  angular.module('controllers', [])
    .controller('MainCtrl', function($scope, WebSocket) {

      WebSocket.onopen(function() {
        console.log('connection');
      });

      WebSocket.onmessage(function(event) {
        console.log('message: ', event.data);
      });



    });
</script>

````
