


var Manager = function(gmap, db)
{
	var self = this;
	self.map = gmap; //the google map
	self.filter = ko.observable("pizza");
	self.includeDeals = ko.observable(false);
	self.businessList = ko.observableArray();
	self.menuExpanded = ko.observable(MENUPLUS);
	self.showMenu = ko.observable();
	self.selectedMarker = ko.observable();
	
	self.businessList.push(db[0]);
	self.businessList.push(db[1]);
	self.businessList.push(db[2]);
	self.businessList.push(db[3]);
	self.businessList.push(db[4]);
	self.businessList.push(db[5]);
	
	
	//our filtered business list
	self.filteredBusinesses = ko.dependentObservable(function(){
			if(self.includeDeals())
			{
				return ko.utils.arrayFilter(self.businessList(),function(item){
							return (item.deals  && item.deals().length>0);
						});
			}
			
			var filterText = self.filter();
			//only apply filters if we have 2 or more characters
			if(!filterText || filterText.length<3)
			{
				return self.businessList();
			}
			filterText = filterText.toUpperCase();
		
			//apply the filter to everything else
			return  ko.utils.arrayFilter(self.businessList(),function(business){
					//match on business name
					if(business.name().toUpperCase().indexOf(filterText)>-1)
					{
						return true;
					}
					
					//match on categories
					var categoryIx = 0;
					for(categoryIx in business.categories)
					{
						var category  = business.categories[categoryIx];
						if(category && category.toUpperCase().indexOf(filterText)>-1)
						{
							return true;
						}
					}
					
					//match on address
					if(business.address().toUpperCase().indexOf(filterText)>0)
					{
						return true;
					}
				});
		}, self.businessList());
	
	self.toggleMenu = function()
	{
		self.menuExpanded (   (self.menuExpanded ()===MENUPLUS?MENUMINUS:MENUPLUS));		
		self.showMenu(self.menuExpanded ()===MENUMINUS);
	};
	
		//scroll the businesses that are filtered and show their markers on the map
	self.setMapMarkers = ko.dependentObservable(function(){
		self.map.deleteMarkers();
		self.filteredBusinesses().forEach(function(business){
				self.map.addMarker( 
						new google.maps.LatLng(business.latitude(), business.longitude()),
						business.icon(),
						business.name());
			});
		return true;
	});
	
};


ko.applyBindings(new Manager(gmap, db));