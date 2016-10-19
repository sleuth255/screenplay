// Author: Simon J. Hogan
// Modifed: 24/04/2016
// Sith'ari Consulting Australia
// --------------------------------------------

var dom = new DOM();

function DOM() {};

DOM.prototype.create = function(element) {	
	if (typeof element.nodeName == 'undefined') {
		return;
	}
	var node = document.createElement(element.nodeName);
	
	for (var property in element) {
		if (element.hasOwnProperty(property)) {
			switch (property) {
				case "nodeName":
					break;	
							
				case "text":
					var textNode = document.createTextNode(element[property]);
					node.appendChild(textNode);
					break; 
						
				case "childNodes":
					if (Array.isArray(element[property])) {
						for (var i = 0; i < element[property].length; i++) {
							var childNode = this.create(element[property][i])
							if (childNode) {
								node.appendChild(childNode);
							}	
						}
					}
					break;
					
				case "dataset":
					var dataset = element[property];
					for (var item in dataset) {
						if (element[property].hasOwnProperty(item)) {
							node.dataset[item] = dataset[item];	
						}
					}
					break;

				case "style":
					var style = element[property];
					for (var item in style) {
						if (element[property].hasOwnProperty(item)) {
							node.style[item] = style[item];	
						}
					}
					break;
							
				default: 
					node[property] = element[property]; 
					break;
			}
		}

	}
	return node;	
};

DOM.prototype.append = function(query, element) {
	var parentNodes = this.querySelectorAll(query);
	
	if (typeof element == "string") {
		for (var i = 0; i < parentNodes.length; i++) {
			parentNodes[i].innerHTML += element;
		}		
	} else {	
		for (var i = 0; i < parentNodes.length; i++) {
			var node = this.create(element);
			parentNodes[i].appendChild(node);
		}
	}	
};

DOM.prototype.prepend = function(query, element) {
	var parentNodes = this.querySelectorAll(query);
	
	if (typeof element == "string") {
		for (var i = 0; i < parentNodes.length; i++) {
			parentNodes[i].innerHTML = element + parentNodes[i].innerHTML;
		}			
	} else {	
		for (var i = 0; i < parentNodes.length; i++) {
			var node = this.create(element);	
			parentNodes[i].insertBefore(node, parentNodes[i].firstChild);
		}
	}	
};

DOM.prototype.html = function(query, element) {
	var parentNodes = this.querySelectorAll(query);
	
	if (typeof element == "string") {
		for (var i = 0; i < parentNodes.length; i++) {
			parentNodes[i].innerHTML = element;
		}		
	} else {	
		for (var i = 0; i < parentNodes.length; i++) {
			var node = this.create(element);
			while (parentNodes[i].firstChild) {
				parentNodes[i].removeChild(parentNodes[i].firstChild);
			}
			parentNodes[i].appendChild(node);
		}
	}	
};

DOM.prototype.remove = function(query) {
	var nodes = this.querySelectorAll(query);	
	
	for (var i = 0; i < nodes.length; i++) {
		nodes[i].parentNode.removeChild(nodes[i]);
	}	
};

DOM.prototype.empty = function(query) {
	var parentNodes = this.querySelectorAll(query);	
	
	for (var i = 0; i < parentNodes.length; i++) {
		while (parentNodes[i].hasChildNodes()) {   
			for (var j = parentNodes[i].childNodes.length - 1; j >= 0; j--) {
				parentNodes[i].removeChild(parentNodes[i].childNodes[j]);				
			}
		}
	}
};

DOM.prototype.show = function(query) {
	var nodes = this.querySelectorAll(query);	
	
	for (var i = 0; i < nodes.length; i++) {
		nodes[i].style.display = "block";
	}
};

DOM.prototype.hide = function(query) {
	var nodes = this.querySelectorAll(query);	
		
	for (var i = 0; i < nodes.length; i++) {
		nodes[i].style.display = "none";		
	}	
};

DOM.prototype.fadeIn = function(query, duration, complete) {
	var node = this.querySelector(query);	
	duration = duration || 2000;
	
	var opacity = 0;
	var interval = 50;
	var gap = interval / duration;
	
	node.style.display = 'block';
	node.style.opacity = opacity;
	
	function fade() { 
		opacity += gap;
		node.style.opacity = opacity;
		
		if(opacity >= 1) {
			window.clearInterval(fading);
		}
	}
	
	var fading = window.setInterval(fade, interval);
};

DOM.prototype.fadeOut = function(query, duration, complete) {
	var node = this.querySelector(query);	
	duration = duration || 2000;
	var opacity = 1;
	var interval = 50;
	var gap = interval / duration;

	function fade() { 
		opacity -= gap;
		node.style.opacity = opacity;
		
		if(opacity <= 0) {
			window.clearInterval(fading); 
			node.style.display = 'none';
			if (complete) {
				complete();
			}
		}
	}

	var fading = window.setInterval(fade, interval);	
};

DOM.prototype.addClass = function(query, className) {
	var nodes = this.querySelectorAll(query);	
		
	for (var i = 0; i < nodes.length; i++) {
		nodes[i].classList.add(className);		
	}	
};

DOM.prototype.removeClass = function(query, className) {
	var nodes = this.querySelectorAll(query);	
		
	for (var i = 0; i < nodes.length; i++) {
		nodes[i].classList.remove(className);		
	}	
};

DOM.prototype.hasClass = function(query, className) {
	var node = this.querySelector(query);
	if (node) {		
    	return node.className && new RegExp("(^|\\s)" + className + "(\\s|$)").test(node.className);
	} else {
		return false;
	}
};

DOM.prototype.on = function(query, name, eventHandler, useCapture) {
	var nodes = this.querySelectorAll(query);	
	useCapture = useCapture || false;
		
	for (var i = 0; i < nodes.length; i++) {
		nodes[i].addEventListener(name, eventHandler, useCapture);		
	}	
	
	return eventHandler;
};

DOM.prototype.off = function(query, name, eventHandler, useCapture) {
	var nodes = this.querySelectorAll(query);	
	useCapture = useCapture || false;
			
	for (var i = 0; i < nodes.length; i++) {
		nodes[i].removeEventListener(name, eventHandler, useCapture);			
	}	
};

DOM.prototype.delegate = function(parentQuery, query, name, eventHandler, useCapture) {
	var self = this;
	var nodes = this.querySelectorAll(parentQuery);	
	useCapture = useCapture || false;

	var delegate = function(delegateEventHandler) {
		return function(event) {
			var node = event.target;
			do {
				if (!self.matchesSelector(node, query)) continue;
				event.delegateTarget = node;
				delegateEventHandler.apply(this, arguments);
				return;
			} while((node = node.parentNode));	
		};	
	};
		
	for (var i = 0; i < nodes.length; i++) {
		nodes[i].addEventListener(name, delegate(eventHandler), useCapture);		
	}	
	
	return eventHandler;
};

DOM.prototype.css = function(query, style) {	
	var nodes = this.querySelectorAll(query);	
			
	for (var i = 0; i < nodes.length; i++) {
		for (var s in style) {
			if (style.hasOwnProperty(s)) {
				nodes[i].style[s] = style[s];
			}
		}	
	}		
};

DOM.prototype.height = function(query) {	
	var node = this.querySelector(query);	
	if (node) {
		return node.clientHeight;
	}
	return 0;
};

DOM.prototype.width = function(query) {	
	var node = this.querySelector(query);	
	if (node) {
		return node.clientWidth;
	}
	return 0;
};

DOM.prototype.offset = function(query) {
	var node = this.querySelector(query);	
	if (node) {
		var x = 0;
		var y = 0;
		while (node && !isNaN(node.offsetLeft ) && !isNaN(node.offsetTop)) {
			x += node.offsetLeft - node.scrollLeft;
			y += node.offsetTop - node.scrollTop;
			node = node.offsetParent;
		}
		return {top: y, left: x};
	}
	return {top: 0, left: 0};
}

DOM.prototype.focus = function(query) {	
	if (query) {
		var node = this.querySelector(query);	
		if (node) {		
			var view = this.querySelector("#view");
			var rect = node.getBoundingClientRect();
			if (rect.left < 0)
			{	
			  	view.scrollLeft-= (rect.left*-1) + 5;
			}
			else
			if (rect.right > window.innerWidth)
			{
			   	view.scrollLeft += (rect.right - window.innerWidth + 5);
			}
			node.focus();
			return node;
		}
		var elmnt = this.querySelector("#viewItem_0_0");
		if (elmnt) // homescreen only
		{
			this.querySelector("#view").scrollLeft = 0;
		    elmnt.focus();
		}
	}
	return null;
};

DOM.prototype.data = function(query, name, value) {	
	var node = this.querySelector(query);	
	
	if (node) {	
		if (typeof value === 'undefined') {
				return node.dataset[name];
		} else {
			node.dataset[name] = value;
		}
	}
};

DOM.prototype.exists = function(query) {	
	var node = this.querySelector(query);				
	if (node) {
		return true;
	}	
	return false;
};

DOM.prototype.querySelector = function(query) {	
	var node; 
	
	if (query) {	
		if (query.nodeType) {
			node = query;
		} else {
			if (query.charAt(0) == "#" && query.indexOf(" ") == -1) {
			 	node = document.getElementById(query.substring(1));	
			} else if (query.charAt(0) == "." && query.indexOf(" ") == -1) {
				var nodes = document.getElementsByClassName(query.substring(1));
				if (nodes.length > 0) {
					node = nodes[0];
				}	
			} else {					
				node = document.querySelector(query);		
			}
		}
	}
	return node;	
};

DOM.prototype.querySelectorAll = function(query) {	
	var nodes = [];
		
	if (query.nodeType) {
		nodes = [query];
	} else {
		if (query.charAt(0) == "#" && query.indexOf(" ") == -1) {
			var n = document.getElementById(query.substring(1));
			if (n) {
				nodes = [n];
			}	
		} else if (query.charAt(0) == "." && query.indexOf(" ") == -1) {
			nodes = document.getElementsByClassName(query.substring(1));
		} else {
			nodes = document.querySelectorAll(query);
		}	
	}	
	
	return nodes;	
};

DOM.prototype.matchesSelector = function(node, query) {	
	if (node.matches) {
		return node.matches(query);
	} else if (node.matchesSelector) {
		return node.matchesSelector(query);
	} else {
		var matches = this.querySelectorAll(query);
		var i = 0;
		
		while (matches[i] && matches[i] !== node) {
			i++;
		}
		
		return matches[i] ? true : false;
	}
};

DOM.prototype.dispatchCustonEvent = function(query, name, detail, bubbles, cancelable) {	
	var node = this.querySelector(query);	
	
	if (typeof bubbles === 'undefined') {
		bubbles = true;
	} 

	if (typeof cancelable === 'undefined') {
		cancelable = true;
	} 
		
	var event = new CustomEvent(name, {
		'detail': detail,
		'bubbles': bubbles,
		'cancelable': cancelable 
	});
	
	node.dispatchEvent(event);
};

DOM.prototype.val = function(query, value) {	
	var node = this.querySelector(query);	
	
	if (typeof value === 'undefined') {
		return node.value;
	} else {
		node.value = value;
	}
};

DOM.prototype.submit = function(query) {	
	var node = this.querySelector(query);	
	
	node.submit();
};

//polyfill for string includes
if (!String.prototype.includes) {
  String.prototype.includes = function() {
    return String.prototype.indexOf.apply(this, arguments) !== -1;
  };
}

//polyfill for custom event
try {
  new CustomEvent("test");
} catch(e) {
 var CustomEvent = function(event, params) {
      var evt;
      params = params || {
          bubbles: false,
          cancelable: false,
          detail: undefined
      };

      evt = document.createEvent("CustomEvent");
      evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
      return evt;
  };

  CustomEvent.prototype = window.Event.prototype;
  window.CustomEvent = CustomEvent; // expose definition to window
}
