Game.createNamespace("engine.renderer");
Game.engine.renderer = (function() {
	var _that = Game.engine.renderer;
	
	// load images
	var image1 = new Image();
	image1.onload = function(event) {
		image1.isloaded = true;
	};
	image1.src = "resources/tank1.png";
	
	function drawVectorShape(body, shape, context) {
		var scale = Game.engine.config.scale;
		
		context.strokeStyle = body.isEarth == true ? "#AC7F24" : "#FF0000";
		context.fillStyle = context.strokeStyle;
		context.beginPath();
		switch(shape.m_type) {
			case b2Shape.e_polyShape:
			{
				var poly = shape;

				var tV = b2Math.AddVV(poly.m_position, b2Math.b2MulMV(poly.m_R, poly.m_vertices[0]));
				tV.Multiply(scale);
				
				context.moveTo(tV.x, tV.y);
				for (var i = 0; i < poly.m_vertexCount; i++) {
					var v = b2Math.AddVV(poly.m_position, b2Math.b2MulMV(poly.m_R, poly.m_vertices[i]));
					v.Multiply(scale);
					context.lineTo(v.x, v.y);
				}
				context.lineTo(tV.x, tV.y);
				context.fill();
				break;
			}
			case b2Shape.e_circleShape:
			{
				context.fillStyle = context.strokeStyle;
				context.arc(
					shape.m_position.x * scale,
					shape.m_position.y * scale,
					shape.m_maxRadius * scale,
					0, 2 * Math.PI, false);
				context.fill();
				break;
			}
		}
		
		// render
		context.stroke();
	};
	
	function drawPlayerShape(body, shape, context) {
		var scale = Game.engine.config.scale;
		if (image1.isloaded != true) return;
		
		// find the top left corner
		var tV = body.topLeft;
		if (!tV) {
			tV = b2Math.AddVV(shape.m_position, b2Math.b2MulMV(shape.m_R, shape.m_vertices[0]));
			tV.Multiply(scale);
			body.topLeft = tV;
		}
		
		// rotate our context by the rotation of the shape
		context.rotate(body.GetRotation());
		
		// transform the top left corner backward so the compositon
		// of this rotation with the context's rotation is zero
		var transformed = b2Math.b2MulMV(new b2Mat22(-body.GetRotation()), tV);
		
		// blit
		context.drawImage(
			image1,
			0, 0,
			12, 12,
			transformed.x, transformed.y,
			12, 12);
		
		// rotate the context back to normal
		context.rotate(-body.GetRotation());
		
		// now draw the GUN!
		var endP = new b2Vec2(0, -10);
		endP = b2Math.b2MulMV(new b2Mat22(Math.toRadians(body.player.angle)), endP);
		
		var topCenter = tV.Copy();
		topCenter.x += 6;
		endP = b2Math.AddVV(topCenter, endP);
		
		context.beginPath();
		context.strokeStyle = "#000000";
		context.moveTo(topCenter.x, topCenter.y);
		context.lineTo(endP.x, endP.y);
		context.stroke();
		
		// active players get a halo + health
		if (body.player.isActive) {
			context.beginPath();
			context.strokeStyle = "#FFFFFF";
			context.arc(
				tV.x + 6,
				tV.y + 6,
				20,
				0, 2 * Math.PI, false);
			context.stroke();
			
			// draw health
			var health = body.player.health;
			context.beginPath();
			
			if (health > 80) {
				context.fillStyle = "#008B00";
			} else if (health > 50) {
				context.fillStyle = "#FFD700"
			} else if (health > 20) {
				context.fillStyle = "#FF4500";
			} else {
				context.fillStyle = "#FF0000";
			}
			context.fillRect(tV.x + 22, tV.y + 22, 12 * (health / 100), 4);
			context.strokeStyle = "#FFFFFF";
			context.strokeRect(tV.x + 22, tV.y + 22, 12, 4);
			context.stroke();
		}
	};
	
	_that.renderEarth = function(canvas) {
		var context = canvas.getContext("2d");
		
		var worldBodies = Game.engine.physics.getWorldBodies();
		for (var body = worldBodies; body; body = body.m_next) {
			for (var shape = body.GetShapeList(); null != shape; shape = shape.GetNext()) {
				if (body.isEarth) {
					drawVectorShape(body, shape, context);
				}
			}
		}
	};
	
	_that.render = function() {
		// get contexts
		var dynamicsContext = Game.engine.canvasController.dynamics.getContext("2d");
		var playerContext = Game.engine.canvasController.players.getContext("2d");
		
		// clear
		dynamicsContext.canvas.width = dynamicsContext.canvas.width;
		playerContext.canvas.width = playerContext.canvas.width;
		
		// vector draw bodies for now
		var worldBodies = Game.engine.physics.getWorldBodies();
		for (var body = worldBodies; body; body = body.m_next) {
			for (var shape = body.GetShapeList(); null != shape; shape = shape.GetNext()) {
				if (body.isPlayer) {
					drawPlayerShape(body, shape, playerContext);
				} else if (!body.isEarth) {
					drawVectorShape(body, shape, dynamicsContext);
				}
			}
		}
	};
	
	return _that;
})();