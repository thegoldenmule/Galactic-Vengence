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
Game.engine.config.numberOfPlayers = 2;

// init
Game.init = function(){
	if (!Modernizr.canvas) {
		document.write("This browser does not support the canvas element.");
		return;
	}
	
	log.debug("Initializing game.");
	
	// add root
	var stage = Game.stage = document.getElementById("stage");
	var root = Game.root = document.createElement("canvas");
	root.width = stage.offsetWidth;
	root.height = stage.offsetHeight;
	root.id = "root";
	stage.appendChild(root);
	
	// more config setup
	var config = Game.engine.config;
	config.getStageWidth = function() {
		return stage.offsetWidth;
	};
	config.getStageHeight = function() {
		return stage.offsetHeight;
	};
	
	// time
	var gameTime = Game.gameTime = new GameTime();
	
	// world
	var worldListener = new WorldListener();
	
	// setup physics
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
	var input = Game.input = new InputController(root, config, physics);
	
	// effects
	var effects = Game.engine.effects = new EffectsController(canvasController.dynamics);
	
	// bind to gametime tick
	$(gameTime).bind('tick', function(event, dt) {
		worldListener.tick(dt);
		physics.step(dt);
		renderer.render();
		effects.updateAndRender(dt);
	});
	
	// create the gamecontroller
	var gameController = Game.engine.controller = new GameController();
	gameController.login();
};

Game.getRandomErrorTitle = (function() {
	var errorTitles = [
		"Our gigabytes aren't working right now...",
		"Check your RAM fluid!",
		"Unexpected tachyon surge!"
	];
	
	return function() {
				return errorTitles[~~(errorTitles.length * Math.random())];
			};
})();