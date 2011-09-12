// create our namespaces
if (!Game) var Game = {};

// namespacing util
Game.createNamespace = function(path) {
	var parts = path.split("."),
		parent = Game;
	
	for (var i = 0; i < parts.length; i++) {
		if (typeof parent[parts[i]] === "undefined") {
			parent[parts[i]] = {};
		}
		
		parent = parent[parts[i]];
	}
	return parent;
};

// create config
Game.createNamespace("engine.config");
Game.engine.config.scale = 5;

// init
Game.init = function(){
	if (Modernizr.canvas) {
		// config
		var config = Game.engine.config;
		config.getStageWidth = function() {
			return stage.offsetWidth;
		};
		config.getStageHeight = function() {
			return stage.offsetHeight;
		};
		config.numberOfPlayers = 2;
		
		// add root
		var stage = Game.stage = document.getElementById("stage");
		var root = Game.root = document.createElement("canvas");
		root.width = stage.offsetWidth;
		root.height = stage.offsetHeight;
		root.id = "root";
		stage.appendChild(root);
		
		// time
		var gameTime = Game.gameTime = new Game.GameTime();
		
		// world
		var worldListener = new WorldListener();
		
		// physics
		var physics = Game.engine.physics
			.createWorld()
			.withWorldListener(worldListener)
			.createEarth();
		
		// canvas controller
		var canvasController = Game.engine.canvasController = new CanvasController();
		
		// render earth
		var renderer = Game.engine.renderer;
		renderer.renderEarth(canvasController.background);
		
		// input
		Game.createNamespace("input");
		var input = Game.input = new InputController(root, config, physics);
		
		// effects
		var effects = Game.engine.effects = new EffectsController(canvasController.dynamics);
		
		// bind steps
		$(gameTime).bind(function(event, dt) {
			worldListener.tick(dt);
			physics.step(dt);
			renderer.render();
			effects.updateAndRender(dt);
		});
		
		// connect + login
		Game.connectAndLogin();
	} else {
		document.write("This browser does not support the canvas element.");
	}
};

Game.connectAndLogin = function() {
	// create LoginWindowController
	var loginWindow = new LoginWindowController();
	
	var es = Game.engine.es = new ElectroServer();
	es.initialize();
	
	var server = new ElectroServer.Server("server1");
	server.addAvailableConnection(new ElectroServer.AvailableConnection(
		"127.0.0.1",
		8989,
		ElectroServer.TransportType.BinaryHTTP));
	es.engine.addServer(server);
	es.engine.addEventListener(MessageType.ConnectionResponse, function(response) {
		es.engine.removeEventListener(MessageType.ConnectionResponse, arguments.callee);
		if (response.successful) {
			console.log("Connected successfully.");
			// wait for login prompt
			loginWindow.createLoginWindow(login);
		} else {
			console.log("Could not connect.");
			loginWindow.createConnectionFailureWindow();
			
		}
	});
	es.engine.connect();
	
	function login(username) {
		console.log("Attempting to login as " + username);
		
		// attempt to login
		var lr = new LoginRequest();
		lr.userName = username;
		es.engine.addEventListener(MessageType.LoginResponse, function(response) {
			es.engine.removeEventListener(MessageType.LoginResponse, arguments.callee);
			if (response.successful) {
				console.log("Login successful.");
				return;
				Game.findMatch();
			} else {
				console.log("Could not login with that username.");
				$(loginWindow.submitButton).click(login);
				loginWindow.setStatusText("That username has already been taken, please choose another.");
			}
		});
		es.engine.send(lr);
	}
};

Game.findMatch = function() {
	var qr = new QuickJoinGameRequest();
	qr.gameType = "match";
	qr.zoneName = "match";
	
	var criteria = new SearchCriteria();
	criteria.gameType = "match";
	qr.critera = criteria;
	
	Game.engine.es.engine.addEventListener(MessageType.CreateOrJoinGameResponse, function(response) {
		Game.engine.es.engine.removeEventListener(MessageType.CreateOrJoinGameResponse, arguments.callee);
		if (response.error) {
			console.log("Could not join a game : " + response.error);
		} else {
			console.log("Joined successfully.");
		}
	});
	Game.engine.es.engine.send(qr);
};

Game.startGame = function() {
	console.log("Starting game.");
	// make + place players
	var players = Game.input.makePlayers();
	Game.engine.physics.createPlayers(players);
	
	// wind
	Game.engine.canvasController.updateWind(Game.engine.physics.getWind());
	
	// set update FPS interval
	setInterval(
		function() {
			Game.engine.canvasController.updateFps(Game.gameTime.getFPS());
		}, 1000);
	
	// show stats
	Game.engine.canvasController.showHUD();
	
	// start timer
	Game.gameTime.start();
	
	// start handling input
	Game.input.startRound();
};

Game.errorTitles = [
	"Our gigabytes aren't working right now...",
	"Check your RAM fluid!",
	"Unexpected tachyon surge!"
];

Game.getRandomErrorTitle = function() {
	return Game.errorTitles[~~(Game.errorTitles.length * Math.random())];
};
