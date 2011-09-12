Game.createNamespace("engine.physics");
Game.engine.physics = (function() {
	var _that = Game.engine.physics;
	var _terrainGenerator = new TerrainGenerator();
	var _config = Game.engine.config;
	
	// create world
	var _world;
	_that.createWorld = function() {
		var worldAABB = new b2AABB();
		worldAABB.minVertex.Set(-10, -1000);
		worldAABB.maxVertex.Set(_config.getStageWidth() + 10, _config.getStageHeight() + 10);
		
		_world = new b2World(
			worldAABB,
			new b2Vec2(0, 10),
			true);
		
		return _that;
	};
	_that.getWorldBodies = function() {
		return _world ? _world.m_bodyList : [];
	};
	_that.getBodyCount = function() {
		return _world ? _world.m_bodyCount : 0;
	};
	_that.destroyBody = function(body) {
		_world.DestroyBody(body);
		return _that;
	};
	_that.createBody = function(bodyDef) {
		_world.CreateBody(bodyDef);
		return _that;
	};
	_that.getGravity = function() {
		return _world.m_gravity.Copy();
	};
	
	var _worldListener;
	_that.withWorldListener = function(worldListener) {
		_worldListener = worldListener;
		_that.worldListener = (function() {
			return _worldListener;
		})();
		
		_world.SetListener(_worldListener);
		
		return _that;
	};
	
	var _earthMap;
	var _currentMap = [];
	_that.createEarth = function() {
		_world.m_gravity = new b2Vec2(
			(Math.random() + -1/2) * (Math.random() * 10 + 3),
			10);
		
		// generate terrain
		//_earthMap = _terrainGenerator.generateTerrain(TerrainGenerator.TYPE_LIMITEDRANDOM);
		_earthMap = _terrainGenerator.generateTerrain(TerrainGenerator.TYPE_CIRCLEHILL);
		var width = _earthMap.getWidth();
		var height = _earthMap.getHeight();
		var scale = _config.scale;
		
		var cellHeight = 10;
		var cellWidth = 2 * _config.getStageWidth() / width;
		
		var stageHeight = _config.getStageHeight();
		
		// random cross section
		var randomIndex;
		while (!randomIndex) {
			randomIndex = ~~(Math.random() * height);
		}
		
		var minHeight = 100;
		
		var polyDef, bodyDef, point1, point2;
		_currentMap = [];
		for (var i = 0; i < width - 2; i++) {
			point1 = _earthMap.get(i, randomIndex);
			point2 = _earthMap.get(i + 1, randomIndex);
			_currentMap.push(point1 + minHeight);
			_currentMap.push(point2 + minHeight);
			
			polyDef = new b2PolyDef();
			polyDef.vertexCount = 4;
			polyDef.vertices[0].Set(0, 0);
			polyDef.vertices[1].Set(0, -point1 / scale);
			polyDef.vertices[2].Set(cellWidth / scale, -point2 / scale);
			polyDef.vertices[3].Set(cellWidth / scale, 0);
			
			bodyDef = new b2BodyDef();
			bodyDef.position.Set(i * cellWidth / scale, (stageHeight - minHeight) / scale);
			bodyDef.AddShape(polyDef);
			
			var earthPiece = _world.CreateBody(bodyDef);
			earthPiece.isEarth = true;
		}
		
		return _that;
	};
	
	_that.getWind = function() {
		return _world.m_gravity.x;
	};
	
	_that.createPlayers = function(players) {
		var scale = Game.engine.config.scale;
		var positions = [];
		function isTooClose(position) {
			for (var i = 0; i < positions.length; i++) {
				if (Math.abs(positions[i] - position) < 100) return true;
			}
			
			return false;
		}
		
		var cellWidth = _config.getStageWidth() / _earthMap.getWidth(),
			position;
		for (var i = 0; i < players.length; i++) {
			var boxShapeDef = new b2PolyDef();
			boxShapeDef.vertexCount = 4;
			boxShapeDef.vertices[0].Set(0, 0);
			boxShapeDef.vertices[1].Set(12 / scale, 0);
			boxShapeDef.vertices[2].Set(12 / scale, 12 / scale);
			boxShapeDef.vertices[3].Set(0, 12 / scale);
			
			var boxBodyDef = new b2BodyDef();
			// search for a good place to put them
			position = null;
			while(!position) {
				var value = ~~(Math.random() * (_config.getStageWidth() - 100)) + 100;
				
				if (!isTooClose(value)) {
					position = value;
					positions.push(position);
				}
			}
			
			var index = ~~(position / cellWidth);
			boxBodyDef.position.Set(position / scale,
				(_config.getStageHeight() - (_currentMap[index] + _currentMap[index + 1]) / 2 - 12) / scale);
			boxBodyDef.AddShape(boxShapeDef);
			
			var playerBody = _world.CreateBody(boxBodyDef);
			playerBody.isPlayer = true;
			playerBody.player = players[i];
			playerBody.onContact = _worldListener.onPlayerContact;
			
			players[i].body = playerBody;
		}
	};
	
	_that.fire = function(player, projectileType) {
		var scale = Game.engine.config.scale;
		var body = player.body;
		
		// find the exit point
		var angleVec = b2Math.b2MulMV(new b2Mat22(Math.toRadians(player.angle)), new b2Vec2(0, -3));
		
		var topCenter = body.topLeft.Copy();
		topCenter.Multiply(1 / scale);
		topCenter.x += 6 / scale;
		
		var endP = b2Math.AddVV(topCenter, angleVec);
		
		var projectiveDef = new b2CircleDef();
		projectiveDef.radius = 2 / scale;
		projectiveDef.density = 1;
		projectiveDef.friction = 0;
		projectiveDef.restitution = 0.3;
		
		// calculate velocity
		angleVec.Multiply(player.power / 100);
		var projectileBodyDef = new b2BodyDef();
		projectileBodyDef.position.Set(endP.x, endP.y);
		projectileBodyDef.linearVelocity = angleVec;
		projectileBodyDef.AddShape(projectiveDef);
		
		var projectile = _world.CreateBody(projectileBodyDef);
		projectile.projectileType = projectileType;
		
		_worldListener.trackProjectile(projectile);
	};
	
	_that.step = function(dt) {
		_world.Step(step, 1 /* number of iterations */);
	};
	
	return _that;
})();