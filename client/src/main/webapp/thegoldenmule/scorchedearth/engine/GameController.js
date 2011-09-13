function GameController() {
	var _that = this
		_initialized = false,
		_loginWindowController = new LoginWindowController();
	
	function connect(callback) {
		// create server only once
		if (!_initialized) {
			// create ElectroServer object
			var es = Game.engine.es = new ElectroServer();
			es.initialize();
			
			// create Server + connect
			var server = Game.engine.server = new ElectroServer.Server("server1");
			server.addAvailableConnection(new ElectroServer.AvailableConnection(
				"127.0.0.1",
				8989,
				ElectroServer.TransportType.BinaryHTTP));
			es.engine.addServer(server);
		}
		_initialized = true;
		
		// attempt connection
		es.engine.addEventListener(MessageType.ConnectionResponse,
			function(response) {
				es.engine.removeEventListener(MessageType.ConnectionResponse, arguments.callee);
				
				callback(response.successful);
			});
		es.engine.connect();
	}
	
	function loginWindowCallback(username) {
		console.log("Attempting to login as " + username);
		
		// attempt to login
		var lr = new LoginRequest();
		lr.userName = username;
		
		var engine = GameController.engine.es.engine;
		engine.addEventListener(MessageType.LoginResponse, function(response) {
			engine.removeEventListener(MessageType.LoginResponse, arguments.callee);
			if (response.successful) {
				console.log("Login successful.");
			} else {
				console.log("Could not login with that username.");
			}
		});
		engine.send(lr);
	}
	
	function startSinglePlayer() {
		console.log("Starting game.");
		
		// make players
		var inputController = Game.input;
		for (var i = 0, len = Game.engine.config.numberOfPlayers; i < len; i++) {
			inputController.addPlayer(
				new Player({
					color : "#FFFFFF",
					playerName : "thegoldenmule" + i,
					angle : 0,
					power : 750,
					health : 100,
					weapons : [
						new Missile(999),
						new Mortar(10)
					]
				}));
		}
		
		// hand them off to the physics engine
		Game.engine.physics.createPlayers(players);
		
		// wind
		var canvasController = Game.engine.canvasController;
		canvasController.updateWind(Game.engine.physics.getWind());
		
		// set update FPS interval
		setInterval(
			function() {
				canvasController.updateFps(Game.gameTime.getFPS());
			}, 1000);
		
		// show stats
		canvasController.showHUD();
		
		// start timer
		Game.gameTime.start();
		
		// start handling input
		Game.input.startRound();
	}
	
	function startMultiPlayer() {
		var qr = new QuickJoinGameRequest();
		qr.gameType = "match";
		qr.zoneName = "match";
		
		var criteria = new SearchCriteria();
		criteria.gameType = "match";
		qr.critera = criteria;
		
		var engine = GameController.engine.es.engine;
		engine.addEventListener(MessageType.CreateOrJoinGameResponse, function(response) {
			engine.removeEventListener(MessageType.CreateOrJoinGameResponse, arguments.callee);
			if (response.error) {
				console.log("Could not join a game : " + response.error);
			} else {
				console.log("Joined successfully.");
			}
		});
		engine.send(qr);
	}
	
	_that.login = function() {
		// show loading window
		$("#loadingView").dialog({
			modal:true
		});
		
		// init
		connect(function(success) {
			// close loading window
			$("#loadingView").dialog('close');
			
			// attempt login
			if (success) {
				console.log("Connected successfully.");
				
				// show login prompt
				_loginWindowController.createLoginWindow(startMultiPlayer);
			} else {
				console.log("Could not connect.");
				_loginWindowController.createConnectionFailureWindow(startSinglePlayer);
				
			}
		});
	};
	
	return _that;
}