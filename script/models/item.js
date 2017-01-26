// Author: Simon J. Hogan
// Modifed: 24/04/2016
// Sith'ari Consulting Australia
// --------------------------------------------

function Item() {
	this.data = {};
};

Item.prototype.close = function(){
	dom.remove("#item")
}
Item.prototype.load = function(id, settings) {
	settings = settings || {};
	var self = this;
	
	dom.hide("#server");
	dom.hide("#user");
	dom.hide("#details")
	dom.show("#homeLink");
	
	if (dom.exists("#item"))
		dom.remove("#item")

	emby.getUserItem({
		id: id,
		success: displayItem,
		error: error					
	})	

	function displayItem(data) {
		self.data = data;
		
		if (data.Type == "Series" || data.Type == "Season")
		{
			dom.html("#view", {
				nodeName: "div",
				className: "item-view",
				id: "item",
				childNodes: [{
					nodeName: "div",
					className: "item-content",
					id: "itemContent"
				}]
			});
		}
		else
		{
		   dom.html("#view", {
			   nodeName: "div",
			   className: "item-view",
			   id: "item",
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
						   id: "viewPlay",
						   dataset: {
							   keyUp: "#homeLink a",
							   keyDown: "#userViews a:last-child",
							   keyRight: "a.latest-item"	
						   },
						   childNodes: [{
							   nodeName: "span",
							   className: "user-views-item-name glyphicon play",
							   text: ""
						   }]					
					   }]
				   }]
			   }, {
				   nodeName: "div",
				   className: "item-content",
				   id: "itemContent"
			   }]
		   });
		   if (data.UserData.PlaybackPositionTicks > 0)  // resume data available: show resume button
		   {
   		      dom.append("#userViews_0", {
			      nodeName: "a",
			      href: "#",
			      className: "user-views-item",
			      id: "viewResume",
			      dataset: {
				      keyUp: "#userViews a:first-child",
				      keyDown: "#userViews a:last-child",
				      keyRight: "a.latest-item"	
			      },
			      childNodes: [{
				      nodeName: "span",
				      className: "user-views-item-name glyphicon forward",	
				      text: ""				
			      }]
		      });		
		   }
		}
		

		
		if (data.BackdropImageTags && data.BackdropImageTags[0]) {
			dom.css("#poster", {
				backgroundImage: "url(" + emby.getImageUrl({'itemId': data.Id, tag: data.BackdropImageTags[0], imageType: 'Backdrop', height: 1080}) + ")"
			});	
		} else if (data.ParentBackdropImageTags && data.ParentBackdropImageTags[0]) {
			dom.css("#poster", {
				backgroundImage: "url(" + emby.getImageUrl({'itemId': data.ParentBackdropItemId, tag: data.ParentBackdropImageTags[0], imageType: 'Backdrop', height: 1080}) + ")"
			});				
		}	
		
		dom.addClass("#item", "item-view-" + data.Type.toLowerCase());
		
		renderer.userItem(data, {
			container: "#itemContent"
		});
		
		switch(data.Type) {
			case "Series":
				emby.getShowsSeasons({
					id: data.Id,
					fields: "ItemCounts,AudioInfo",	
					success: function(data) {
						data.heading = "Seasons";						
						displayUserItemChildren(data)
					},
					error: error				
				});	
				break;

			case "Season":
				emby.getShowsEpisodes({
					id: data.SeriesId,
					seasonId: data.Id,
					fields: "ItemCounts,AudioInfo",	
					success: function(data) {
						data.heading = "Episodes";						
						displayUserItemChildren(data)
					},
					error: error				
				});	
				break;
								
			case "MusicArtist":
				emby.getUserItems({
					artistIds: data.Id,
					enableImageTypes: "Primary,Thumb,Backdrop",	
					includeItemTypes: "musicalbum",	
					sortBy: 'sortname',
					sortOrder: 'ascending',						
					fields: "AudioInfo,SeriesInfo,ParentId,SyncInfo",	
					success: function(data) {
						data.heading = "Albums";
						displayUserItemChildren(data)
					},
					error: error				
				});	
				break;				
		}	
		
		if (data.Type != "Series" && data.Type != "Season")
		{
            focus("#userViews a:first-child");
			if (data.Video3DFormat == "HalfTopAndBottom")
			   prefs.video3DFormat = "top_bottom"
			else				   
			if (data.Video3DFormat == "HalfSideBySide")
			   prefs.video3DFormat = "side_by_side_LR"
			else				   
			if (data.Video3DFormat == "FullSideBySide")
				prefs.video3DFormat = "side_by_side_full_LR"
			else
				prefs.video3DFormat = "2D"
		}


		dom.on("#viewPlay", "click", function(event) {
			prefs.resumeTicks = 0;
			dom.dispatchCustonEvent(document, "playItem", self.data);
		});
		dom.on("#viewResume", "click", function(event) {
			prefs.resumeTicks = data.UserData.PlaybackPositionTicks;
			dom.dispatchCustonEvent(document, "playItem", self.data);
		});

		dom.delegate("#item", "a", "keydown", navigation);
	}

	function displayUserItemChildren(data) {
		renderer.userItemChildren(data, {
			id: "ci_" + guid.create(),
			heading: data.heading,
			headerLink: "#homeLink a",
			container: "#item"
		});
		
		dom.delegate("#item", "a.latest-item", "click", function(event) {
			event.stopPropagation()
			event.preventDefault()
			dom.dispatchCustonEvent(document, "mediaItemSelected", event.delegateTarget.dataset);
		});	
        focus(".latest-item");
//		dom.delegate("#item", "a.latest-item", "keydown", navigation);
	}

	function navigation(event) {
		event.preventDefault();
		if (dom.exists("#player"))
			return;
		var self = event.delegateTarget;

		if (event.which == keys.KEY_OK) {
			event.stopPropagation()
			self.click();
			return;
		}
		
		if (dom.hasClass(self, "user-views-item")) {	
/*
			playerpopup.show({
				duration: 5000,
				text: "Up " + dom.data(self, "keyUp") + " Down: " + dom.data(self, "keyDown")
			});
*/
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

	function focus(query) {
		var node = dom.focus(query);
		if (node && node.id) {
			if (node.classList.contains("latest-item") || node.classList.contains("user-views-item")) {
				dom.data("#view", "lastFocus", "#" + node.id);
			}
		}
	}
		
	function error(data) {
		message.show({
			messageType: message.error,			
			text: "Loading item failed!"
		});			
	}		
};