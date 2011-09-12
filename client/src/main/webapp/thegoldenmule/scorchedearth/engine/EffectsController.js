function EffectsController(context) {
	var _that = this;
	var _context = context;
	_context.globalCompositeOperation = "lighter";
	
	var _particleSystems = [];
	
	this.registerParticleSystem = function(system) {
		_particleSystems.push(system);
	};
	
	this.updateAndRender = function(dt) {
		for (var i = 0; i < _particleSystems.length; i++) {
			_particleSystems[i].update(dt);
			_particleSystems[i].render(_context);
		}
	};
}