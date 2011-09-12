/**
 * DisplayObject.js - a basic implementation with an interface similar to
 * Flash's DisplayObject.
 * 
 * The basic idea is that each DisplayObject is a div. You may add nodes to the
 * div, like images, text, etc. Each DisplayObject also has a <canvas> attached
 * so that you may draw or blit in addition to attaching nodes.
 * 
 * Click events are handled here as well. Rather than listening to the object's
 * div for events, DisplayObject dispatches both 'canvasclick' events and the more
 * useful, 'perfectclick' events. The former are dispatched whenever the div
 * is clicked, the later only when the canvas is clicked and the point at which
 * it has been clicked has a valid RGBA value, i.e. it is a pixel perfect click
 * event for the canvas.
 * 
 * Note: Assumes existence of canvas.
 * @author thegoldenmule
 */
var DisplayObject = (function() {
	/**
	 * Static
	 */
	// generates a unique id
	var id = 0;
	function generateUniqueId() {
		return "do" + id++;
	}
	
	// generates an appropriately styled div
	function generateDiv(id) {
		var div = document.createElement("div");
		div.style.position = "relative";
		div.id = id;
		return div;
	}
	
	// generates an appropriately styled canvas
	function generateCanvas(id) {
		var canvas = document.createElement("canvas");
		canvas.id = id + "_canvas";
		canvas.style.position = "absolute";
		canvas.style.left = "0px";
		canvas.style.top = "0px";
		canvas.width = canvas.height = 100;
		return canvas;
	}
	
	/**
	 * Instance
	 */
	return function(){
		/**
		 * Private
		 */
		// keeps an id unique to this DisplayObject
		var _uniqueId = generateUniqueId();
		
		// a list of child DisplayObjects
		var _objects = [];
		
		// a reference to this object
		var _that = this;
		
		/**
		 * Read Only
		 */
		// the main container
		var _div = (function() {
				var div = generateDiv(_uniqueId);
				div.displayObject = _that;
				return div;
			})();
		this.div = (function(){
			return _div;
		})();
		
		// the canvas + context of this object
		// we need to keep this hidden, as I don't
		// want to allow messing with the actual tag
		var _context;
		var _canvas = (function() {
			var canvas = generateCanvas(_uniqueId);
			_div.appendChild(canvas);
			_context = canvas.getContext("2d");
			
			function getLocalPoint(event) {
				// calculate this element's position
				var myx = 0;
				var myy = 0;
				var obj = canvas;
				if (obj.offsetParent) {
					// we loop through all the parents, adding up the offsets
					do {
						myx += obj.offsetLeft;
						myy += obj.offsetTop;
					} while (obj = obj.offsetParent);	// this is not a typo!
				}
				
				// now get the coordinates relative to the document
				var posx = 0;
				var posy = 0;
				if (!event) {
					event = window.event;
				}
				if (event.pageX || event.pageY) {
					posx = event.pageX;
					posy = event.pageY;
				} else if (event.clientX || event.clientY) {
					posx = event.clientX
						+ document.body.scrollLeft
						+ document.documentElement.scrollLeft;
					posy = event.clientY
						+ document.body.scrollTop
						+ document.documentElement.scrollTop;
				}
				
				// Finally, we take the difference to find the coordinates
				// with respect to the canvas.
				return [
					posx - myx,
					posy - myy
				];
			}
			
			function mouseHandler(event) {
				// global to local
				var coords = getLocalPoint(event);
				
				// Get image data at that pixel + determine if there is anything
				// but alpha.
				//var imagedata = _context.getImageData(0, 0, 100, 100);
				//jQuery(_that).triggerHandler('perfectclick', [coords.x, coords.y]);
				
				// trigger canvasclick
				jQuery(_that).trigger("canvas_" + event.type, coords);
			}
			
			jQuery(canvas)
				.click(mouseHandler)
				.mousedown(mouseHandler)
				.mouseup(mouseHandler)
				.mousemove(mouseHandler);
			
			return canvas;
		})();
		this.context = (function() {
			return _context;
		})();
		this.clearContext = function() {
			_canvas.width = _canvas.width;
		};
		this.getCanvasWidth = function() {
			return _canvas.width;
		};
		this.setCanvasWidth = function(value) {
			if (typeof value == 'undefined') {
				return _that;
			}
			
			_canvas.width = value;
			return _that;
		};
		this.getCanvasHeight = function() {
			return _canvas.height;
		};
		this.setCanvasHeight = function(value) {
			if (typeof value == 'undefined') {
				return _that;
			}
			
			_canvas.height = value;
			return _that;
		};
		this.setCanvasDims = function (width, height) {
			_canvas.width = width;
			_canvas.height = height;
			return _that;
		}
		
		/**
		 * Privaleged
		 */
		// adds a DisplayObject as a child
		this.addChild = function(displayObject){
			if (_objects.indexOf(displayObject) == -1) {
				_objects.push(displayObject);
				displayObject.div.style.zIndex = _objects.length - 1;
				
				_div.appendChild(displayObject.div);
			} else {
				_that.removeChild(displayObject);
				_that.addChild(displayObject);
				displayObject.div.style.zIndex = _objects.length - 1;
			}
			return displayObject;
		};
		
		// adds a DisplayObject as a child at a specific index
		this.addChildAt = function(displayObject, index){
			if(_objects.length > index) {
				var objects = [],
					len = _objects.length;
				for (var i = 0; i++ < len;) {
					if (i == index) {
						objects.push(displayObject);
						displayObject.div.style.zIndex = i;
					}
					
					objects.push(_objects[i]);
					_objects[i].div.style.zIndex = objects.length - 1;
				}
				_objects = objects;
			} else {
				_that.addChild(displayObject);
			}
			return displayObject;
		};
		
		// removes a child
		this.removeChild = function(displayObject){
			var objects = [],
				len = _objects.length; 
			for (var i = 0; i++ < len;) {
				if (_objects[i] !== displayObject) {
					objects.push(_objects[i]);
					_objects.div.style.zIndex = objects.length - 1;
				}
			}
			
			_objects = objects;
			return displayObject;
		};
		
		// returns a child's z-index
		this.getChildIndex = function(displayObject) {
			return _objects.indexOf(displayObject);
		};
		
		/**
		 * Getters and Setters
		 * (Note: Real getters and setters are not supported in IE.)
		 */
		this.setx = function(value){
			if (typeof value === 'undefined') {
				return;
			}
			
			_div.style.left = value + "px";
			return _that;
		};
		
		this.getx = function(){
			return _div.style.left.replace("px", "");
		};
		
		this.sety = function(value){
			if (typeof value === 'undefined') {
				return;
			}
			
			_div.style.top = value + "px";
			return _that;
		};
		
		this.gety = function(){
			return _div.style.top.replace("px", "");
		};
	};
})();
