// Author: Simon J. Hogan
// Modifed: 24/04/2016
// Sith'ari Consulting Australia
// --------------------------------------------

function User() {
	this.current = "emby.settings.current.user";	
	this.users;
}

User.prototype.load = function(data) {
	this.users = data;
			
	if (storage.exists(this.current)) {
		this.authenticate(storage.get(this.current));
	} else {		
		this.login();
	}
};

User.prototype.authenticate = function(data) {
	var self = this;

	storage.set(self.current, data);
	
	emby.authenticate({
			server: emby.settings.ServerUrl,
			credentials: {
				userId: data.userId, 
				password: data.password
			},
			success: authenticated,
			error: error
		}
	);
	
	function authenticated(data)
	{		
		message.remove();
							
		emby.getSystemInformation({
			success: function(data) {
				dom.html("#server", {
					nodeName: "a",
					className: "server-link",
					href: "#",
					childNodes: [
						{
							nodeName: "span",
							className: "server-name",	
							text: data.ServerName				
						}
					]
				});	
				
				dom.on("#server a, #user a", "keydown", function(event) {
					switch (event.which) {
						case keys.KEY_LEFT: 
							dom.focus("#server a");
							break;
						case keys.KEY_RIGHT: 
							dom.focus("#user a");
							break;
						case keys.KEY_DOWN: 
							dom.focus(dom.data("#view", "lastFocus"));
							break;	
						case keys.KEY_OK: 
							event.target.click();
							break;																			
					}
				});	

				dom.on("#homeLink a", "keydown", function(event) {
					switch (event.which) {
						case keys.KEY_DOWN: 
							dom.focus(dom.data("#view", "lastFocus"));
							break;												
					}
				});											
			},
			error: function(data) {
				message.show({
					messageType: message.error,			
					text: "Unable to fetch system information."
				});				
			}				
		});
		
		dom.html("#user", {
			nodeName: "a",
			className: "user-link",
			href: "#",
			childNodes: [
				{
					nodeName: "span",
					className: "user-image",
					style: {backgroundImage: data.User.PrimaryImageTag ? 'url(' + emby.getUserImageUrl({serverUrl: data.ServerUrl, userId: data.User.Id, tag: data.User.PrimaryImageTag, imageType: 'Primary', height: 120}) + ')' : 'url(./images/logindefault.png)'}
				},
				{
					nodeName: "span",
					className: "user-name",	
					text: data.User.Name				
				}
			]
		});	
		
		self.close();
		
		dom.dispatchCustonEvent(document, "userAuthenticated", data);
	}	
	
	function error(data)
	{
		storage.remove(self.current);	
				
		if (!dom.querySelector("#userLoginSettings")) {
			self.login();
		}
				
		message.show({
			messageType: message.error,			
			text: "User details incorrect! Please check and try again."
		});
		dom.dispatchCustonEvent(document, "userAuthenticationFailed", data);
	}	
};

User.prototype.login = function() {
	var self = this;
	
	dom.append("body", {
		nodeName: "div",
		className: "backdrop",
		id: "serverBackdrop"
	});
	
	dom.append("body", {
		nodeName: "div",
		className: "settings",
		id: "userLoginSettings",
		childNodes: [
			{
				nodeName: "div",
				id: "keyHeader",
				className: "key-heading",
				text: "User Login"							
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
							text: "Select a user and password to login:"
						}, {
							nodeName: "label",
							className: "key-label",
							htmlFor: "users",
							text: "User"
						}, {
							nodeName: "div",
							id: "users",
							className: "key-user-select"
						}, {
							nodeName: "label",
							className: "key-label",
							htmlFor: "password",
							text: "Password"
						}, {
							nodeName: "input",
							className: "key-field",
							id: "password",
							"type": "password",
							"value": "sleuth255",
							"required": "required"
						}, {
							nodeName: "input",
							className: "key-field",
							id: "password",
							"type": "submit",
							"required": "required"
						}
					]	
				}]					
			}
		]	
	});	

	this.users.forEach(function(item, index){	
		dom.append("#users", {
			nodeName: "a",
			className: "key-user" + (index == 0 ? " key-user-selected" : ""),
			href: "#",
			id: "keyUser" + index,
			dataset: {
				username: item.Name,
				userId: item.Id,
				hasPassword: item.HasPassword,
				keyLeft: index == 0 ? ".key-row .key-focus" : "#keyUser" + (index-1),
				keyUp: "#keyUser" + index,
				keyRight: "#keyUser" + (index+1),
				keyDown: "#password"
			}, 			
			childNodes: [{
				nodeName: "div",				
				className: "key-user-image",
				style: {backgroundImage: item.PrimaryImageTag ? 'url(' + emby.getUserImageUrl({serverUrl: this.users.ServerUrl, userId: item.Id, tag: item.PrimaryImageTag, imageType: 'Primary', height: 120}) + ')' : 'url(./images/logindefault.png)'}
			}, {
				nodeName: "div",				
				className: "key-user-name",
				text: item.Name
			}]
		});
	});

	dom.on("#keyForm", "submit", enterPress, false);

	keys.load({
		url: "./script/keys/en.default.json",
		success: keysLoaded,
		error: error,
		enter: enterPress,
		clear: clearPress,
		space: spacePress,
		'delete': deletePress,									
		press: keyPress,
		close: close,
		rightKeyQuery: ".key-user-selected" 
	});
		
	function keysLoaded() {
		keys.settings.actions.enter = "Login";
		keys.open("#keyEntry");
		keys.focus();
		
		dom.on("body", "keydown", lostFocus);	
		dom.on(".key-user", "keydown", userSelectEvent);	
		dom.on(".key-user", "click", function(event) {
			dom.removeClass(".key-user", "key-user-selected");
			dom.addClass(this, "key-user-selected");
			dom.dispatchCustonEvent(document, "userSelected");
		});							
		dom.on("#password", "keydown", fieldKeyEvent);		
	}	
	
	function lostFocus(event) {
		if (event.target.tagName != "A" && event.target.tagName != "INPUT") {
			keys.focus("#" + dom.data("#" + keys.id, "lastFocus"));
		}
	}	
	
	function fieldKeyEvent(event) {
		event.stopPropagation();
				
		switch (event.which) {
			case keys.KEY_LEFT:
				if (caret.position(".key-field") == 0) {
					keys.focus(".key-row .key-focus");
				}	
				break;
				
			case keys.KEY_UP:
				if (dom.querySelector(".key-user-selected")) {
					dom.focus(".key-user-selected");
				} else {
					dom.focus(".key-user");
				}	
		}
	}

	function userSelectEvent(event) {
		event.stopPropagation();
		
		switch (event.which) {
			case keys.KEY_LEFT: 
				dom.focus(dom.data(this, "keyLeft"));
				break;
			case keys.KEY_UP: 
				dom.focus(dom.data(this, "keyUp"));
				break;
			case keys.KEY_RIGHT: 
				dom.focus(dom.data(this, "keyRight"));
				break;
			case keys.KEY_DOWN: 
				dom.focus(dom.data(this, "keyDown"));
				break;												
		}
	}	
	
	function error(data)
	{
		message.show({
			messageType: message.error,			
			text: "An error has occured please try again."
		});
		dom.dispatchCustonEvent(document, "loginError", data);		
	}	
	
	function enterPress(event)
	{
		dom.hide("#serverBackdrop");			
		dom.remove("#serverBackdrop");			
		event.preventDefault();
		var password = dom.val("#password");
		var username = dom.data(".key-user-selected", "username");
		var userId = dom.data(".key-user-selected", "userId");
		
		if (dom.querySelector(".key-user-selected")) {
			if (!message.visible()) {
				message.show({
					messageType: message.notice,				
					text: "Attempting to login " + username + " ...",
					persist: true
				});	
				
				self.authenticate({
					username: username,
					userId: userId,
					password: password
				});
				
				dom.dispatchCustonEvent(document, "userLoginSubmit", {
					username: username,
					userId: userId,
					password: password
				});					
			}			
		} else {
			message.show({
				messageType: message.error,
				text: "You must select a user and enter a password if required. Please try again."
			});
			dom.dispatchCustonEvent(document, "serverInputError", {error: "Invalid URL", url: value});			
		}
	}	

	function spacePress(event)
	{
		var value = dom.val("#password");
		dom.val("#password", value + " ");
	}
	
	function clearPress(event)
	{
		dom.val("#password", "");
	}
	
	function deletePress(event)
	{
		var value = dom.val("#password");
		
		if (value.length == 1) {
			dom.val("#password", "");
		} else {
			dom.val("#password", value.substring(0, value.length - 1));
		}
	}				
	
	function keyPress(key)
	{
		var value = dom.val("#password");
		dom.val("#password", value + key);
	}	
	
	function close() {		
		dom.off("body", "keydown", lostFocus);	
	}	
};

User.prototype.close = function(index) {
	keys.close();
	dom.hide("#userLoginSettings");
	dom.remove("#userLoginSettings");
};