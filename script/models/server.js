// Author: Simon J. Hogan
// Modifed: 24/04/2016
// Sith'ari Consulting Australia
// --------------------------------------------

function Server() {
	this.settings = "emby.settings.servers";
	this.current = "emby.settings.current.server";	
	this.servers = new Array;
};

Server.prototype.load = function() {
	if (storage.exists(this.current)) {
		this.open(storage.get(this.current));
	} else {
		this.add();
	}	
};

Server.prototype.open = function(url, add) {
	var self = this;
		
	emby.getPublicUsers({
			server: url,
			success: success,
			error: error
		}
	);
	
	function success(data)
	{	
		dom.hide("#serverBackdrop");			
		dom.remove("#serverBackdrop");			
		emby.settings.ServerUrl = url;
		storage.set(self.current, url);
				
		if (add) {
			message.show({
				messageType: message.success,			
				text: "Server located ..."
			});		
			self.servers.push({"url": url});
			storage.set(self.settings, self.servers);		
			self.close();
		}
		
		dom.dispatchCustonEvent(document, "serverOpened", data);
	}	
	
	function error(data)
	{
		message.show({
			messageType: message.error,			
			text: "Server not found! Please check the server address is correct and try again."
		});
		if (!dom.exists("#serverSettings"))
		    dom.dispatchCustonEvent(document, "serverOpenFailed", data);
	}			
};

Server.prototype.remove = function(index) {
	
};

Server.prototype.add = function() {
	var self = this;
	
	dom.append("body", {
		nodeName: "div",
		className: "backdrop",
		id: "serverBackdrop"
	});
	
	dom.append("body", {
		nodeName: "div",
		className: "settings",
		id: "serverSettings",
		childNodes: [
			{
				nodeName: "div",
				id: "keyHeader",
				className: "key-heading",
				text: "Add Server"							
			}, {
				nodeName: "div",
				id: "keyEntry",
				className: "key-column"	
			}, {
				nodeName: "div",
				id: "keyFields",
				className: "key-column key-column-fields",	
				childNodes: [{
					nodeName: "form",
					id: "keyForm",
					className: "key-form",	
					method: "get",					
					childNodes: [
						{
							nodeName: "div",
							id: "keyInstructions",
							className: "key-instructions",
							text: "Enter your Emby server address and press <Enter>"
						}, {
							nodeName: "label",
							className: "key-label",
							htmlFor: "serverUrl",
							text: " "
						}, {
							nodeName: "input",
							className: "key-field",
							id: "serverUrl",
							"type": "text",
							"required": "required",
					        "placeholder": "                    Format: <ip address or FQDN>[:port]",
						}
					]	
				}]					
			}
		]	
	});	

	document.getElementById("serverUrl").focus();
//	dom.on("#keyForm", "submit", enterPress, false);
	dom.on("#serverUrl", "blur", function(event) {
		document.getElementById("serverUrl").focus();
	});
	dom.on("#serverUrl", "keydown", function(event) {
		event.preventDefault();
		event.stopPropagation();
		switch(event.which) {
		case keys.KEY_OK:
            enterPress(event);
			break;
		case keys.KEY_SPACE:
            spacePress(event);
			break;	
			
		case keys.KEY_BACKSPACE:
            deletePress(event);
			break;	
			
		default:				
			keyPress(event.key);
			break;
      }
		
	});
	
	function enterPress(event)
	{
		event.preventDefault();
		event.stopPropagation();
		
		var value = dom.val("#serverUrl");
		
		if (value.length > 0) {
			if (!message.visible()) {
				message.show({
					messageType: message.notice,				
					text: "Contacting "+ self.formatServerUrl(value) +"...",
					persist: true
				});					
				self.open(self.formatServerUrl(value), true);
			}
			dom.dispatchCustonEvent(document, "serverLocate", {url: self.formatServerUrl(value)});
		} else {
			message.show({
				messageType: message.error,
				text: "You must enter a valid server url. Please try again."
			});
			dom.dispatchCustonEvent(document, "serverInputError", {error: "Invalid URL", url: value});				
		}
	}	

	function spacePress(event)
	{
		var value = dom.val("#serverUrl");
		dom.val("#serverUrl", value + " ");
	}
	
	function clearPress(event)
	{
		dom.val("#serverUrl", "");
	}
	
	function deletePress(event)
	{
		var value = dom.val("#serverUrl");
		
		if (value.length == 1) {
			dom.val("#serverUrl", "");
		} else {
			dom.val("#serverUrl", value.substring(0, value.length - 1));
		}
	}				
	
	function keyPress(key)
	{
		if (key.length == 1){
			var value = dom.val("#serverUrl");
		    dom.val("#serverUrl", value + key);
		}
	}	
	
	function close() {		
		dom.off("body", "keydown", lostFocus);	
	}
};

Server.prototype.display = function() {
	
};

Server.prototype.close = function(index) {
	keys.close();
	dom.hide("#serverSettings");
	dom.remove("#serverSettings");
};

Server.prototype.formatServerUrl = function(url) {
	url = url.trim();
	url = url.replace(/\s+/g,'') // remove whitespace
	url = url.replace(/[^a-zA-Z0-9/:-]/g,'.') // change any specials to a dot
	
	if ((!url.includes("http://")) && (!url.includes("https://"))) 
		url = "http://" + url;
	
	
	if (!url.substr(6).includes(":"))
		if (url.includes("http://"))			
			url = url + ":8096";
		else
		if (url.includes("https://"))	
			url = url + ":8920";
	
	
	return url;
};