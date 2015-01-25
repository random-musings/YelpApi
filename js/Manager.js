
var marker;

var Manager = function(gmap, db)
{
	var self = this;
	self.map = gmap; //the google map
	self.filter = ko.observable("");
	self.includeDeals = ko.observable(false);
	self.businessList = ko.observableArray();
	self.menuExpanded = ko.observable(MENUPLUS);
	self.showMenu = ko.observable();
	self.selectedMarker = ko.observable();
	self.currentBusiness = ko.observable();
	
	db.forEach(function(business){self.businessList.push(business);});

	//self.businessList.push(db[0]);
	//self.businessList.push(db[1]);
	//self.businessList.push(db[2]);
	//self.businessList.push(db[3]);
	//self.businessList.push(db[4]);

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
		
		$("#well2").height( (window.innerHeight-MENUSIZE)+"px");
	};
	
		//scroll the businesses that are filtered and show their markers on the map
	self.setMapMarkers = ko.dependentObservable(function(){
		self.map.deleteMarkers();
		self.currentBusiness();
		var mapCenter;
		self.filteredBusinesses().forEach(function(business){
				if(business)
				{
					var icon = business.icon();
					if(self.currentBusiness() && business.name() ===self.currentBusiness().name())
					{
						icon = GOOGLEYELLOWICON;
					}
					 self.map.addMarker( 
						new google.maps.LatLng(business.latitude(), business.longitude()),
						icon,
						business.name(),
						business);
						mapCenter = new google.maps.LatLng(business.latitude(), business.longitude());
				}
			});
			self.map.map.setCenter(mapCenter);
		return true;
	});
	
	
	
	self.setCurrentBusiness = function(name)
	{
		self.filteredBusinesses().forEach(function(business){
			if(business.name() ===name)
			{
				self.currentBusiness(business);
			}
		});
	};
	
};



function initKnockout()
{
	mgr= new  Manager(gmap, yelpQuery.yelpBusinesses);
	ko.applyBindings(mgr);

};

var mgr ;
var yelpQuery =   new YelpQueries('yelpQuery.fillYelpData','yelpQuery.errorInAjax',initKnockout,800);
yelpQuery.loadBusinesses();

