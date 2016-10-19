// Author: Simon J. Hogan
// Modifed: 24/04/2016
// Sith'ari Consulting Australia
// --------------------------------------------

var caret = new CARET();

function CARET() {};

CARET.prototype.position = function(query, position)
{
	var target = dom.querySelector(query);
	
	if (arguments.length == 1) {
		if (window.getSelection) {
			return target.selectionStart;
		}
		return 0;
	} else {
		target.setSelectionRange(position, position);
	}
};