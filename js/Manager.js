
/*
* @class  neighborHoodModel 
* holds the knockout data in observable arrays
* accessed by Manager 
*/
var NeighborHoodModel =  function(map,db)
{
	var self = this;
	self.map = gmap; //the google map
	self.filter = ko.observable(""); // the current filter for the  yelp businesses
	self.includeDeals = ko.observable(false); //filters out businesses based on whether deals are available
	self.businessList = ko.observableArray();//the businesses from yelp
	self.menuExpanded = ko.observable(MENUPLUS); //the character + -  indicates whiether clicking will collapse or expand
	self.showMenu = ko.observable(); //indicates if menu is visible
	 
	self.currentBusiness = ko.observable();// the current business whose map marker was clicked

		//load the business array
	db.forEach(function(business){self.businessList.push(business);});
};



/*
* @class  Manager 
* this function hadles the filtering/sorting of businesses in the list 
* and the adding/deleting of map markers from the google maps
*  
*/
var Manager = function(gmap, db)
{
	var self = this;
	self.model = new NeighborHoodModel(gmap,db);
	
	//our filtered business list
	//the model is filtered using model.filter and model.includeDeals
	self.filteredBusinesses = ko.dependentObservable(function(){
			if(self.model.includeDeals())
			{
				return ko.utils.arrayFilter(self.model.businessList(),function(item){
							return (item.deals  && item.deals().length>0);
						});
			}
			
			var filterText = self.model.filter();
			//only apply filters if we have 2 or more characters
			if(!filterText || filterText.length<3)
			{
				return self.model.businessList();
			}
			filterText = filterText.toUpperCase();
		
			//apply the filter to everything else
			return  ko.utils.arrayFilter(self.model.businessList(),function(business){
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
		}, self.model.businessList());
	

	// this is called whenever the plus/minus is clicked
	self.toggleMenu = function()
	{
		self.model.menuExpanded (   (self.model.menuExpanded ()===MENUPLUS?MENUMINUS:MENUPLUS));		
		self.model.showMenu(self.model.menuExpanded ()===MENUMINUS);
		
		//alter the height of the list so that we can alway scroll 
		//to the bottom of the list
		$("#well2").height( (window.innerHeight-MENUSIZE)+"px");
	};
	
		//scroll the businesses that are filtered and show their markers on the map
	self.setMapMarkers = ko.dependentObservable(function(){
		self.model.map.deleteMarkers();
		var currBusiness  = self.model.currentBusiness();
		
		self.filteredBusinesses().forEach(function(business){
				if(business)
				{
					var icon = business.icon();
					if(currBusiness&& business.name() ===currBusiness.name())
					{	//current business is selected
						icon = GOOGLEYELLOWICON;
					}
					
					//re-add the map markers to match the filtering/selection
					 self.model.map.addMarker( 
						new google.maps.LatLng(business.latitude(), business.longitude()),
						icon,
						business.name(),
						business);
				}
			});
			
		return true;
	});
	
	
	//this is the business that was selected by clicking on the map marker
	self.setCurrentBusiness = function(name)
	{
		self.filteredBusinesses().forEach(function(business){
			if(business.name() ===name)
			{
				self.model.currentBusiness(business);
			}
		});
	};
	
};


//this is called after the 
function initKnockout()
{
	mgr= new  Manager(gmap, yelpQuery.yelpBusinesses);
	ko.applyBindings(mgr);

};



function errorRetrievingYelp (xhr, status, errorThrown) 
{
	if(status==="timeout")
	{
		$("#errorMsg").text( "Unable to connect to yelp.        Please refresh your browser and try again ");
		$("#dealsId").hide();
	}
};

function errorRetrievingMap () 
{
	if(status==="timeout")
	{
		$("#errorMsg").text( "Unable to connect to Google Maps.        Please refresh your browser and try again ");
		$("#dealsId").hide();
	}
};