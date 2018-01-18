angular.module("appToTest", ['ngWebSocket']).controller("ControllerToTest", ["$scope", "$websocket", function($scope, $websocket) {
	var socket;
	$scope.isConnected = false;

	function initializeSocket() {
		socket.onOpen(function() {
			$scope.isConnected = true;
		});
		socket.onClose(function() {
			$scope.isConnected = false;
		});
		socket.onMessage(function(message) {
			$scope.lastReceivedMessage = JSON.parse(message.data);
		});
	}

	$scope.connect = function() {
		socket = $websocket("wss://foo");
		initializeSocket();
	};

	$scope.sendMessage = function(sMessage) {
		socket.send(sMessage);
	};
}]);
