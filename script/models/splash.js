// Author: Simon J. Hogan
// Modifed: 24/04/2016
// Sith'ari Consulting Australia
// --------------------------------------------

function Splash() {
	this.interval;
};

Splash.prototype.show = function(settings) {
	var self = this;
	var duration = settings.duration || 3000;
	var persist = settings.persist || false;
		
	dom.append("body", {
		nodeName: "div",
		className: "splash",
		id: "splash",
		childNodes: [
			{
				nodeName: "div",
				className: "splash-author",
				text: device.author				
			}, {
				nodeName: "div",
				className: "splash-version",
				text: device.version				
			}
		]
	});
	
	if (!persist) {
		this.interval = window.setTimeout(function() {
			self.close();	
			if (settings.end) {
				settings.end();
			}	
		}, duration);	
	}
};

Splash.prototype.close = function() {
	if (this.interval) {
		window.clearTimeout(this.interval);
	}	
	dom.hide("#splash");			
	dom.remove("#splash");		
};