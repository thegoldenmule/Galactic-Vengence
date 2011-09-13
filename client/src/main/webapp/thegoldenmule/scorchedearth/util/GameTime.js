/**************************************************************************
 * Provides requestAnimationFrame in a cross browser way.
 * http://paulirish.com/2011/requestanimationframe-for-smart-animating/
 */
if ( !window.requestAnimationFrame ) {
	window.requestAnimationFrame = (function() {
		return window.webkitRequestAnimationFrame ||
			window.mozRequestAnimationFrame ||
			window.oRequestAnimationFrame ||
			window.msRequestAnimationFrame ||
			function( /* function FrameRequestCallback */ callback, /* DOMElement Element */ element ) {
				window.setTimeout( callback, 1000 / 60 );
			};
	})();
}
/*************************************************************************/

/**
 * GameTime
 * 
 * @author thegoldenmule
 */
function GameTime() {
	
	// vars
	var _that = this,
		_jQueryThat = jQuery(_that),
		_time,
		_elapsed = 0,
		_fps = 0,
		_started = false,
		_then,
		_now = Date.now || function() { return (new Date()).getTime(); };
	
	_that.getElapsed = function() {
		return _elapsed;
	};
	
	_that.getFPS = function() {
		return _fps;
	};
	
	_that.start = function() {
		if (_started) return;
		_started = true;
		
		var now = _now(),
			dt = 1 / 60;
		if (_then) {
			dt = now - _then;
			_fps = 1000 / dt;
		}
		_then = now;
		
		// trigger
		_jQueryThat.trigger('tick', dt);
		
		// use requestAnimFrame
		window.requestAnimationFrame(_that.start);
	};
	
	// privaleged
	_that.stop = function() {
		if (!_started) return;
		_started = false;
		
		_then = null;
	};
	
	return _that;
};