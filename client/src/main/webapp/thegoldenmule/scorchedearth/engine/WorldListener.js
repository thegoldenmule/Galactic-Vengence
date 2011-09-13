function WorldListener() {
	var _that = this,
		physics = Game.engine.physics,
		input = Game.input,
		scale = Game.engine.config.scale,
		width = Game.engine.config.getStageWidth(),
		height = Game.engine.config.getStageHeight();
	
	_that.tick = function(dt) {
		return;
		var players = input.getPlayers(),
			player,
			body, body1, body2;
		for (var i = 0; i < players.length; i++) {
			player = players[i];
			body = player.body;
			var contactList = body.GetContactList();
			if (contactList) {
				var contact = contactList.contact;
				while (null != contact) {
					body1 = contact.GetShape1().GetBody();
					body2 = contact.GetShape2().GetBody();
					
					if (body1.isPlayer) {
						
					}
					contact = contact.next;
				}
			}
		}
	};
	
	_that.onPlayerContact = function(playerBody, contact) {
		if (typeof contact.projectileType == "undefined") return;
		var player = playerBody.player;
		
		switch(contact.projectileType) {
			case "bullet":
			{
				player.health -= 30;
			}
			case "mortar":
			{
				player.health -= 40;
			}
		}
	};
	
	_that.onProjectileContact = function(projectile, contact) {
		if (contact.IsStatic() && typeof projectile.projectileType != "undefined") {
			switch(projectile.projectileType) {
				case "bullet":
				{
					clearInterval(projectile.trackingInterval);
					physics.destroyBody(projectile);
					
					$(_that).trigger("worldSleeping");
					break;
				}
				case "mortar":
				{
					clearInterval(projectile.trackingInterval);
					
					var position = projectile.GetOriginPosition();
					position.Multiply(scale);
					
					var gravity = physics.getGravity();
					gravity.Multiply(1/100);
					
					// make an explosion
					var particleSystem = new cParticleSystem();
					particleSystem.position = Vector.create(position.x, position.y);
					particleSystem.startColour = [255, 69, 0, 1];
					particleSystem.endColour = [255, 0, 0, 1];
					particleSystem.size = 20;
					particleSystem.maxParticles = 20000;
					particleSystem.duration = .001;
					particleSystem.gravity = Vector.create(gravity.x, gravity.y);
					particleSystem.init();
					
					Game.engine.effects.registerParticleSystem(particleSystem);
					
					physics.destroyBody(projectile);
					$(_that).trigger("worldSleeping");
				}
			}
		}
	};
	
	_that.trackProjectile = function(projectile) {
		projectile.onContact = _that.onProjectileContact;
		
		// timer
		var totalTime = 0;
		projectile.trackingInterval = setInterval(function() {
			var vel = projectile.GetLinearVelocity();
			var pos = projectile.GetOriginPosition();
			if (projectile.IsSleeping()
				|| velocityLimit(totalTime, vel)
				|| positionLimit(totalTime, pos, vel)) {
				clearInterval(projectile.trackingInterval);
				physics.destroyBody(projectile);
				
				$(_that).trigger("worldSleeping");
			}
			
			totalTime += 1;
		}, 1000);
	}
	
	function velocityLimit(totalTime, velocity) {
		return totalTime > 10 && velocity.x < 0.1 && velocity.y < 0.1;
	};
	
	function positionLimit(totalTime, position, velocity) {
		if (totalTime <= 10) {
			return position.x < 0 && velocity.x < 0
				|| position.x > width && velocity.x > 0;
		}
		
		return totalTime > 10
			&& (position.x < 0 || position.x > width || position.y < 0 || position.y > height);
	};
	
	_that.NotifyBoundaryViolated = function(body) {
		
	};
	
	_that.NotifyJointDestroyed = function(joint) {
		
	};
	
	return _that;
}