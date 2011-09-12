function PanelController (containerDiv, contentDiv, popoutDiv) {
	var X_CLOSED = -570;
	var X_OPEN = 0;
	
	// start minimized
	containerDiv.style.left = X_CLOSED + "px";
	
	// define toggle function
	this.toggle = function(event) {
		var xPos;
		if (containerDiv.style.left == X_CLOSED + "px") {
			xPos = X_OPEN;
		} else if (containerDiv.style.left == X_OPEN + "px"){
			xPos = X_CLOSED;
		} else return;
		
		$(containerDiv).animate({
			left: xPos + "px"
		}, 200);
	};
	
	// listen
	$(popoutDiv).click(this.toggle);
	
	var _playerContent;
	this.populate = function (player) {
		if (_playerContent) {
			contentDiv.removeChild(_playerContent);
		}
		
		_playerContent = document.createElement("div");
		
		var p, weapon;
		for (var i = 0; i < player.weapons.length; i++) {
			weapon = player.weapons[i];
			p = document.createElement("p");
			p.id = player.name + "_" + weapon.name;
			p.appendChild(document.createTextNode(weapon.name + " : " + weapon.damage + " : " + weapon.splash + " : " + weapon.quantity));
			_playerContent.appendChild(p);
		}
		
		contentDiv.appendChild(_playerContent);
	};
};