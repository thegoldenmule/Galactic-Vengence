TerrainGenerator = function() {
	var _that = this;
	
	// ref
	var config = Game.engine.config;
	
	function generateLimitedRandom(width, height, maxHeightIncrease, maxHeight) {
		var heightMap = new Array2(
			width,
			height);
		
		// don't want it to be zero!
		var minimumHeight = 50;
		
		for(var i = 0; i < heightMap.getWidth() - 1; i++){
			for(var j = 0; j < heightMap.getHeight() - 1; j++){
				var a = 0;
				if(i != 0 && j != 0){
					a = (heightMap.get(i - 1, j) + heightMap.get(i, j - 1)) / 2;
				}
				else if( i != 0 && j == 0 ){
					a = heightMap.get(i - 1, j);
				}
				else{
					a = Math.random() * height;
				}
				var h = a + maxHeightIncrease * (Math.random() - 1 / 2);
				heightMap.set(i, j, Math.max(minimumHeight, Math.min(h, maxHeight)));
			}
		}
		
		return heightMap;
	};
	
	function generateCircleHill(
		width,
		height,
		numCircles,
		circleRadius,
		circleHeightIncrease,
		maxHeight) {
		
		var circleRadiusSquared = circleRadius * circleRadius;
		var minimumHeight = 50;
		
		var heightMap = new Array2(width, height);
		heightMap.fill(50);
		
		for(var pd_i = 1; pd_i < numCircles; pd_i++){
			var pd_x = ~~(Math.random() * width);
			var pd_y = ~~(Math.random() * height);
			for(var pd_j = 0; pd_j < width - 1; pd_j++){
				for(var pd_k = 0; pd_k < height - 1; pd_k++){
					var pd_d = (pd_x - pd_j)*(pd_x - pd_j) + (pd_y - pd_k)*(pd_y - pd_k);
					if(pd_d < circleRadiusSquared){
						var pd_a = (circleHeightIncrease / 2) * (1 + Math.cos(Math.PI * pd_d / (circleRadiusSquared)));
						heightMap.set(
							pd_j,
							pd_k,
							Math.min(heightMap.get(pd_j, pd_k) + pd_a, maxHeight));
					}
				}
			}
		}
		
		return heightMap;
	};
	
	this.generateTerrain = function(type) {
		switch(type) {
			case TerrainGenerator.TYPE_CIRCLEHILL:
			{
				return generateCircleHill(201, 40, 25, 10, 200, 400);
				break;
			}
			case TerrainGenerator.TYPE_LIMITEDRANDOM:
			{
				return generateLimitedRandom(201, 40, 100, 500);
				break;
			}
		}
	};
};

TerrainGenerator.TYPE_CIRCLEHILL = "circleHill";
TerrainGenerator.TYPE_LIMITEDRANDOM = "limitedRandom";