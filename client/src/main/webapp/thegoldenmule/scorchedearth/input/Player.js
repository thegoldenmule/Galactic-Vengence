function Player(creationObject) {
	for (var prop in creationObject) {
		this[prop] = creationObject[prop];
	}
}