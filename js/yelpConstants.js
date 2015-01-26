/*
* this holds all of the constants used for this program
*
* 
*/

var MENUPLUS = "+";	//shown when the menu containing businsses is collapse
var MENUMINUS = "-";	//shown when the menu is expanded
var MENUSIZE = 50;
var DEFAULTFILTER = "type words to filter list";
var CALLBACK = "<CALLBACK>";  //key word for relacing yelp parameter
var CATEGORYFILTER = "";	//yelp category filter
var DEAL = "DEAL";  //the string to filter out businesses that don't offer coupons/deals
var PINRED = "DD0000";	//color for standard pin marker
var PINGREEN = "00AA00"; //color for pin marker indicating deals on business
var PINCHAR = "<PINCHAR>"; //used to replace the number of the pin marker on the map 
var PINCOLOR = "<PINCOLOR>"; //used to replace the pin color of the marker
var GOOGLEPIN = "http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld="+PINCHAR+"|"+PINCOLOR;
var GOOGLEYELLOWICON = "http://google.com/mapfiles/ms/micons/yellow-dot.png"; //a selected pin marker
var HTTPMETHOD = "GET";
var YELPURI = "http://api.yelp.com/v2/search"; //the search URI for yelp
var RADIUSFILTER = "<RADIUSFILTER>"; //how far to search for businesses
var SEARCHTERM = "<SEARCHTERM>"; //the keyword used to find businesses
var LIMIT = 20; //yelp limits on max businesses to pull at one time
var MAXRESULTS = 100; //the number of businesses to pull (though yelp only seems to give us 40
var LATITUDE = 37.786127;//center of yelp search
var LONGITUDE =  -122.516984;////center of yelp search
var LOCATION =  "San Francisco, California USA"; //"2901 Las Vegas Blvd S  Las Vegas, NV 89109";//
var OFFSET = "<OFFSET>";
var OAUTHCONSUMERKEY = "Eqqi19ncmOaaRY8OlZMPog";
var OAUTHTOKEN = "GkjmQjkZoVeNZyAPIAiCYMl6xctechN8";
var OAUTHSIGNATUREMETHOD = "HMAC-SHA1";
var OAUTHSIGNATURE  ="<OAUTHSIGNATURE>";
var OAUTHCONSUMERSECRET = "zOLX5jD0z9NeF5BQjkkXl2KXV7A";
var OAUTHTOKENSECRET = "Vbxnk7Wr1kZI1Px7KwWhNCqatwg";
var OAUTHNONCE = "<NONCE>";
var OAUTHVERSION = "1.0";


var YELPSEARCHTERM ="food";
var MAPCENTERLONGITUDE = -122.415; //recenter the map after searching for yelp businesses
var MAPCENTERLATITUDE = 37.785448674044524; //recenter the map after searching for yelp businesses

var YELPPARAMETERS  = 
						"callback="+CALLBACK+ //this is a jsonp callback parameter
						"&category_filter="+CATEGORYFILTER+
						"&cli="+LATITUDE+","+LONGITUDE+
						"&limit="+LIMIT+
						"&location="+LOCATION+
						"&term="+SEARCHTERM+
						"&radius_filter="+RADIUSFILTER+
						"&offset="+OFFSET
						//+"&deals_filter=true"
						//"&sort=1"
						;
var ZOOM =  14;  //controls how close or far we are on the map




