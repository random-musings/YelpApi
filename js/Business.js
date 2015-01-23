

var Business = function(businessIx,
									businessId,
									businessName,
									businessUrl,
									businessImage,
									businessAddress,
									mobileUrl,
									ratingsImg,
									reviewCount,
									latitude,
									longitude,
									yelpCategories,
									yelpDeals)
{
	this.name = ko.observable(businessName);
	this.businessId = ko.observable(businessId);
	this.businessIx = ko.observable(businessIx);
	this.businessUrl = ko.observable(businessUrl);
	this.imageUri = ko.observable(businessImage);
	this.ratingsImg = ko.observable(ratingsImg);
	this.reviewCount = ko.observable(reviewCount);
	this.mobileUrl = ko.observable(mobileUrl);
	this.address = ko.observable(businessAddress);
	this.latitude = ko.observable(latitude);
	this.longitude = ko.observable(longitude);
	this.categories =  ko.observableArray();
	this.deals = ko.observableArray();
	this.loadDeals(yelpDeals);
	this.icon = ko.observable();
	this.loadCategories(yelpCategories);
	this.reviewCount = ko.observable(reviewCount);
	this.resetIcon();
};


/*
* @public
* @returns void
* @description 
*		loads deals into an array 
*/
Business.prototype.loadDeals = function (deals)
{
	this.deals.removeAll();
	var dealIx;
	var dealHtml ="";
	for (dealIx in deals)
	{
		var yelpDeal = deals[dealIx];
		if(yelpDeal)
		{
			dealHtml +="coupon: <a href='"+yelpDeal.dealUrl+"' target='_blank'>"+yelpDeal.name+"</a>  ";
		}
	}
	this.deals.push(dealHtml);
};


/*
* @public
* @returns void
* @description 
*		loads the main category headers into an array so we can use 
*		the category to filter the businesses from the list
*/
Business.prototype.loadCategories = function (categories)
{
	this.categories=[];
	var categoryIx;
	for (categoryIx in categories)
	{
		var category = categories[categoryIx];
		if(category)
		{
			this.categories.push(category);
		}
	}
};

Business.prototype.resetIcon = function()
{
	var googleMarker = GOOGLEPIN.replace(PINCHAR,this.businessIx())
									  .replace(PINCOLOR,PINRED);
	if(this.deals().length>0)
	{
		googleMarker = GOOGLEPIN.replace(PINCHAR,this.businessIx())
									  .replace(PINCOLOR,PINGREEN);
	}
	this.icon(googleMarker);
}
