// Author: Simon J. Hogan
// Modifed: 24/04/2016
// Sith'ari Consulting Australia
// --------------------------------------------

var device = new DEVICE();

function DEVICE() {
	this.client = "screenplay";
	this.name = "LG Smart TV";
	this.id = storage.exists("emby.device.id") ? storage.get("emby.device.id") : storage.set("emby.device.id", guid.create());
	this.version = "v1.1.9";
	this.author = "The Paradigm Grid",			
	this.language = navigator.language;
	this.platform = navigator.platform;
	this.appCodeName = navigator.appCodeName;
	this.appVersion = navigator.appVersion;	
	this.product = navigator.product;
	this.view = {
		height: window.innerHeight,
		width: window.innerWidth
	};
	this.timeout = 6000;
	
	this.bodyClass = window.innerHeight > 720 ? "view-1080" : "view-720";
	this.columnWidth = window.innerHeight > 720 ? 258 : 143;
	this.columnWidthSquare =  window.innerHeight > 720 ? 376 : 209;	
};