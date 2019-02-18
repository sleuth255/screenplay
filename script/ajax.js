// Author: Simon J. Hogan
// Modifed: 24/04/2016
// Sith'ari Consulting Australia
// --------------------------------------------

var ajax = new AJAX();

function AJAX() {};

AJAX.prototype.request = function(url, settings) {
	var method = (settings.method) ? settings.method : "GET";
	var xhr = new XMLHttpRequest();
	
	xhr.open(method, url);
	
	if (settings.headers) {
		for (var h in settings.headers) {
			if (settings.headers.hasOwnProperty(h)) {
				xhr.setRequestHeader(h, settings.headers[h]);
			}	
		}
	} 
	
	if (settings.timeout) {
		xhr.timeout = settings.timeout;
	}
	
	xhr.ontimeout = function (event) {
		if (settings.error) {
			settings.error({error: "timeout"});
		}			
	}

	xhr.onerror = function (event) {
		if (settings.error) {
			settings.error({error: event.target.status});
		}			
	}
	
	xhr.onreadystatechange = function () {
		if (xhr.readyState == 4) 
			if (xhr.status == 200) 
				settings.success(JSON.parse(xhr.responseText));
			else 
			if (xhr.status == 204)
//				settings.success = {success: true}
			    settings.success({success: true})
			else	
			if (settings.error) 
				settings.error({error: true});

	}
	
	if (settings.data) {
		xhr.send(JSON.stringify(settings.data));
	} else {
		xhr.send();
	} 
};
