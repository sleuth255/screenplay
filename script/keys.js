// Author: Simon J. Hogan
// Modifed: 24/04/2016
// Sith'ari Consulting Australia
// --------------------------------------------

var keys = new KEYS();

function KEYS() {
	this.settings;
	this.id = "keys";

	this.KEY_0 = 48;
	this.KEY_1 = 49;
	this.KEY_2 = 50;
	this.KEY_3 = 51;		
	this.KEY_4 = 52;	
	this.KEY_5 = 53;
	this.KEY_6 = 54;
	this.KEY_7 = 55;
	this.KEY_8 = 56;
	this.KEY_9 = 57;
			
	this.KEY_BACK = 461;
	this.KEY_BACKSPACE = 8; 
	this.KEY_ESC = 27;
	this.KEY_OK = 13;
	this.KEY_ENTER = 35;
	this.KEY_SPACE = 32;
							
	this.KEY_LEFT = 37;
	this.KEY_UP = 38;
	this.KEY_RIGHT = 39;
	this.KEY_DOWN = 40;		
	
	this.KEY_RED = 403;
	this.KEY_GREEN = 404;
	this.KEY_YELLOW = 405;
	this.KEY_BLUE = 406;
				 	
	this.KEY_PLAY = 415;
	this.KEY_PAUSE = 19;
	this.KEY_STOP = 413;
	this.KEY_REWIND = 412;
	this.KEY_FAST_FWD = 417;
	
	this.space;
	this.delet;
	this.clear;
	this.enter;
	this.press;
	this.closeKeys;
	
	this.rightKeyQuery;
};

KEYS.prototype.load = function(settings) {
	var self = this;
	settings = settings || {};
	
	if (settings.space) {
		this.space = settings.space;
	}

	if (settings.delet) {
		this.delet = settings.delet;
	}
	
	if (settings.clear) {
		this.clear = settings.clear;
	}
	
	if (settings.enter) {
		this.enter = settings.enter;
	}

	if (settings.press) {
		this.press = settings.press;
	}

	if (settings.close) {
		this.closeKeys = settings.close;
	}

	if (settings.rightKeyQuery) {
		this.rightKeyQuery = settings.rightKeyQuery;
	}
					
ajax.request(settings.url, {
		method: "GET",
		success: function(data) {
			self.settings = data;
			if (settings.success) {
				settings.success(data);
			}
		},
		error: function(data) {
			console.log(data.ResponseStatus.StackTrace);
			if (settings.error) {
				settings.error(data);
			}
		}
	});		
};

KEYS.prototype.open = function(query, settings) {
	var self = this;
	settings = settings || {};
		
	dom.append(query, {
		nodeName: "div",
		id: this.id,
		className: "key-container",
		childNodes: [{
			nodeName: "link",
			"type": "text/css",
			"rel": "stylesheet", 
			href: this.settings.style
		}]
	});	
	
	dom.append("#" + this.id, {
		nodeName: "div",
		id: this.id + "View",
		className: "key-view"
	});	


	dom.append("#" + self.id + "View", {
		nodeName: "div",
		id: this.id + "SelectRow",
		className: "key-set-select",
		childNodes: [{
				nodeName: "a",
				href: "#",
				id: this.id + "SelectLower",
				className: "key-set-select-item key key-set-active",
				text: self.settings.switc.lower,
				dataset: {
					keyLeft: "#" + this.id + "SelectLower",
					keyUp: "#" + this.id + "SelectLower",					
					keyRight: "#" + this.id + "SelectUpper",
					keyDown: ".key-row .key-focus"
				} 
			}, {
				nodeName: "a",
				href: "#",
				id: this.id + "SelectUpper",	
				className: "key-set-select-item key",							
				text: self.settings.switc.upper,
				dataset: {
					keyLeft: "#" + this.id + "SelectLower",
					keyUp: "#" + this.id + "SelectUpper",
					keyRight: "#" + this.id + "SelectSymbol",
					keyDown: ".key-row .key-focus"
				} 
			}, {
				nodeName: "a",
				href: "#",
				id: this.id + "SelectSymbol",	
				className: "key-set-select-item key",							
				text: self.settings.switc.symbol,
				dataset: {
					keyLeft: "#" + this.id + "SelectUpper",
					keyUp: "#" + this.id + "SelectSymbol",
					keyRight: this.rightKeyQuery || ("#" + this.id + "SelectSymbol"),										
					keyDown: ".key-row .key-focus"
				} 
		}]
	});

	this.addKeySet("#" + self.id + "View", "Lower", true);
	this.addKeySet("#" + self.id + "View", "Upper");
	this.addKeySet("#" + self.id + "View", "Symbol");	
	
	dom.append("#" + self.id + "View", {
		nodeName: "div",
		id: this.id + "ActionsRow",
		className: "key-actions",
		childNodes: [{
				nodeName: "a",
				href: "#",
				id: this.id + "ActionSpace",	
				className: "key-action-item key key-focus",							
				text: self.settings.actions.space,
				dataset: {
					ref: 'space',
					key: self.settings.actions.space,					
					keyLeft: "#" + this.id + "ActionSpace",					
					keyUp: ".key-row .key-focus",
					keyRight: "#" + this.id + "ActionDelete",						
					keyDown: "#" + this.id + "ActionSpace"						
				} 
			}, {
				nodeName: "a",
				href: "#",
				id: this.id + "ActionDelete",	
				className: "key-action-item key",							
				text: self.settings.actions.delet,
				dataset: {
					ref: 'delete',
					key: self.settings.actions.delet,
					keyLeft: "#" + this.id + "ActionSpace",
					keyUp: ".key-row .key-focus",					
					keyRight: "#" + this.id + "ActionClear",
					keyDown: "#" + this.id + "ActionDelete"						
				} 
			}, {
				nodeName: "a",
				href: "#",
				id: this.id + "ActionClear",
				className: "key-action-item key",
				text: self.settings.actions.clear,
				dataset: {
					ref: 'clear',
					key: self.settings.actions.clear,
					keyLeft: "#" + this.id + "ActionDelete",
					keyUp: ".key-row .key-focus",											
					keyRight: "#" + this.id + "ActionEnter",
					keyDown: "#" + this.id + "ActionClear"					
				} 
			}, {
				nodeName: "a",
				href: "#",
				id: this.id + "ActionEnter",	
				className: "key-action-item key",							
				text: self.settings.actions.enter,
				dataset: {
					ref: 'enter',
					key: self.settings.actions.enter,
					keyLeft: "#" + this.id + "ActionClear",
					keyUp: ".key-row .key-focus",
					keyRight: this.rightKeyQuery || ("#" + this.id + "ActionEnter"),
					keyDown: "#" + this.id + "ActionEnter"
				} 
			}]
	});	

	dom.on(".key", "focus", function(event) {
		dom.data("#" + self.id, "lastFocus", this.id);
	});

	dom.on(".key", "click", function(event) {
		self.focus(this);
	});

	dom.on(".key", "keydown", function(event) {
		switch (event.which) {
			case self.KEY_LEFT: 
				self.focus(dom.data(this, "keyLeft"));
				break;
			case self.KEY_UP: 
				self.focus(dom.data(this, "keyUp"));
				break;
			case self.KEY_RIGHT: 
				self.focus(dom.data(this, "keyRight"));
				break;
			case self.KEY_DOWN: 
				self.focus(dom.data(this, "keyDown"));
				break;					
			case keys.KEY_OK: 
				event.target.click();
				break;															
		}
	});

	dom.on(".key-item", "click", function(event) {
		if (self.press) {
			self.press(dom.data(this, "key"), event);
		}		
		dom.dispatchCustonEvent(this, "pressed", {key: dom.data(this, "key")});
	});
	
	dom.on(".key-action-item", "click", function(event) {
		if (self[dom.data(this, "ref")]) {
			self[dom.data(this, "ref")](event);
		}
		dom.dispatchCustonEvent(this, "pressed", {key: dom.data(this, "key")});
	});
		
	dom.on(".key-set-select-item", "click", function(event) {
		dom.removeClass(".key-set-select-item", "key-set-active");
		dom.addClass(this, "key-set-active");
		dom.hide(".key-set");
		dom.show("#" + this.id + "Set");
		self.focus(".key-set:not([style*='display: none']) .key", false);
	});		
};

KEYS.prototype.focus = function(query, focus) {	
	var node;
	
	query = query || ".key-set:not([style*='display: none']) .key";
	
	if (typeof focus === 'undefined') {
		focus = true;
	} else {
		focus = false;
	}
	
	if (focus) {
		node = dom.focus(query);
	} else {
		node = dom.querySelector(query);
	}
	
	var parentClassName = node.parentNode.className;

	if (parentClassName) {
		dom.removeClass("." + parentClassName + " .key-focus", "key-focus");
		dom.addClass(node, "key-focus");	
	}		
};

KEYS.prototype.close = function() {
	if (this.closeKeys) {
		this.closeKeys();
	}	
	dom.hide("#" + this.id);
	dom.remove("#" + this.id);	
};

KEYS.prototype.addKeySet = function(query, id, show) {
	var self = this;
	var column = 0;
	var rows = Math.ceil(this.settings[id.toLowerCase()].length / self.settings.columns);
	var setId = this.id + "Select" + id + "Set";
	
	show = show || false;
		
	dom.append(query, {
		nodeName: "div",
		id: setId,
		className: "key-set",
		style: {display: show ? "" : "none"}
	});	
				
	this.settings[id.toLowerCase()].forEach(function(item, index) {
		var row = Math.floor(index / self.settings.columns);
		
		if (((index) % self.settings.columns) == 0 || index == 0) {
			column = 0;	
						
			dom.append("#" + setId, {
				nodeName: "div",
				id: self.id + id + "Row" + row,
				className: "key-row"				
			}); 	
		}

		dom.append("#" + self.id + id + "Row" + row, {
			nodeName: "a",
			href: "#",
			id: setId + "_" +  row + "_" + column,
			dataset: {
				"key": encodeURI(item),
				keyLeft: column == 0 ? "#" + setId + "_" +  row + "_" + column : "#" + setId+ "_" +  row + "_" + (column - 1),
				keyRight: column == self.settings.columns - 1 ? self.rightKeyQuery || ("#" + setId + "_" +  row + "_" + column) : "#" + setId + "_" +  row + "_" + (column + 1),
				keyUp: row == 0 ? ".key-set-active" : "#" + setId + "_" +  (row - 1) + "_" + column,
				keyDown: row == (rows - 1) ? ".key-actions .key-focus" : "#" + setId + "_" +  (row + 1) + "_" + column
			},
			className: "key-item key key-" + id.toLowerCase() + (item.length > 1 ? " key-item-word" : ""),
			text: item.substring(0, 5)
		});	
		
		column++;	
	});	
};