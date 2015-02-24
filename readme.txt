
Git Repostitory
https://github.com/random-musings/YelpApi

How to use
A working demo of the map is here 
http://www.scr-inc.com/nmap/index.html
copy the above link into the address bar of a web browser like firefox, chrome or ie

To customize this for your website you need to switch out the yelp API Keys
The following variables in the yelpConstants.js need to be changed
	var OAUTHCONSUMERKEY = "Eqqi19ncmOaaRY8OlZMPog";
	var OAUTHTOKEN = "GkjmQjkZoVeNZyAPIAiCYMl6xctechN8";
	var OAUTHCONSUMERSECRET = "zOLX5jD0z9NeF5BQjkkXl2KXV7A";
	var OAUTHTOKENSECRET = "Vbxnk7Wr1kZI1Px7KwWhNCqatwg";

Dependancies
google map API
https://developers.google.com/maps/documentation/javascript/examples/streetview-simple

Yelp API 
http://www.yelp.com/developers/documentation/v2/search_api

* the yelp api hooks the keys to a domain. To use your own keys simply change 
  the following variables in the yelpConstants.js
	var OAUTHCONSUMERKEY = "Eqqi19ncmOaaRY8OlZMPog";
	var OAUTHTOKEN = "GkjmQjkZoVeNZyAPIAiCYMl6xctechN8";
	var OAUTHCONSUMERSECRET = "zOLX5jD0z9NeF5BQjkkXl2KXV7A";
	var OAUTHTOKENSECRET = "Vbxnk7Wr1kZI1Px7KwWhNCqatwg";

Knockout js 
http://www.knockoutjs.com

Oauth Library (for connecting to Yelp)
https://developers.google.com/accounts/docs/OAuth2

How it works

this application searches yelp for businesses in the San francisco area.
markers are place on the google map indicating the location of each business.
The businesses are shown in a list view.
The list view is initially collapsed.
CLicking on the + icon will expand the list and show the items
The + icon will changed to a - icon. clicking on the minus icon will collapse the menu.

The markers are clickable and display address information as well as
link to the reviews that this restaurant has received.

The user can scroll through the list 
The list and map markers can be filtered by 
1. typing text into the "filter:" textbox.
2. clicking of the "coupons" check box.

Filtering the results
The business list is changed to match the "filter" when three or more characters are typed
into the filter text box.  
The filter matches on the following criteria
1. business name
2. yelp category
3. address

If "include deals" is checked off the business will be shown if 
the business has deals.


Map Markers
Markers have been placed on the map to show the location of the restaurant on the map
Clicking on a marker brings up an info that displays
	1. a picture of the cuisine/restaurant
	2. the address of the restaurant
	3. the number of reviews posted to the restaurant
	4. a link to the restaurants yelp review page.
	5. a link to the yelp deals
The selected marker changes to yellow.

A restaurant marker will be red unless deals/coupons are available.
Restaurants with deals/coupons will have a green marker.

Navigation
* The map can be zoomed in or out
* The markers can be clicked on to provide additional 
  information and links to the restaurants yelp page
* The business name in the list is clickable it will bring up the restaurants yelp window.



MVVM 
knockout Model is kept in the class YelpResultsView.
the data retreived from yelp is help int he YelpData class in the  businesses array.
the YelpResultsView is loaded/unloaded according to the actions taken by the user.
The YelpData businesses array never changes once data has been downloaded from Yelp.


Additional Notes
in order to display the "Deals" functionality I have manually added yelp restaurants with  deals.

If the google map does not initialize correctly or Yelp is not available
an error message is printed in the area where the filter text box is found


Javascript files

c:\git\Project5_yelp\js\Business.js
	this class is the Knockout observable class that is holding our data downloaded from yelp

c:\git\Project5_yelp\js\GoogleMap.js
	this class handles the google map load, google marker display and info window display
	it is called upon intialzation to create the google map

c:\git\Project5_yelp\js\Manager.js
	this is the manager class that coordiantes the knockout   front end with the data
	upon initialization it is sent a link to the map and the list of yelp businesses

c:\git\Project5_yelp\js\yelpConstants.js
	this is a file of constan variables used to manage the application
	
c:\git\Project5_yelp\js\YelpQueries.js
	this file sends asynchronous calls to yelp

Javascript	LIBRARIES

Jquery
c:\git\Project5_yelp\js\libs\jquery.min.js

Knockout
c:\git\Project5_yelp\js\libs\knockout-3.2.0.js
c:\git\Project5_yelp\js\libs\knockout.simpleGrid.3.0.js

OAuth2 library (constructs our calls to yelp)
c:\git\Project5_yelp\js\libs\oauth.js
c:\git\Project5_yelp\js\libs\sha1.js


