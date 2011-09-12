function InputController(root, config, physics) {
	var _root = root;
	var _config = config;
	var _physics = physics;
	var _players = [];
	var _currentPlayer = 0;
	this.getPlayers = function() {
		return _players;
	};
	
	this.makePlayers = function() {
		_players = [];
		
		var player;
		for (var i = 0; i < _config.numberOfPlayers; i++) {
			player = new Player({
				color : "#FFFFFF",
				playerName : "Ben" + i,
				angle : 0,
				power : 750,
				health : 100,
				weapons : [
					new Missile(999),
					new Mortar(10)
				]
			});
			_players.push(player);
		}
		return _players;
	};
	
	this.startRound = function() {
		setPlayer(0);
	};
	
	function setPlayer(number) {
		_currentPlayer = number;
		
		for (var i = 0; i < _players.length; i++) {
			_players[i].isActive = i == _currentPlayer;
		}
		Game.engine.canvasController.updatePlayerInformation(_players[_currentPlayer]);
		
		$(document).bind("keydown", keyDown);
	};
	
	var _currentKey;
	function keyDown(event) {
		if (_currentKey) return;
		
		var key = event.which;
		var player = _players[_currentPlayer];
		switch (key) {
			case 32:
			{
				$(document).unbind("keydown", keyDown);
				$(_physics.worldListener).bind("worldSleeping", function(event) {
					$(_physics.worldListener).unbind("worldSleeping", arguments.callee);
					setPlayer((_currentPlayer + 1) % _players.length);
				});
				_players[_currentPlayer].isActive = false;
				_physics.fire(player, "bullet");
				break;
			}
			case 38:
			{
				player.power = Math.clamp(player.power + 4, 100, 2000);
				break;
			}
			case 40:
			{
				player.power = Math.clamp(player.power - 4, 100, 2000);
				break;
			}
			case 39:
			{
				player.angle = Math.clamp(player.angle + 1, -90, 90);
				break;
			}
			case 37:
			{
				player.angle = Math.clamp(player.angle - 1, -90, 90);
				break;
			}
			default:return;
		}
		
		Game.engine.canvasController.updatePlayerInformation(player);
	};
}