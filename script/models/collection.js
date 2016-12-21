// Author: Simon J. Hogan
// Modifed: 24/04/2016
// Sith'ari Consulting Australia
// --------------------------------------------

function Collection() {
	this.backdrops;
	
	this.startIndex;
	this.currentIndex;
	this.limit;
	this.scroll;
	this.totalRecordCount;
	
	this.id;
	this.parentId;
	this.parent;
	this.data;
	this.lostfocus;
};

Collection.prototype.close = function() {
	dom.remove("#collectionIndex");
	dom.off("#view", "scroll", this.scroll);
	dom.off("body","keydown", this.lostfocus);
};

Collection.prototype.load = function(data, settings) {
	data = data || {};	
	settings = settings || {};
	
	var self = this;
	this.backdrops = new Array();
	this.limit = settings.limit || 50;
	this.startIndex = 0;
	
	var scrollLeft = 0;	
	var columnLast = 0;
	var columnWidth = 0;
	var columnLimit = Math.floor(this.limit / 2);
	var menuWidth = 0;	
	var columnViewportCount = 0;
	var indexCurrent = "";
	
	this.id = guid.create();
	var token = guid.create();	
	this.parentId = data.id;
	this.parent = {collectionType: data.collectionType, name: data.name, imageTag: data.imageTag};
	this.data = data;	
		
	dom.hide("#server");
	dom.hide("#user");
	dom.show("#details")
	dom.show("#homeLink");
	
	self.close();

	dom.html("#view", {
		nodeName: "div",
		className: "collection-view",
		id: "collection",
		childNodes: [{
			nodeName: "div",
			className: "user-views-column",
			id: "userViews_0"
		}]
	});	
	
	dom.append("body", {
		nodeName: "div",
		id: "collectionIndex",
		className: "collection-index",
		dataset: {lastFocus: "#index-1"},
		childNodes: [{
			nodeName: "a",
			id: "index-1",
			className: "index-item",
			text: "#",
			href: "#",
			dataset: {
				index: "sym"
			}
		}, {
			nodeName: "a",
			id: "index-2",			
			className: "index-item",
			text: "A",
			href: "#",
			dataset: {
				index: "A"
			}
		}, {
			nodeName: "a",
			id: "index-3",
			className: "index-item",
			text: "B",
			href: "#",
			dataset: {			
				index: "B"
			}
		}, {
			nodeName: "a",
			id: "index-4",
			className: "index-item",
			text: "C",
			href: "#",
			dataset: {				
				index: "C"
			}
		}, {
			nodeName: "a",
			id: "index-5",
			className: "index-item",
			text: "D",
			href: "#",
			dataset: {				
				index: "D"
			}
		}, {
			nodeName: "a",
			id: "index-6",
			className: "index-item",
			text: "E",
			href: "#",
			dataset: {				
				index: "E"
			}
		}, {
			nodeName: "a",
			id: "index-7",
			className: "index-item",
			text: "F",
			href: "#",
			dataset: {				
				index: "F"
			}
		}, {
			nodeName: "a",
			id: "index-8",
			className: "index-item",
			text: "G",
			href: "#",
			dataset: {				
				index: "G"
			}
		}, {
			nodeName: "a",
			id: "index-9",
			className: "index-item",
			text: "H",
			href: "#",
			dataset: {				
				index: "H"
			}
		}, {
			nodeName: "a",
			id: "index-10",
			className: "index-item",
			text: "I",
			href: "#",
			dataset: {				
				index: "I"
			}
		}, {
			nodeName: "a",
			id: "index-11",
			className: "index-item",
			text: "J",
			href: "#",
			dataset: {					
				index: "J"
			}
		}, {
			nodeName: "a",
			id: "index-12",
			className: "index-item",
			text: "K",
			href: "#",
			dataset: {				
				index: "K"
			}
		}, {
			nodeName: "a",
			id: "index-13",
			className: "index-item",
			text: "L",
			href: "#",
			dataset: {				
				index: "L"
			}
		}, {
			nodeName: "a",
			id: "index-14",
			className: "index-item",
			text: "M",
			href: "#",
			dataset: {
				index: "M"
			}
		}, {
			nodeName: "a",
			id: "index-15",
			className: "index-item",
			text: "N",
			href: "#",
			dataset: {
				index: "N"
			}
		}, {
			nodeName: "a",
			id: "index-16",
			className: "index-item",
			text: "O",
			href: "#",
			dataset: {
				index: "O"
			}
		}, {
			nodeName: "a",
			id: "index-17",
			className: "index-item",
			text: "P",
			href: "#",
			dataset: {
				index: "P"
			}
		}, {
			nodeName: "a",
			id: "index-18",
			className: "index-item",
			text: "Q",
			href: "#",
			dataset: {
				index: "Q"
			}
		}, {
			nodeName: "a",
			id: "index-19",
			className: "index-item",
			text: "R",
			href: "#",
			dataset: {
				index: "R"
			}
		}, {
			nodeName: "a",
			id: "index-20",
			className: "index-item",
			text: "S",
			href: "#",
			dataset: {
				index: "S"
			}
		}, {
			nodeName: "a",
			id: "index-21",
			className: "index-item",
			text: "T",
			href: "#",
			dataset: {
				index: "T"
			}
		}, {
			nodeName: "a",
			id: "index-22",
			className: "index-item",
			text: "U",
			href: "#",
			dataset: {
				index: "U"
			}
		}, {
			nodeName: "a",
			id: "index-23",
			className: "index-item",
			text: "V",
			href: "#",
			dataset: {
				index: "V"
			}
		}, {
			nodeName: "a",
			id: "index-24",
			className: "index-item",
			text: "W",
			href: "#",
			dataset: {
				index: "W"
			}
		}, {
			nodeName: "a",
			id: "index-25",
			className: "index-item",
			text: "X",
			href: "#",
			dataset: {
				index: "X"
			}
		}, {
			nodeName: "a",
			id: "index-26",
			className: "index-item",
			text: "Y",
			href: "#",
			dataset: {
				index: "Y"
			}
		}, {
			nodeName: "a",
			id: "index-27",
			className: "index-item",
			text: "Z",
			href: "#",
			dataset: {
				index: "Z"
			}
		}]
	})
	
	this.lostfocus = dom.on("body", "keydown", lostFocus);
	this.scroll = dom.on("#view", "scroll", scrolling);
			
	dom.delegate("#collection", "a.latest-item", "click", function(event) {
		event.stopPropagation()
		event.preventDefault()
		dom.dispatchCustonEvent(document, "mediaItemSelected", event.delegateTarget.dataset);
	});	

	dom.delegate("#collection", "a.latest-items-more", "click", function(event) {
		event.stopPropagation()
		event.preventDefault()
		dom.dispatchCustonEvent(document, "userViewMoreSelected", event.delegateTarget.dataset);
	});	

	dom.delegate("#collection", "a", "keydown", navigation);
	
	dom.on("#collectionIndex a", "click", scrollToIndex);
	
	dom.on("#collectionIndex a", "keyup", scrollToIndex);
	
	dom.on("#collectionIndex a", "keydown", indexNavigation);
		
	emby.getUserItems({
		enableImageTypes: "Primary,Thumb,Backdrop",	
		includeItemTypes: "movie,photoalbum,musicartist,series",	
		sortBy: 'sortname',
		sortOrder: 'ascending',	
		startIndex: this.startIndex,		
		limit: this.limit,
		parentId: this.parentId,
		parent: this.parent,	
		label: this.data.name,	
		success: displayAllUserItems,
		error: error				
	});
				
	function displayAllUserItems(data) {	
		self.totalRecordCount = data.TotalRecordCount;
						
		if (data.Items.length > 0) {					
			data.Items.forEach(function(item, index) {						
				if (item.BackdropImageTags[0]) {
					self.backdrops.push(item.Id + ":" + item.BackdropImageTags[0]);
				}	
			});
	
			if (self.backdrops.length > 0) {
				var index = Math.floor((Math.random() * self.backdrops.length))
				var backdrop = self.backdrops[index].split(":");
				
				dom.css("#poster", {
					backgroundImage: "url(" + emby.getImageUrl({'itemId': backdrop[0], tag: backdrop[1], imageType: 'Backdrop', height: 1080}) + ")"
				});
			}
			
			renderer.userAllItems(data, {
				container: "#collection",
				id: self.id,
				token: token,
				heading: data.label,
				headerLink: "#homeLink a",
				initialise: true
			});		
	
			var node = dom.querySelector(".latest-items");
			menuWidth = dom.offset(node).left;						
			columnWidth = dom.width(".latest-items-column-abs");
			columnViewportCount = Math.floor(dom.width("#view") / columnWidth);
//			dom.dispatchCustonEvent(document, "collectionAllItemsInitialised");	
		}
		focus(".latest-item");
	}

	function displayAllUserItemsNext(data) {
		self.backdrops.length = 0;
								
		if (data.Items.length > 0) {
			data.Items.forEach(function(item, index) {						
				if (item.BackdropImageTags[0]) {
					self.backdrops.push(item.Id + ":" + item.BackdropImageTags[0]);
				}	
			});
	
			if (self.backdrops.length > 0) {
				var index = Math.floor((Math.random() * self.backdrops.length))
				var backdrop = self.backdrops[index].split(":");
				
				dom.css("#poster", {
					backgroundImage: "url(" + emby.getImageUrl({'itemId': backdrop[0], tag: backdrop[1], imageType: 'Backdrop', height: 1080}) + ")"
				});
			}
			
			renderer.userAllItems(data, {
				container: "#collection",
				id: self.id,
				heading: data.label,
				headerLink: "#homeLink a",
				initialise: false
			});		
		}
	}
	
	function lostFocus(event) {
		if (dom.exists("#screenplaySettings") || dom.exists("#player"))
			return;
		if (event.target.tagName != "A") {
			dom.focus(dom.data("#view", "lastFocus"));
		}
	}

	function navigation(event) {
		event.preventDefault();
		var self = event.delegateTarget;

		if (event.which == keys.KEY_OK) {
			event.stopPropagation();
			self.click();
			return;
		}
				
		if (dom.hasClass(self, "user-views-item")) {	
			switch (event.which) {
				case keys.KEY_LEFT: 
					focus(dom.data(self, "keyLeft"));
					break;
				case keys.KEY_UP: 
					focus(dom.data(self, "keyUp"));
					break;
				case keys.KEY_RIGHT: 
					focus(".column-0 a");
					break;
				case keys.KEY_DOWN: 
					var down = dom.data(self, "keyDown");
					focus(down == "%index%" ? dom.data("#collectionIndex", "lastFocus") : down);
					break;											
			}
		}
		
		if (dom.hasClass(self, "latest-item")) {	
			var columnSetIndex = this.parentNode.parentNode.id ? parseInt(self.parentNode.parentNode.id.substr(self.parentNode.parentNode.id.lastIndexOf("_") + 1)) : 0;
			var lastColumn = columnSetIndex > 0 ? dom.data("#latestItemSet_" + (columnSetIndex - 1), "lastColumn") : "";

			switch (event.which) {
				case keys.KEY_LEFT: 
					focus(dom.data(self, "keyLeft").replace("%previous%", columnSetIndex > 0 ? "#latestItemSet_" + (columnSetIndex - 1) +  " .latest-items-column-" + lastColumn + " a" : ".user-views .user-views-column:last-child a"));
					break;
				case keys.KEY_UP: 
					focus(dom.data(self, "keyUp"));
					break;
				case keys.KEY_RIGHT: 
					focus(dom.data(self, "keyRight").replace("%next%", "#latestItemSet_" + (columnSetIndex + 1) +  " .latest-items-column a"));
					break;
				case keys.KEY_DOWN: 
					var down = dom.data(self, "keyDown");
					focus(down == "%index%" ? dom.data("#collectionIndex", "lastFocus") : down);
					break;																	
			}
		}		
	}

	function indexNavigation(event) {
		event.preventDefault();
		//event.stopPropagation();
				
		if (event.which == keys.KEY_OK) {
			this.click();
			return;
		}
				
		var index = Number(this.id.substr(6));
	
		switch (event.which) {
			case keys.KEY_LEFT: 
				indexFocus("#index-" + (index-1));
				break;
			case keys.KEY_UP: 
				collectionFocus();
				break;
			case keys.KEY_RIGHT: 
				indexFocus("#index-" + (index+1));
				break;										
		}
	}
	
	function scrollToIndex(event) {
		event.stopPropagation()
		event.preventDefault()
		var index = event.currentTarget.dataset.index;
		dom.data("#collectionIndex", "lastFocus", "#collectionIndex a[data-index='" + index + "']");
		 
		emby.getUserItems({
			enableImageTypes: "Primary,Thumb,Backdrop",	
			includeItemTypes: "movie,photoalbum,musicartist,series",	
			sortBy: 'sortname',
			sortOrder: 'ascending',	
			nameStartsWithOrGreater: index == "sym" ? "%29" : index,	
			limit: 1,
			parentId: self.parentId,
			success: function(data) {
				var count = self.totalRecordCount - data.TotalRecordCount;
				var view = dom.querySelector("#view");
				view.scrollLeft = Math.floor((count/2) * columnWidth);
				dom.removeClass(".index-item", "index-current");
				highlightIndex(index);	
			},
			error: error				
		});
	}
	
	function scrolling(event) {	
		var start = 0;
		var columnCurrent = Math.floor((event.currentTarget.scrollLeft - menuWidth) / columnWidth);
		var startColumn = Math.floor(self.startIndex / 2);
		var endColumn = Math.floor((self.startIndex + self.limit) / 2);
		
		if (columnCurrent > columnLast && columnCurrent >= endColumn - columnViewportCount - 1) {
			start = (columnCurrent * 2);
			start = start >= self.totalRecordCount - self.limit ? self.totalRecordCount - self.limit : start;
			
			if (start < self.totalRecordCount && start != self.startIndex) {
				self.startIndex = start;
				emby.getUserItems({
					enableImageTypes: "Primary,Thumb,Backdrop",	
					includeItemTypes: "movie,photoalbum,musicartist,series",	
					sortBy: 'sortname',
					sortOrder: 'ascending',	
					startIndex: self.startIndex,		
					limit: self.limit,
					initialise: false,
					parentId: self.parentId,
					parent: self.parent,	
					success: function(data) {
						data.startIndex = self.startIndex;
						displayAllUserItemsNext(data);
						clear(0, startColumn - columnViewportCount);
					},
					error: error				
				});								
			}
		}
		
	if (columnCurrent < columnLast && columnCurrent <= startColumn + columnViewportCount + 1) {
			var limit = (self.limit/2);
			limit =  limit % 2 ? limit - 1 : self.limit;
			start = (columnCurrent * 2) - (limit/2);
			start = start <= 10 ? 0 : start;
			
			if (start >= 0 && start != self.startIndex) {
				self.startIndex = start;	
				emby.getUserItems({
					enableImageTypes: "Primary,Thumb,Backdrop",	
					includeItemTypes: "movie,photoalbum,musicartist,series",	
					sortBy: 'sortname',
					sortOrder: 'ascending',	
					startIndex: self.startIndex,		
					limit: self.limit,
					initialise: false,					
					parentId: self.parentId,
					parent: self.parent,	
					success: function(data) {
						data.startIndex = self.startIndex;
						displayAllUserItemsNext(data);
						clear(endColumn + columnViewportCount, self.totalRecordCount/2);
					},
					error: error				
				});					
			}		
		}
		
		var node = dom.querySelector(dom.data("#view", "lastFocus"));
//		if (node && (node.parentNode.offsetLeft < event.currentTarget.scrollLeft || node.parentNode.offsetLeft + node.parentNode.clientWidth > event.currentTarget.scrollLeft + dom.width("#view"))) {
//			focus(".column-" + (columnCurrent+2) + " a");
//		}
		
		scrollLeft = event.currentTarget.scrollLeft;				
		columnLast = columnCurrent;
}

	function clear(start, end) {
		for(var i = start; i <= end; i++) {
			dom.remove("#c_" + self.id + "_" + i);
		}		
	}

	function focus(query) {
		var node = dom.focus(query);
		if (node && node.id) {
			if (node.classList.contains("latest-item") || node.classList.contains("user-views-item")) {
				dom.data("#view", "lastFocus", "#" + node.id);
			}
			if (dom.hasClass(node, "latest-item")) {
				var year = dom.data(node, "year") || "";
				var runtime = Number(dom.data(node, "runtime")) || 0;
				var hours = (runtime >= 60 ? Math.floor(runtime/60) + " hr " : "");
				var mins = (runtime % 60 > 0 ? runtime % 60 + " min" : "");
												
				dom.html("#details", {
					nodeName: "div",
					childNodes: [{
						nodeName: "div",
						className: "title",
						text: dom.data(node, "name")
					}, {
						nodeName: "div",
						className: "subtitle",
						text: year + (runtime ? " / " + hours + mins : "")		
					}]
				});
				
				var index = dom.data(node.parentNode, "index");
				if (index != indexCurrent) {
					highlightIndex(index);
					indexCurrent = index;
				}
			} else {
				dom.empty("#details");
			}			
		}
	}

	function highlightIndex(index) {
		dom.removeClass(".index-item", "index-current");
		if (index == "sym") {
			dom.addClass("#index-1", "index-current");
			dom.data("#collectionIndex", "lastFocus", "#index-1");
		} else {
			dom.addClass("#collectionIndex a[data-index='" + index + "']", "index-current");
			dom.data("#collectionIndex", "lastFocus", "#collectionIndex a[data-index='" + index + "']");	
		}
		self.currentIndex = index;
	}
	
	function indexFocus(query) {
		var node = dom.focus(query);
		if (node && node.id) {
			if (node.classList.contains("index-item")) {
				dom.data("#collectionIndex", "lastFocus", "#" + node.id);
			}
			if (dom.hasClass(node, "latest-item")) {
				var year = dom.data(node, "year") || "";
				var runtime = dom.data(node, "runtime") || "";
				var hours = (runtime >= 60 ? Math.floor(runtime/60) + " hr " : "");
				var mins = (runtime % 60 > 0 ? runtime % 60 + " min" : "");
												
				dom.html("#details", {
					nodeName: "div",
					childNodes: [{
						nodeName: "div",
						className: "title",
						text: dom.data(node, "name")
					}, {
						nodeName: "div",
						className: "subtitle",
						text: year + (runtime ? " / " + hours + mins : "")			
					}]
				});
			} else {
				dom.empty("#details");
			}			
		}
	}
					
	function collectionFocus() {
		var index = self.currentIndex;
		if (index != "sym")
		{
		   var child = "a:first-child";
		   var idx = index.charCodeAt(0);
		   for(var node; idx > 64 && !(node = dom.querySelector(".column-" + String.fromCharCode(idx)  + " " + child)) ;idx--)
		   {
			   	   child = "a:last-child";
		   };
		}
		else
			node = dom.querySelector(".column-sym a:first-child");

		if (node)
		    node.focus();
		else
		{
			playerpopup.show({
				duration: 2000,
				text: "There is no item in your collection beginning with this letter"
			});	
		}

		if (node && node.id) {
			if (node.classList.contains("index-item")) {
				dom.data("#collectionIndex", "lastFocus", "#" + node.id);
			}
			if (dom.hasClass(node, "latest-item")) {
				var year = dom.data(node, "year") || "";
				var runtime = dom.data(node, "runtime") || "";
				var hours = (runtime >= 60 ? Math.floor(runtime/60) + " hr " : "");
				var mins = (runtime % 60 > 0 ? runtime % 60 + " min" : "");
												
				dom.html("#details", {
					nodeName: "div",
					childNodes: [{
						nodeName: "div",
						className: "title",
						text: dom.data(node, "name")
					}, {
						nodeName: "div",
						className: "subtitle",
						text: year + (runtime ? " / " + hours + mins : "")			
					}]
				});
			} else {
				dom.empty("#details");
			}			
		}
	}
					
	function error(data) {
		message.show({
			messageType: message.error,			
			text: "Loading user collection all items failed!"
		});			
	}				
};