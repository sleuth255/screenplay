// Author: Simon J. Hogan
// Modifed: 24/04/2016
// Sith'ari Consulting Australia
// --------------------------------------------

function CollectionSummary() {
	this.backdrops;
	this.total = 0;
	this.count = 0;
	this.lostfocus;
};

CollectionSummary.prototype.close = function() {

};

CollectionSummary.prototype.close = function() {

	dom.off("body","keydown", this.lostfocus);
	
}
CollectionSummary.prototype.load = function(data, settings) {
	data = data || {};	
	settings = settings || {};
	
	var self = this;
	this.backdrops = new Array();
	this.total = 5;
	this.count = 0;

	dom.hide("#server");
	dom.hide("#user");
	dom.show("#details")
	dom.show("#homeLink");

	self.close()
	
	dom.html("#view", {
		nodeName: "div",
		className: "collection-view",
		id: "collection",
		childNodes: [{
			nodeName: "div",
			className: "user-views",
			id: "userViews",
			childNodes: [{
				nodeName: "div",
				className: "user-views-column",
				id: "userViews_0",
				childNodes: [{
					nodeName: "a",
					className: "user-views-item",
					href: "#",
					id: "all",
					dataset: {
						id: data.id,
						name: data.name,
						collectionType: data.collectionType,
						keyUp: "#homeLink a",	
						keyRight: "#viewItem_1_0, #latestItemSet_0 a"	
					},
					childNodes: [{
						nodeName: "span",
						className: "user-views-item-name",
						text: "All " + data.name
					}]
				}]				
			}]
		}]
	});

	this.lostfocus = dom.on("body", "keydown", lostFocus);
			
	dom.on("#collection #all", "click", function() {
		event.stopPropagation()
		event.preventDefault()
		dom.dispatchCustonEvent(document, "allCollectionSelected", this.dataset);
	});
			
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
		
	emby.getUserItems({
		enableImageTypes: "primary,thumb,backdrop",
		includeItemTypes: "movie,episode,musicalbum,photo,photoalbum,musicartist,audio",			
		limit: 5,
		parentId: data.id,
		parent: {collectionType: data.collectionType, name: data.name, imageTag: data.imageTag},
		sortBy: 'dateplayed',
		sortOrder: 'descending',	
		fields: 'genres',	
		label: "Recently Played",		
		success: function(d) {
			if (d.Items.length > 0) {
				displayUserSummaryItems(d);
				
				if (d.Items[0].Genres.length > 0) {
					var index = Math.floor((Math.random() * d.Items[0].Genres.length));
					emby.getUserItems({
						enableImageTypes: "primary,thumb,backdrop",
						includeItemTypes: "movie,episode,musicalbum,photo,photoalbum,musicartist,audio",							
						sortBy: 'communityrating',
						sortOrder: 'descending',						
						limit: 5,
						parentId: data.id,
						parent: {collectionType: data.collectionType, name: data.name, imageTag: data.imageTag},
						genres: d.Items[0].Genres[index],
						label: "Top " + data.name + " In " + d.Items[0].Genres[index],
						success: function(data) {
							displayUserSummaryItems(data);
						},
						error: error				
					});
				} else {
					complete();
				}
			} else {
				complete();
			}							
		},
		error: error				
	});	
							
	emby.getUserLastestItems({
		enableImageTypes: "primary,thumb,backdrop",
		limit: 5,
		parentId: data.id,
		parent: {collectionType: data.collectionType, name: data.name, imageTag: data.imageTag},
		label: "Recently Added " + data.name,
		success: displayUserSummaryItems,
		error: error				
	});		

	emby.getUserItems({
		enableImageTypes: "primary,thumb,backdrop",	
		includeItemTypes: "movie,episode,musicalbum,photo,photoalbum,musicartist,audio",		
		sortBy: 'communityrating',
		sortOrder: 'descending',			
		limit: 5,
		parentId: data.id,
		parent: {collectionType: data.collectionType, name: data.name, imageTag: data.imageTag},	
		label: "Recommended",	
		success: displayUserSummaryItems,
		error: error				
	});

	emby.getUserItems({
		enableImageTypes: "primary,thumb,backdrop",	
		includeItemTypes: "movie,episode,musicalbum,photo,photoalbum,musicartist",	
		sortBy: 'PremiereDate',
		sortOrder: 'descending',			
		limit: 5,
		parentId: data.id,
		parent: {collectionType: data.collectionType, name: data.name, imageTag: data.imageTag},	
		label: "Latest Releases",	
		success: displayUserSummaryItems,
		error: error				
	});
				
	function displayUserSummaryItems(data) {
		var id = guid.create();	
									
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
			
			renderer.userSummaryItems(data, {
				container: "#collection",
				id: id,
				heading: data.label,
				headerLink: "#homeLink a",
				more: false
			});
		}	
			
		complete();	
	}

	function complete() {
		self.count++;
						
		if (self.count == self.total) {
			var nodes = dom.querySelectorAll(".latest-items");
			for (var i = 0; i < nodes.length; i++) {
				nodes[i].id = "latestItemSet_" + i;
			}
			focus("#userViews a:first-child");		
		}		
	}

	function lostFocus(event) {
		if (dom.exists("#screenplaySettings") || dom.exists("#player"))
			return;
		if (event.target.tagName != "A") {
			focus(dom.data("#view", "lastFocus"));
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
					focus(dom.data(self, "keyRight"));
					break;
				case keys.KEY_DOWN: 
					focus(dom.data(self, "keyDown"));
					break;											
			}
		}
		
		if (dom.hasClass(self, "latest-item")) {	
			var columnSetIndex = self.parentNode.parentNode.id ? parseInt(self.parentNode.parentNode.id.substr(self.parentNode.parentNode.id.lastIndexOf("_") + 1)) : 0;
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
					focus(dom.data(self, "keyDown"));
					break;																	
			}
		}	
		
		if (dom.hasClass(self, "latest-items-more")) {
			focus(dom.data("#view", "lastFocus"));
		}	
	}

	function focus(query) {
		var node = dom.focus(query);
		if (node && node.id) {
			if (node.id.indexOf("_more") == -1) {
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
			} else {
				dom.empty("#details");
			}
		}
	}
			
	function error(data) {
		complete();
		message.show({
			messageType: message.error,			
			text: "Loading user collection summary failed!"
		});			
	}			
};