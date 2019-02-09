// Author: Simon J. Hogan
// Modifed: 24/04/2016
// Sith'ari Consulting Australia
// --------------------------------------------

var renderer = new RENDERER();
	
function RENDERER() {
	
};

RENDERER.prototype.userAllTvItems = function(data, settings) {
	settings = settings || {};

	var lastColumn = Math.ceil(data.TotalRecordCount / 2);
	
	var heading = settings.heading;
	var container = settings.container;
	var headerLink = settings.headerLink || "";	
	var id = settings.id;
	var initialise = settings.initialise || true;
	var startIndex = data.startIndex || 0;
	var addClass = settings.addClass || "";
											
if (data.Items.length > 0) {
		var width = device.columnWidth;
		if (initialise) {
			var totalRecords = data.TotalRecordCount % 2 ? data.TotalRecordCount + 1 : data.TotalRecordCount;
			
			dom.append(container, {
				nodeName: "div",
				className: "latest-items latest-items-livetv",
				id: id,
				style: {
					width: width * totalRecords / 2 + "px"
				},
				dataset: {
					collectionType: "livetv",
					limit: data.limit,
					lastColumn: lastColumn
				},
				childNodes: [{
					nodeName: "div",
					className: "latest-items-header",
					text: heading	
				}]
			});
			
			dom.data("#" + id, "count", data.Items.length);
		}
					
		
		data.Items.forEach(function(item, index) {
			var now = new Date()
			var itemStartDate = new Date(item.StartDate)
			var end = Math.abs(new Date(item.EndDate) - itemStartDate)
			var start = Math.abs(new Date() - itemStartDate)
			var PlayedPercentage = start * 100 / end;
			if (PlayedPercentage >= 100 || itemStartDate > now)
				PlayedPercentage = 0;
			var column = Math.floor((startIndex + index) / 2);
			var row = (startIndex + index) % 2;
			var cid = "c_" + id + "_" + column;
			var character = /^[a-zA-Z]$/.test(item.Name.toUpperCase().charAt(0)) ? item.Name.toUpperCase().charAt(0) : "sym";
			if (!dom.exists("#" + cid)) {
				dom.append("#" + id, {
					nodeName: "div",
					className: "latest-items-column-abs column-" + column + 
							" column-" + character + " " + addClass,
					id: cid,
					dataset: {
						index: character,
						location: (column * width)
					},
					style: {
						left: (column * width) + "px"
					}						
				});
			}
									
			var up = (row == 0) ? headerLink : "#" + id + "_" + column + "_" + (row - 1) ;
			var down = (row == 1) ? "%index%" : "#" + id + "_" + column + "_" + (row + 1);
			var left = (column == 0) ? "%previous%" : "#" + id + "_" + (column - 1) + "_" + row;
			var right = (column < lastColumn) ? "#" + id + "_" + (column + 1) + "_" + row : "%next%";	
			
			var imageId = item.ImageTags.Primary ? item.Id: data.parentId;
			var imageTag = item.ImageTags.Primary ? item.ImageTags.Primary : "";	
			var imageType = "primary";
			var imageClass =  "cover cover-" + item.Type.toLowerCase();
			
			if (!dom.exists("#" + id + "_" + column + "_" + row)) {
				dom.append("#c_" + id + "_" + column, {
					nodeName: "a",
					href: "#",
					className: "latest-item latest-item-" + item.Type.toLowerCase(),
					id: id + "_" + column + "_" + row,
					dataset: {
						backdrop: item.BackdropImageTags[0],
						name: item.Name,
						year: item.ProductionYear ? item.ProductionYear : "",
						runtime: item.RunTimeTicks ? Math.round((item.RunTimeTicks/(60*10000000))) : "",
						startdate: item.StartDate,
						id: item.Id,
						index: startIndex + index,
						keyUp: up,
						keyRight: right,
						keyLeft: left,
						keyDown: down
					},
					childNodes: [{
						nodeName: "div",
						className: imageClass,
						style: {
							backgroundImage: PlayedPercentage > 0 ? 
									"url(" + emby.getImageUrl({'itemId': imageId, tag: imageTag, imageType: imageType, height: index == 0 ? 600 : 400, percentPlayed: Math.floor(PlayedPercentage)}) + "),url('./images/GenericImage.jpg')" :
									"url(" + emby.getImageUrl({'itemId': imageId, tag: imageTag, imageType: imageType, height: index == 0 ? 600 : 400}) + "),url('./images/GenericImage.jpg')" 	
						},
						childNodes: [{
							nodeName: "div",
							className: "cover-title",
							text: item.Name
						}]					
					}]
				});	
			}
		});	
	}						
};


RENDERER.prototype.userAllItems = function(data, settings) {
	settings = settings || {};

	var lastColumn = Math.ceil(data.TotalRecordCount / 2);
	
	var heading = settings.heading;
	var container = settings.container;
	var headerLink = settings.headerLink || "";	
	var id = settings.id;
	var initialise = settings.initialise || false;
	var startIndex = data.startIndex || 0;
	var addClass = settings.addClass || "";
											
	if (data.Items.length > 0) {
		var width = 0;
		switch((data.parent.CollectionType || data.parent.collectionType)) {
			case "music":
			case "photos":
				width = device.columnWidthSquare;
				break;
			default: 
				width = device.columnWidth;
				break;
		}
					
		if (initialise) {
			var totalRecords = data.TotalRecordCount % 2 ? data.TotalRecordCount + 1 : data.TotalRecordCount;
			
			dom.append(container, {
				nodeName: "div",
				className: "latest-items latest-items-" + (data.parent.CollectionType || data.parent.collectionType),
				id: id,
				style: {
					width: width * totalRecords / 2 + "px"
				},
				dataset: {
					collectionType: (data.parent.CollectionType || data.parent.collectionType),
					parentId: data.parentId,
					limit: data.limit,
					lastColumn: lastColumn
				},
				childNodes: [{
					nodeName: "div",
					className: "latest-items-header",
					text: heading	
				}]
			});
			
			dom.data("#" + id, "count", data.Items.length);
		}
					
		
		data.Items.forEach(function(item, index) {
			var column = Math.floor((startIndex + index) / 2);
			var row = (startIndex + index) % 2;
			var cid = "c_" + id + "_" + column;
			var character = /^[a-zA-Z]$/.test(item.SortName.toUpperCase().charAt(0)) ? item.SortName.toUpperCase().charAt(0) : "sym";
			if (!dom.exists("#" + cid)) {
				dom.append("#" + id, {
					nodeName: "div",
					className: "latest-items-column-abs column-" + column + 
							" column-" + character + " " + addClass,
					id: cid,
					dataset: {
						index: character,
						location: (column * width)
					},
					style: {
						left: (column * width) + "px"
					}						
				});
			}
									
			var up = (row == 0) ? headerLink : "#" + id + "_" + column + "_" + (row - 1) ;
			var down = (row == 1) ? "%index%" : "#" + id + "_" + column + "_" + (row + 1);
			var left = (column == 0) ? "%previous%" : "#" + id + "_" + (column - 1) + "_" + row;
			var right = (column < lastColumn) ? "#" + id + "_" + (column + 1) + "_" + row : "%next%";	
			
			var imageId = item.ImageTags.Primary ? item.Id: data.parentId;
			var imageTag = item.ImageTags.Primary ? item.ImageTags.Primary : (data.parent.ImageTags ? data.parent.ImageTags.Primary : "");	
			var imageType = "primary";
			var imageClass =  "cover cover-" + item.Type.toLowerCase();
			
			if (!dom.exists("#" + id + "_" + column + "_" + row)) {
				dom.append("#c_" + id + "_" + column, {
					nodeName: "a",
					href: "#",
					className: "latest-item latest-item-" + item.Type.toLowerCase(),
					id: id + "_" + column + "_" + row,
					dataset: {
						backdrop: item.BackdropImageTags[0],
						name: item.Name,
						year: item.ProductionYear ? item.ProductionYear : "",
						runtime: item.RunTimeTicks ? Math.round((item.RunTimeTicks/(60*10000000))) : "",
						id: item.Id,
						played: item.UserData.Played,
						index: startIndex + index,
						keyUp: up,
						keyRight: right,
						keyLeft: left,
						keyDown: down
					},
					childNodes: [{
						nodeName: "div",
						className: imageClass,
						style: {
							backgroundImage: item.MediaType == "Video" && item.UserData.PlayedPercentage > 0 ? 
								"url(" + emby.getImageUrl({'itemId': imageId, tag: imageTag, imageType: imageType, height: index == 0 ? 600 : 400, percentPlayed: Math.floor(item.UserData.PlayedPercentage)}) + "),url('./images/GenericImage.jpg')" :
								"url(" + emby.getImageUrl({'itemId': imageId, tag: imageTag, imageType: imageType, height: index == 0 ? 600 : 400}) + "),url('./images/GenericImage.jpg')" 	
						},
						childNodes: [{
				           nodeName: "div",
				           className: item.UserData.Played ? "cardIndicators indicator" : "nothing"
						},{
							nodeName: "div",
							className: "cover-title",
							text: (item.SeriesName ? item.SeriesName + ": " : "") + item.Name
						}]					
					}]
				});	
			}
		});	
	}						
};

RENDERER.prototype.userSummaryItems = function(data, settings) {
	settings = settings || {};
	
	var currentColumn = -1;
	var lastColumn = Math.ceil((data.Items.length + 1) / 2) - 1;
	var column = 0;
	var row = 0;

	var id = settings.id;	
	var heading = settings.heading;
	var container = settings.container;
	var headerLink = settings.headerLink || "";	
	var more = (typeof settings.more === 'undefined') ? true : settings.more;
										
	if (data.Items.length > 0) {
		dom.append(container, {
			nodeName: "div",
			className: "latest-items latest-items-" + (data.parent.CollectionType || data.parent.collectionType),
			id: id,
			dataset: {
				collectionType: (data.parent.CollectionType || data.parent.collectionType),
				parentId: data.parentId,
				limit: data.limit,
				lastColumn: lastColumn
			},
			childNodes: [{
				nodeName: "div",
				className: "latest-items-header",
				text: heading	
			}]
		});
					
		data.Items.forEach(function(item, index) {				
			if (index == 0) {
				column = 0;
			} else {
				column = Math.floor((index + 1) / 2);
			}						
			
			if (currentColumn != column) {
				currentColumn = column;
				row = 0;
									
				dom.append("#" + id, {
					nodeName: "div",
					className: "latest-items-column latest-items-column-" + column,
					id: "c_" + id + "_" + column						
				});
			}

			var up = (row == 0) ? headerLink : "#" + id + "_" + column + "_" + (row - 1) ;
			var down = (row == 1 || column == 0 || ((column * 2 + row)) == data.length) ? "#" + id + "_more" : "#" + id + "_" + column + "_" + (row + 1);
			var left = (column == 0) ? "%previous%" : "#" + id + "_" + (column - 1) + "_" + (column == 1 ? 0 : row);
			var right = (column < lastColumn) ? "#" + id + "_" + (column + 1) + "_" + row : "%next%";	
			
			var imageId;
			var imageTag;
			var imageType;
			var imageClass =  "cover" + (data.forceThumb ? " cover-thumb" : " cover-" + item.Type.toLowerCase()) + (index == 0 ? "-large" : "") + (item.ImageTags.Primary ? "" : " cover-force-title");
			
			switch (item.Type) {
				case "Series":
					imageId = item.ParentThumbImageTag ? item.ParentThumbItemId : (item.ImageTags.Primary ? item.Id : data.parentId);
					imageTag = item.ParentThumbImageTag ? item.ParentThumbImageTag : (item.ImageTags.Primary ? item.ImageTags.Primary : "");
					imageType = item.ParentThumbImageTag ? "thumb" : "primary";
					break;
					
				case "Season":
					imageId = item.SeriesPrimaryImageTag ? item.SeriesId : (item.ImageTags.Primary ? item.Id : data.parentId);
					imageTag = item.SeriesPrimaryImageTag ? item.SeriesPrimaryImageTag : (item.ImageTags.Primary ? item.ImageTags.Primary : "");
					imageType = "primary";					
					imageClass = "cover cover-season" + (index == 0 ? "-large" : "") + (item.SeriesPrimaryImageTag ? "" : " cover-force-title");				
					break;	

				case "Episode":
					imageId = item.Id;
					imageTag = item.ImageTags.Primary;
					imageType = "primary";					
					break;	
					
				case "Audio":
					imageId = item.AlbumId ? item.AlbumId : data.parentId;
					imageTag = item.AlbumPrimaryImageTag ? item.AlbumPrimaryImageTag : (data.parent.ImageTags ? data.parent.ImageTags.Primary : "");
					imageType = "primary";					
					break;
									
				default:
					imageId = item.ImageTags.Primary ? item.Id: data.parentId;
					imageTag = item.ImageTags.Primary ? item.ImageTags.Primary : (data.parent.ImageTags ? data.parent.ImageTags.Primary : "");
					imageType = data.forceThumb ? "thumb" : "primary";
					break;
			}
			
			dom.append("#c_" + id + "_" + column, {
				nodeName: "a",
				href: "#",
				className: "latest-item latest-item-" + item.Type.toLowerCase(),
				id: id + "_" + column + "_" + row,
				dataset: {
					backdrop: item.BackdropImageTags[0],
					name: item.Name,
					year: item.ProductionYear ? item.ProductionYear : "",
					runtime: item.RunTimeTicks ? Math.round((item.RunTimeTicks/(60*10000000))) : "",
					id: item.Id,
					index: index,
					keyUp: up,
					keyRight: right,
					keyLeft: left,
					keyDown: down
				},
				childNodes: [{
					nodeName: "div",
					className: imageClass,
					style: {
						backgroundImage: item.MediaType == "Video" && item.UserData.PlayedPercentage > 0 ? 
							"url(" + emby.getImageUrl({'itemId': imageId, tag: imageTag, imageType: imageType, height: index == 0 ? 600 : 400, percentPlayed: Math.floor(item.UserData.PlayedPercentage)}) + "),url('./images/GenericImage.jpg')" :
							"url(" + emby.getImageUrl({'itemId': imageId, tag: imageTag, imageType: imageType, height: index == 0 ? 600 : 400}) + "),url('./images/GenericImage.jpg')" 	
					},
					childNodes: [{
			           nodeName: "div",
			           className: item.UserData.Played ? "cardIndicators indicator" : "nothing"
					},{
						nodeName: "div",
						className: "cover-title",
						text: (item.SeriesName ? item.SeriesName + ": " : "") + item.Name
					}]					
				}]
			});	
			row++;
		});
		
		dom.data("#" + id, "count", data.Items.length);
		
		if (more) {
			dom.append("#" + id, {
				nodeName: "div",
				className: "latest-items-footer",
				childNodes: [{
					nodeName: "a",
					id: id + "_more",				
					href: "#",
					className: "latest-items-more",
					dataset: {
						id: data.parentId,
						name: data.parentName	
					},
					text: "more"	
				}]
			});
		}
	}							
};

RENDERER.prototype.userResumeItems = function(data, settings) {
	settings = settings || {};
	
	var currentColumn = -1;
	var lastColumn = Math.ceil(data.Items.length / 2) - 1;
	var column = 0;
	var row = 0;					

	var container = settings.container;
	var heading = settings.heading;
	var headerLink = settings.headerLink || "";	
			
	if (data.Items.length > 0) {
		dom.append(container, {
			nodeName: "div",
			className: "latest-items latest-items-resume",
			id: "p_resume",
			dataset: {
				collectionType: "resume",
				parentId: "resume",
				limit: data.limit,
				lastColumn: lastColumn
			},
			childNodes: [{
				nodeName: "div",
				className: "latest-items-header",
				text: heading	
			}]
		});			
		
		data.Items.forEach(function(item, index) {						
			if (index == 0) {
				column = 0;
				
			} else {
				column = Math.floor(index / 2);
			}							
			
			if (currentColumn != column) {
				currentColumn = column;
				row = 0;
									
				dom.append("#p_resume", {
					nodeName: "div",
					className: "latest-items-column latest-items-column-" + column,
					id: "c_resume_" + column						
				});
			}

			var up = (row == 0) ? headerLink : "#resume_" + column + "_" + (row - 1) ;
			var down = "#resume_" + column + "_" + (row + 1);
			var left = (column == 0) ? "%previous%" : "#resume_" + (column - 1) + "_" + (column == 1 ? 0 : row);
			var right = (column < lastColumn) ? "#resume_" + (column + 1) + "_" + row : "%next%";	
			
			dom.append("#c_resume_" + column, {
				nodeName: "a",
				href: "#",
				className: "latest-item latest-item-" + item.Type.toLowerCase(),
				id: "resume_" + column + "_" + row,
				dataset: {
					backdrop: item.BackdropImageTags[0],
					name: item.Name,
					year: item.ProductionYear ? item.ProductionYear : "",
					runtime: item.RunTimeTicks ? Math.round((item.RunTimeTicks/(60*10000000))) : "",
					id: item.Id,
					index: index,
					keyUp: up,
					keyRight: right,
					keyLeft: left,
					keyDown: down
				},
				childNodes: [{
					nodeName: "div",
					className: "cover cover-thumb",
					style: {
						backgroundImage: item.ParentThumbImageTag ?
							"url(" + emby.getImageUrl({'itemId': item.ParentBackdropItemId, tag: item.ParentThumbImageTag, imageType: 'Thumb', height: 400, percentPlayed: Math.floor(item.UserData.PlayedPercentage)}) + "),url('./images/GenericImage.jpg')" :
							"url(" + emby.getImageUrl({'itemId': item.Id, tag: item.ImageTags.Thumb, imageType: 'Thumb', height: 400, percentPlayed: Math.floor(item.UserData.PlayedPercentage)}) + "),url('./images/GenericImage.jpg')"	
					},
					childNodes: [{
			           nodeName: "div",
			           className: item.UserData.Played ? "cardIndicators indicator" : "nothing"
					},{
						nodeName: "div",
						className: "cover-title",
						text: (item.ParentIndexNumber ? item.ParentIndexNumber + "\u2022" + item.IndexNumber + " " : "") + item.Name
					}]					
				}]
			});	
			row++;
		});
		
		dom.data("#p_resume", "count", data.length);			
	}
};

RENDERER.prototype.userItem = function(data,tvdata, settings) {
	settings = settings || {};
	var item = data;
	var tvitem = tvdata;
	var container = settings.container;
	
	var imageId = item.Id;
	var imageTag = item.ImageTags.Primary;
	var imageType = "primary";
	if (item.Type == "Episode")
		var imageClass = "cover cover-episode-large";
	else
	    var imageClass =  "cover cover-" + item.Type.toLowerCase() + "-large poster-" + item.Type.toLowerCase();
	
	switch (item.Type) {
		case "Audio":
			var imageId = item.ParentId;
			var imageTag = item.ParentLogoImageTag;		
			break;
		default:
			break;
	}

	dom.append(container, 
			{
				nodeName: "div",
				id: "itemPoster",
				childNodes: 
				[{
					nodeName: "div",
					className: imageClass,
					style: 
					{
						backgroundImage: "url(" + emby.getImageUrl({'itemId': imageId, tag: imageTag, imageType: imageType, height: 600}) + "),url('./images/GenericImage.jpg')"	
					},
				    childNodes:
				    [{
			           nodeName: "div",
			           className: item.UserData.Played ? "cardIndicators indicator" : tvitem.SeriesTimerId ? "cardIndicators seriesRecording" : tvitem.TimerId ? "cardIndicators episodeRecording" :"nothing"
				    }]
	           }]
			});
			

	if (item.People) {
		var people = [];
		item.People.slice(0, 3).forEach(function(i) {
			people.push(i.Name);
		});
	}
	var time = item.RunTimeTicks ? Math.round((item.RunTimeTicks/(60*10000000))) : Math.round((item.CumulativeRunTimeTicks/(60*10000000)));
	var hours = (time >= 60 ? Math.floor(time/60) + " hr " : "");
	var mins = (time % 60 > 0 ? time % 60 + " min" : "");
	var now = new Date().toISOString();
	dom.append(container, {
		nodeName: "div",
		id: "itemDetails",
		className: "item-details",
		dataset: {
			id: item.Id	
		},
		childNodes: [{
			nodeName: "div",
			className: "title",
			text: item.Name
		}, item.AlbumArtist ? {
			nodeName: "div",
			className: "artist",
			text: item.AlbumArtist
		} : {}, item.ProductionYear ? {
			nodeName: "div",
			className: "year",
			text: item.ProductionYear
		} : {}, item.OfficialRating ? {
			nodeName: "div",
			className: "rating",
			text: item.OfficialRating
		} : {}, item.RunTimeTicks || item.CumulativeRunTimeTicks ? {
			nodeName: "div",
			className: "runtime",
			text: hours + mins
		} : {}, tvitem.StartDate && tvitem.StartDate > now ? {
			nodeName: "div",
			className: "genre",
			text: "Airs "+formatDate(item.StartDate)+" on "+tvitem.ChannelName+ " ("+tvitem.ChannelNumber+")"
		} : {}, item.Genres && item.Genres.length > 0 ? {
			nodeName: "div",
			className: "genre",
			text: item.Genres.join(" / ")
		} : {}, item.Overview ? {
			nodeName: "div",
			className: "overview",
			text: item.Overview
		} : {}, people ? {
			nodeName: "div",
			className: "people",
			text: people.join(" / ")
		} : {}, item.CameraMake ? {
			nodeName: "div",
			className: "camera-make",
			text: item.CameraMake
		} : {}, item.CameraModel ? {
			nodeName: "div",
			className: "camera-model",
			text: item.CameraModel
		} : {}, item.Software ? {
			nodeName: "div",
			className: "software",
			text: item.Software
		} : {}, item.CommunityRating ? {
			nodeName: "div",
			className: "rank",
			childNodes: this.rating(item.CommunityRating)
		} : {}]
	});		

    function formatDate(isoDate) {
  	  var monthNames = 
      [
	      "January", "February", "March",
  	      "April", "May", "June", "July",
  	      "August", "September", "October",
  	      "November", "December"
  	  ];
  	  var date = new Date(isoDate)
  	  var day = date.getDate();
  	  var monthIndex = date.getMonth();
  	  var hours = date.getHours();
  	  var minutes = date.getMinutes();
  	  var ampm = hours >= 12 ? 'pm' : 'am';
  	  hours = hours % 12;
  	  hours = hours ? hours : 12; // the hour '0' should be '12'
  	  minutes = minutes < 10 ? '0'+minutes : minutes;
  	  var strTime = hours + ':' + minutes + ' ' + ampm;
  	  return monthNames[monthIndex]+' '+ day + ' at ' + strTime;
  }
};

RENDERER.prototype.userItemChildren = function(data, settings) {
	settings = settings || {};
	
	var currentColumn = -1;
	var lastColumn = Math.ceil((data.Items.length + 1) / 2) - 1;


	var id = settings.id;	
	var heading = settings.heading;
	var container = settings.container;
	var headerLink = settings.headerLink || "";	
	
	if (data.Items.length > 0) {
		dom.append(container, {
			nodeName: "div",
			className: "latest-items",
			id: id,
			dataset: {
				limit: data.limit,
				lastColumn: lastColumn
			},
			childNodes: [{
				nodeName: "div",
				className: "latest-items-header",
				text: heading	
			}]
		});
					
		data.Items.forEach(function(item, index) {				
			var column = Math.floor(index / 2);
			var row = index % 2;					
			
			if (currentColumn != column) {
				currentColumn = column;
				dom.append("#" + id, {
					nodeName: "div",
					className: "latest-items-column latest-items-column-" + column,
					id: "c_" + id + "_" + column						
				});
			}

			var up = (row == 0) ? headerLink : "#" + id + "_" + column + "_" + (row - 1) ;
			var down = "#" + id + "_" + column + "_" + (row + 1);
			var left = (column == 0) ? "%previous%" : "#" + id + "_" + (column - 1) + "_" + row;
			var right = (column < lastColumn) ? "#" + id + "_" + (column + 1) + "_" + row : "%next%";	
						
			var imageId = item.Id;
			var imageTag = item.ImageTags.Primary;	
			var imageType = "primary";
			var imageClass =  "cover cover-" + item.Type.toLowerCase() + " cover-force-title";
			
			dom.append("#c_" + id + "_" + column, {
				nodeName: "a",
				href: "#",
				className: "latest-item latest-item-" + item.Type.toLowerCase(),
				id: id + "_" + column + "_" + row,
				dataset: {
					name: item.Name,
					year: item.ProductionYear ? item.ProductionYear : "",
					runtime: item.RunTimeTicks ? Math.round((item.RunTimeTicks/(60*10000000))) : "",
					id: item.Id,
					index: index,
					keyUp: up,
					keyRight: right,
					keyLeft: left,
					keyDown: down
				},
				childNodes: [{
					nodeName: "div",
					className: imageClass,
					style: {
						backgroundImage: item.MediaType == "Video" && item.UserData.PlayedPercentage > 0 ? 
							"url(" + emby.getImageUrl({'itemId': imageId, tag: imageTag, imageType: imageType, height: index == 0 ? 600 : 400, percentPlayed: Math.floor(item.UserData.PlayedPercentage)}) + "),url('./images/GenericImage.jpg')" :
							"url(" + emby.getImageUrl({'itemId': imageId, tag: imageTag, imageType: imageType, height: index == 0 ? 600 : 400}) + "),url('./images/GenericImage.jpg')" 	
					},
					childNodes: [{
			           nodeName: "div",
			           className: item.UserData.Played ? "cardIndicators indicator" : "nothing"
					},{
						nodeName: "div",
						className: "cover-title",
						text: (item.Type == "Episode" ? item.IndexNumber + ". " : "") + item.Name
					}]					
				}]
			});	
		});	
	}
};

RENDERER.prototype.rating = function(rating) {
	var nodes = [];
	var rank = Math.ceil(rating);
	
	for (var r = 2; r <= 10; r+=2) {
		if (rank >= r) {
			nodes.push({
				nodeName: "div",
				className: "star full-star"
			});
		} else if (rank == (r-1)) {
			nodes.push({
				nodeName: "div",
				className: "star half-star"
			});				
		} else {
			nodes.push({
				nodeName: "div",
				className: "star empty-star"
			});			
		}
	}
	
	return nodes;	
};