function Missile(quantity) {
	this.name = "Missile";
	this.damage = 30;
	this.splash = 0;
	this.quantity = typeof quantity == "undefined" ? 999 : quantity;
	
	this.onHitPlayer = function() {
		
	};
	
	this.onHitStatic = function() {
		
	};
};