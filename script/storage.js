// Author: Simon J. Hogan
// Modifed: 24/04/2016
// Sith'ari Consulting Australia
// --------------------------------------------

var storage = new STORAGE();

function STORAGE() {};

STORAGE.prototype.get = function(name, isJSON) {	
	if (isJSON === undefined) {
		isJSON = true;	
	}
	
	if (localStorage) {
		if (localStorage.getItem(name)) {
			if (isJSON) {
				return JSON.parse(localStorage.getItem(name));
			} else {
				return localStorage.getItem(name);
			}
		}
	}
};

STORAGE.prototype.set = function(name, data, isJSON) {
	if (isJSON === undefined) {
		isJSON = true;	
	}
	
	if (localStorage) {
		if (isJSON) {
			localStorage.setItem(name, JSON.stringify(data));
		} else {
			localStorage.setItem(name, data);
		}
	}
	
	return data;
};

STORAGE.prototype.remove = function(name) {
	if (localStorage) {
		localStorage.removeItem(name);	
	}	
};

STORAGE.prototype.exists = function(name) {
	if (localStorage) {
		if (localStorage.getItem(name)) {
			return true;
		} 
	}	
	return false;
};