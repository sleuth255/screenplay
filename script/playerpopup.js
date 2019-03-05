// Author: Kevin Wilcox
// Modifed: 24/04/2016
// The Paradigm Grid
// --------------------------------------------

var playerpopup = new PLAYERPOPUP();

function PLAYERPOPUP() {
	this.id = "playerpopup";
	this.interval;
};

PLAYERPOPUP.prototype.visible = function() {
	if (dom.querySelector("#" + this.id)) {
		return true;
	}
	return false;
};

PLAYERPOPUP.prototype.remove = function() {
	if (this.interval) {
		window.clearTimeout(this.interval);
	}
	dom.hide("#" + this.id);
	dom.remove("#" + this.id);
};

PLAYERPOPUP.prototype.show = function(settings) {
	var self = this;
	var className;
	var duration = settings.duration || 3000;
	var persist = settings.persist || false;

	this.remove();
	
	dom.append("body", {
		nodeName: "div",
		className: "playerpopup",
		id: this.id,
		text: settings.text	
	});
	
	if (!persist) {	
		this.interval = window.setTimeout(function() {
			dom.hide("#" + self.id);
			dom.remove("#" + self.id);
		}, duration);

	}
};