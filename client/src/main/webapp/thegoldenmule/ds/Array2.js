/**
 * Simple two dimensional array implementation.
 * 
 * @param {int} width
 * @param {int} height
 */
function Array2(width, height) {
	this.getWidth = function() {
		return width;
	};
	this.getHeight = function() {
		return height;
	};
	this.get = function(x, y) {
		var index = getIndex(x, y);
		if (index >= 0 && index < _data.length) return _data[index];
		
		return undefined;
	};
	this.set = function(x, y, value) {
		_data[getIndex(x, y)] = value;
	};
	this.fill = function(value) {
		for (var i = 0; i < width; i++) {
			for (var j = 0; j < height; j++) {
				_data[getIndex(i, j)] = value;
			}
		}
	};
	
	// private
	var _data = [];
	function getIndex(x, y) {
		return x + y * width;
	};
};