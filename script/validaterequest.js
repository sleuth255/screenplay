// Author: Kevin Wilcox
// Modifed: 02/02/2017
// The Paradigm Grid
// --------------------------------------------

var validaterequest = new VALIDATEREQUEST();

function VALIDATEREQUEST() {
	this.data = {};
};


VALIDATEREQUEST.prototype.showPopup = function(settings) {
	var self = this;

	dom.append("body", {
		nodeName: "div",
		className: "validaterequest",
		id: "validaterequest",
	    text: settings.text,
		childNodes: [{
		    nodeName: "button",
		    className: "validaterequest validaterequest-button",
		    id: "validaterequest-yes",
		    text: "Yes"
	    }, {
			nodeName: "button",
			className: "validaterequest validaterequest-button",
			id: "validaterequest-no",
			text: "No"
	    }]
	});
	dom.on("#validaterequest-yes", "click", function(event) {
		dom.dispatchCustonEvent(settings.eventHandler, "validate-yes", self.data);
		dom.remove("#validaterequest")
	});
	dom.on("#validaterequest-no", "click", function(event) {
		dom.dispatchCustonEvent(settings.eventHandler, "validate-no", self.data);
		dom.remove("#validaterequest")
	});
	dom.querySelector("#validaterequest").addEventListener("keydown",function (event){
		if (dom.exists("#player"))
			return;
		var self = event.delegateTarget;

		if (event.which == keys.KEY_OK) {
			event.stopPropagation()
			self.click();
			return;
		}
		switch (event.which) 
		{
		    case keys.KEY_LEFT: 
			    dom.querySelector("#validaterequest-yes").focus();
			    break;
		    case keys.KEY_RIGHT: 
			    dom.querySelector("#validaterequest-no").focus();
			    break;
	    }
	});
    dom.querySelector("#validaterequest-no").focus();


};