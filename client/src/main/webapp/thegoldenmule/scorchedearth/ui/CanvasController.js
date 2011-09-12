function CanvasController() {
	var _root = Game.root;
	var _stage = Game.stage;
	var _gameTime = Game.gameTime;
	
	function createCanvas(id) {
		var canvas = document.createElement("canvas");
		canvas.id = id;
		canvas.style.position = "absolute";
		canvas.style.right = "0px";
		canvas.style.top = "0px";
		canvas.width = _root.width;
		canvas.height = _root.height;
		
		return canvas;
	};
	
	// set up displaylist
	this.background = createCanvas("background");
	_stage.appendChild(this.background);
	
	this.dynamics = createCanvas("dynamics");
	_stage.appendChild(this.dynamics);
	
	this.players = createCanvas("players");
	_stage.appendChild(this.players);
	
	// stats
	var _windCanvas = createCanvas("wind");
	_stage.appendChild(_windCanvas);
	
	var _stats = document.createElement("div");
	_stats = document.createElement("div");
	_stats.style.position = "absolute";
	_stats.style.right = "0px";
	_stats.style.top = "0px";
	_stats.width = _root.width;
	_stats.height = _root.height;
	
	// popout on top
	var _panelContainer = document.createElement("div");
	_panelContainer.id = "panel";
	//_stage.appendChild(_panelContainer);
	
	var _uiContent = document.createElement("div");
	_uiContent.id = "contentTab";
	_panelContainer.appendChild(_uiContent);
	
	var _uiPopout= document.createElement("div");
	_uiPopout.id = "popoutTab";
	_panelContainer.appendChild(_uiPopout);
	
	var _uiController = new PanelController(_panelContainer, _uiContent, _uiPopout);
	this.uiController = (function() {
		return _uiController;
	})();
	
	// fps counter
	var span = document.createElement("p");
	var _fps = document.createTextNode("FPS : 0");
	span.appendChild(_fps);
	_stats.appendChild(span);
	
	// player data
	span = document.createElement("p");
	var _playerName = document.createTextNode("Player : ");
	span.appendChild(_playerName);
	_stats.appendChild(span);
	
	span = document.createElement("p");
	var _angle = document.createTextNode("Angle : ");
	span.appendChild(_angle);
	_stats.appendChild(span);
	
	span = document.createElement("p");
	var _power = document.createTextNode("Power : ");
	span.appendChild(_power);
	_stats.appendChild(span);
	
	this.showHUD = function() {
		_stage.appendChild(_stats);
	};
	
	this.hideHUD = function() {
		_stage.removeChild(_stats);
	};
	
	this.updateFps = function(value) {
		_fps.nodeValue = "FPS : " + ~~(_gameTime.getFPS());
	};
	
	this.updatePlayerInformation = function(player) {
		_playerName.nodeValue = "Player : " + player.playerName;
		_angle.nodeValue = "Angle : " + player.angle;
		_power.nodeValue = "Power : " + player.power;
		_uiController.populate(player);
	};
	
	this.updateWind = function(value) {
		var context = _windCanvas.getContext("2d");
		context.strokeStyle = "#00FF00";
		
		var startX = _root.width - 50
		var startY = 120;
		var endX = startX + Math.min(value * 10, startX);
		
		context.moveTo(startX, startY);
		context.lineTo(endX, startY);
		
		var offsetX = endX < startX ? 5 : -5;
		var offsetY = 5;
		
		context.lineTo(endX + offsetX, startY - offsetY);
		context.moveTo(endX, startY);
		context.lineTo(endX + offsetX, startY + offsetY);
		context.stroke();
	};
}