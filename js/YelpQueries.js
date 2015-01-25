/*
* @class
* This file handles the yelp calls and puts everything on the google map
* 
* 
* javascript reference files
* YelpConstants.js
* Business.js
* Oauth.js
* Sha.js
* jquery.min.js
*/

/*
* @public
* @constructor
* 
* @param {loadingCompleteCallback} the function to call after loading is completed
* @param {radius} how far to expand our search
*/

var YelpQueries = function(	
			ajaxSuccessCallback,
			ajaxErrorCallback,
			loadingCompleteCallback,
			radius)
{
	this.ajaxErrorCallback = ajaxErrorCallback;
	this.ajaxSuccessCallback = ajaxSuccessCallback;
	this.radius  = radius;
	this.loadCompleteFunc = loadingCompleteCallback;
	this.yelpBusinesses  = [];
	this.offset=0; //how many businesses were loaded from yelp
};


/*
* @returns void
 * @description load the businesses  from Yelp as well as from the YelpBusinessWithDeals array
 called to start the queries to yelp
*/
YelpQueries.prototype.loadBusinesses = function()
{
	//load some businesses with dels because yelp doesn't always return these
	this.loadBusinessesWithDeals();
	
	//search yelp
	this.searchYelp(this.offset);
};


/*
* @returns void
*	@description 
*		fills our yelpData with businesses (to a maximum of 100)
*		stops searching yelp if we get more than MAXRESULTS or
*    if the previous search returned less than LIMIT(20) businesses
*/
YelpQueries.prototype.loadMoreBusinesses = function(lastSearchResultCount)
{	
	
	//check to see if we received less businesses than LIMIT (20) cause the  search has returned all businesses that matched
	//or check to see if we already have more than MAXRESULTS(100) businesses that were found
	if(lastSearchResultCount< LIMIT || this.offset >MAXRESULTS)
	{
		if(this.loadingCompleteCallback)
		{
			this.loadingCompleteCallback();
		}
	}else
	{
		this.searchYelp(this.offset);
	}
};

/*
* @returns void
*	@description 
*		when the call to yelp succeeds this parses the returned data and 
*		updates map markers
*/
YelpQueries.prototype.fillYelpData = function(data)
{
	console.log("IN PARSE YELP");
	console.log(data);
	this.loadYelpData(data, true);
	
	//search yelp again (if we can expect to get more results)
	this.loadMoreBusinesses(data.businesses.length);
};



		
/*
*  @returns void
*	@description 
*		loads the JSON data from yelp into a retailers array (for use by knockout)
*   	keeps the json data in a businesses object so that additional details can be queried at a later date
*/
YelpQueries.prototype.loadYelpData = function (yelpResponseData, append)
{

	if(!yelpResponseData)
		return;
	if(!append)
	{
		this.businesses = [];
	}
	
	var numResults  = yelpResponseData.businesses.length;
	var busCount = this.yelpBusinesses.length;
	var businessIx;
	for( businessIx in yelpResponseData.businesses)
	{
		var business = yelpResponseData.businesses[businessIx];
		if(business)
		{
			busCount++;
			business.ix = busCount; //record the order of the search results
			
			//create our data array
			var yelpBusiness = new Business(
										business.ix,
										business.id,
										business.name,
										business.url,
										business.image_url,
										this.formatAddress(business),
										business.mobile_url,
										business.rating_img_url_small,
										business.review_count,
										business.location.coordinate.latitude,
										business.location.coordinate.longitude,
										this.formatCategories(business),
										business.deals,
										business.review_count,
										business.snippet_image_url
										);
			this.yelpBusinesses.push(yelpBusiness);
			this.offset += 1;
		}
	}	
};



/*
*  @returns string
*	@description 
*			create a string corresponding to the business address
*/
YelpQueries.prototype.formatAddress = function(business)
{
	var address = "";
	address = business.location.address.join('<br/> ');
	address +='<br/>  '+business.location.city+' ';
	address +=business.location.country_code+'  ';
	address +=business.location.postal_code+'  ';
	return address;
};


/*
*  @returns string
*	@description 
*			create a string corresponding to the categories applied to the business
*/
YelpQueries.prototype.formatCategories = function(yelpBusiness)
{
	var categories = [];
	var catIx;
	for(catIx in yelpBusiness.categories)
	{
		categories.push(yelpBusiness.categories[catIx][0]);
	}
	return categories;
}


/*
* @returns long
*	@description 
*		gets the UTC time in milliseconds since 1970
*/
YelpQueries.prototype.freshTimestamp = function()
{
 return OAuth.timestamp();
};

/*
* @returns 11 random characters
*	@description 
*		gets a 11 character salt to use for encrypting the secret keys
*/
YelpQueries.prototype.freshNonce = function()
{
 return OAuth.nonce(11);
};



/*
* @returns string
*	@description 
*		fills in the YELP url with the correct search information from the form
*/
YelpQueries.prototype.getYelpParams = function(offset)
{
	var url =  YELPPARAMETERS.replace(SEARCHTERM,YELPSEARCHTERM)
								.replace(CALLBACK, this.ajaxSuccessCallback)
								.replace(RADIUSFILTER, this.radius)
								.replace(OFFSET, offset);
	return url;
};





/*
*	@returns false
*	@description 
*		initiates a call to yelp
*/
YelpQueries.prototype.searchYelp = function(offset)
{
		var signatureBaseString = "";
		var normalizedParameters = "";
		var signature = "";
		var yelpFormParams = this.getYelpParams(offset);
		var accessor = { consumerSecret: OAUTHCONSUMERSECRET
									 , tokenSecret   : OAUTHTOKENSECRET};
		var message = { method: HTTPMETHOD
									, action: YELPURI
									, parameters: OAuth.decodeForm(yelpFormParams)
									};
		message.parameters.push(["oauth_version", OAUTHVERSION]);
		message.parameters.push(["oauth_consumer_key", OAUTHCONSUMERKEY]);
		message.parameters.push(["oauth_token", OAUTHTOKEN]);
		message.parameters.push(["oauth_timestamp", this.freshTimestamp()]);
		message.parameters.push(["oauth_nonce", this.freshNonce()]);
		
		OAuth.SignatureMethod.sign(message, accessor);
		normalizedParameters = OAuth.SignatureMethod.normalizeParameters(message.parameters);
		signatureBaseString = OAuth.SignatureMethod.getBaseString(message);
		signature =  OAuth.getParameter(message.parameters, "oauth_signature");
		

		//replace GET& with GET\u0026 cause yelp fails if we leave it in
		signatureBaseString = signatureBaseString.replace("GET&", "GET\\u0026");
		
		//what we will send
		var yelpHttp = YELPURI;
		var yelpBody =  normalizedParameters
									+ "&oauth_signature="+encodeURIComponent(signature);
		var yelpUrl = yelpHttp+"?"+yelpBody;
		console.log(yelpUrl);
		
		$.ajax({
				url: yelpUrl,
				dataType: "jsonp",
				type: "GET",
				cache: true, //very very important disables the _=[timestamp] at the end of the request
				//success: function(data){
				//		console.log(data);
				//		yelpBusinesses.fillYelpData(data);
				//		},
				jsonpCallback: this.ajaxSuccessCallback,
				error: function (xhr, status, errorThrown) { yelpQuery.errorInAjax(xhr, status, errorThrown);}
			});
		return false;
};


/*
* @returns void
*	@description 
*		if the ajax call to yelp fails information is printed to the console
*/
YelpQueries.prototype.errorInAjax = function(xhr, status, errorThrown)
{
	console.log("ERROR");
	console.log(xhr+" "+status+" "+errorThrown);
	console.log("offset = "+this.offset);
	if(this.offset>MAXRESULTS)
	{
		if(this.loadCompleteFunc)
		{
			this.loadCompleteFunc();
		}
	}
};

/*
* @returns void
*	@description 
*		this has been added to show that icons will restyle themselves
*		when deals are available
*/
YelpQueries.prototype.loadBusinessesWithDeals = function()
{
	var db = [
				new Business(
				1,
				"royalty-pizza-san-francisco",
				 "Royalty Pizza",
				"http://www.yelp.com/biz/royalty-pizza-san-francisco",
				 "http://s3-media2.fl.yelpcdn.com/bphoto/D-HSxr-OUfBnl4p_p0DYKA/ms.jpg",
				"829 Geary St<br/> San Francisco US  94109  ",
				"http://m.yelp.com/biz/royalty-pizza-san-francisco",
				"http://s3-media3.fl.yelpcdn.com/assets/2/www/img/902abeed0983/ico/stars/v1/stars_small_3.png",
				45,
				37.7861099,
				-122.4169922,
				 ["Pizza"],
				  [{name:"$88 for $100","dealUrl":"http://www.yelp.com/deals/royalty-pizza-san-francisco-2"} ])
				,
				new Business(
				2,
				"greenlid-studiomix-san-francisco",
				"GreenLid Studiomix",
				"http://www.yelp.com/biz/greenlid-studiomix-san-francisco",
				 "http://s3-media1.fl.yelpcdn.com/bphoto/5m2iSkqHdFrLffcoEdXesQ/ms.jpg",
				"1000 Van Ness Ave<br/> 3rd Fl<br/>  San Francisco US  94109  ",
				"http://m.yelp.com/biz/greenlid-studiomix-san-francisco",
				"http://s3-media1.fl.yelpcdn.com/assets/2/www/img/c7623205d5cd/ico/stars/v1/stars_small_5.png",
				2,
				37.7847999335966,
				-122.421518351868,
				["Juice Bars & Smoothies", "Coffee & Tea", "Salad"],
				[  {name:"$15 for $30", dealUrl:"http://www.yelp.com/deals/greenlid-studiomix-san-francisco"}])
	];
	this.yelpBusinesses.push(db[0]);
	this.yelpBusinesses.push(db[1]);

	this.offset += 2;
};