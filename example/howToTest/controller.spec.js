describe("ControllerToTest", function() {
	var controller, $scope, $websocketBackend;

	beforeEach(angular.mock.module('ngWebSocket', 'ngWebSocketMock'));

	beforeEach(function() {
		module("appToTest");
		inject(function(_$websocketBackend_, _$controller_) {
			$websocketBackend = _$websocketBackend_;
			$scope = {};
      		controller = _$controller_('ControllerToTest', { $scope: $scope });
		});

		$websocketBackend.expectConnect("wss://foo");
	});

	afterEach(function() {
		$websocketBackend.verifyNoOutstandingRequest();
		$websocketBackend.verifyNoOutstandingExpectation();
	});

	function connect() {
		$scope.connect();
		$websocketBackend.flush();
	}

	it("should initiate a connection on connect", function() {
		connect();
	});

	it("should react on an established connection", function() {
		expect($scope.isConnected).toEqual(false);
		connect();
		expect($scope.isConnected).toEqual(true);
	});

	it("should react on a closing connection", function() {
		connect();
		$websocketBackend.fakeClose("wss://foo");
		$websocketBackend.flush();
		expect($scope.isConnected).toEqual(false);
	});

	it("should react on an incoming message", function() {
		connect();
		$websocketBackend.fakeMessage("wss://foo", "hello");
		$websocketBackend.flush();
		expect($scope.lastReceivedMessage).toEqual("hello");
	});

	it("should send a message to the socket", function() {
		connect();
		$websocketBackend.expectSend("wss://foo", "greetings");
		$scope.sendMessage("greetings");
		$websocketBackend.flush();
	});
});