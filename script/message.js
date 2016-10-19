// Author: Simon J. Hogan
// Modifed: 24/04/2016
// Sith'ari Consulting Australia
// --------------------------------------------

var message = new MESSAGE();

function MESSAGE() {
	this.id = "message";
	this.success = 1;
	this.error = 2;
	this.notice = 3;
	this.interval;
};

MESSAGE.prototype.visible = function() {
	if (dom.querySelector("#" + this.id)) {
		return true;
	}
	return false;
};

MESSAGE.prototype.remove = function() {
	if (this.interval) {
		window.clearTimeout(this.interval);
	}
	dom.hide("#" + this.id);
	dom.hide("#" + this.id + "Overlay");			
	dom.remove("#" + this.id);
	dom.remove("#" + this.id + "Overlay");	
};

MESSAGE.prototype.show = function(settings) {
	var self = this;
	var className;
	var duration = settings.duration || 3000;
	var persist = settings.persist || false;

	this.remove();
	
	switch(settings.messageType) {
		case this.success:		
				className = "message-success";
			break;
		
		case this.error:
				className = "message-error";	
			break;
			
		case this.notice:
				className = "message-notice";	
			break;			
	}

	dom.append("body", {
		nodeName: "div",
		className: "message-overlay",
		id: this.id + "Overlay"
	});
		
	dom.append("body", {
		nodeName: "div",
		className: "message " + className,
		id: this.id,
		text: settings.text	
	});
	
	if (!persist) {	
		this.interval = window.setTimeout(function() {
			dom.hide("#" + self.id);
			dom.hide("#" + self.id + "Overlay");			
			dom.remove("#" + self.id);
			dom.remove("#" + self.id + "Overlay");			
		}, duration);

	}
};