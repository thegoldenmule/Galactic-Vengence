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
		log.debug("Attempting to login as " + username);
		
		// attempt to login
		var lr = new LoginRequest();
		lr.userName = username;
		
		var engine = GameController.engine.es.engine;
		engine.addEventListener(MessageType.LoginResponse, function(response) {
			engine.removeEventListener(MessageType.LoginResponse, arguments.callee);
			if (response.successful) {
				log.debug("Login successful.");
			} else {
				log.debug("Could not login with that username.");
			}
		});
		engine.send(lr);
	}
	
	function startSinglePlayer() {
		console.log("Starting game.");
		
		// create players
		Game.engine.physics.addPlayers(Game.input.createPlayers(Game.engine.config.numberOfPlayers));
		
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
				log.debug("Could not join a game : " + response.error);
			} else {
				log.debug("Joined successfully.");
			}
		});
		engine.send(qr);
	}
	
	_that.login = function() {
		// show loading window
		$("#loadingView").dialog({
			modal:true,
			resizable:false,
			draggable:false,
			open:function(event, ui) { 
				//hide close button.
				$(this).parent().children().children('.ui-dialog-titlebar-close').hide();
			},
			closeOnEscape:false
		});
		
		// init
		connect(function(success) {
			// close loading window
			$("#loadingView").dialog('close');
			
			// attempt login
			if (success) {
				log.debug("Connected successfully.");
				
				// show login prompt
				_loginWindowController.createLoginWindow(startMultiPlayer);
			} else {
				log.debug("Could not connect.");
				_loginWindowController.createConnectionFailureWindow(startSinglePlayer);
				
			}
		});
	};
	
	return _that;
}