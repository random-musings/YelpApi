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
			loadingCompleteCallback,
			radius)
{
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
	//load businesses with deals
	//var ix;
	//for (	ix in YelpBusinessDeals)
	//{
	//	this.yelpBusinesses.push(YelpBusinessDeals[ix]);
	//	this.offset++;
	//}
	
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
	yelpBusinesses.loadYelpData(data, true);
	
	//search yelp again (if we can expect to get more results)
	yelpBusinesses.loadMoreBusinesses(data.businesses.length);
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
			
			var yelpBusiness = new YelpBusiness(
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
										this.formatCategories(),
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
		categories.push(business.categories[catIx][0]);
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
								.replace(CALLBACK, "yelpBusinesses.fillYelpData")
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
				success: function(data){
						console.log(data);
						yelpBusinesses.fillYelpData(data);
						},
				jsonpCallback: "yelpBusinesses.fillYelpData",
				error: function (xhr, status, errorThrown) { yelp.errorInAjax(xhr, status, errorThrown);}
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

};


