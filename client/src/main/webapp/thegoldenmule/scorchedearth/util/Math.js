/**
 * Math additions.
 * 
 * @author thegoldenmule
 */
Math.clamp = function(value, minimum, maximum) {
	return value < minimum ? minimum : value > maximum ? maximum : value;
};

Math.toRadians = function(degrees) {
	return degrees * Math.PI / 180;
};

Math.toDegrees = function(radians) {
	return radians * 180 / Math.PI;
};