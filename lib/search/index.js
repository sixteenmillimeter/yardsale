var search = {},
	RateLimiter = require('limiter').RateLimiter,
	limiter = new RateLimiter(1, 'second'),
	amazon = require('amazon-product-api'),
	amClient = amazon.createClient({
		awsId: process.env.AWS_ID,
		awsSecret: process.env.AWS_SECRET,
		awsTag: process.env.AWS_TAG
	});

search.records = function (searchTerms, cb) {
	'use strict';
	var options = {
		searchIndex : 'Music'
	},
	filtered,
	keys,
	i;

	limiter.removeTokens(1, function(err, remainingRequests) {
	  // err will only be set if we request more than the maximum number of
	  // requests we set in the constructor
	  // remainingRequests tells us how many additional requests could be sent
	  // right this moment
		if (err) {
			cb(err);
		} else {
			keys = Object.keys(searchTerms);
			for (i = 0; i < keys.length; i++) {
				options[keys[i]] = searchTerms[keys[i]];
			}
			amClient.itemSearch(options, function(err, results, response) {
			  if (err) {
			    cb(err);
			  } else {
					filtered = results.filter(recordFilter);
					//console.dir(results[0].ItemAttributes);
					cb(null, filtered, response);
			  }
			});
		}
	});
};

var recordFilter = function (elem) {
	'use strict';
	if (typeof elem.ItemAttributes !== 'undefined') {
		return elem;
	}
};

module.exports = search;

/*
client.itemSearch({
  director: 'Quentin Tarantino',
  actor: 'Samuel L. Jackson',
  searchIndex: 'DVD',
  audienceRating: 'R',
  responseGroup: 'ItemAttributes,Offers,Images'
}, function(err, results, response) {
  if (err) {
    console.log(err);
  } else {
    console.log(results);  // products (Array of Object)
    console.log(response); // response (Array where the first element is an Object that contains Request, Item, etc.)
  }
});

CDs & Vinyl	Music	301668
psrank

salesrank

price

-price

titlerank

-titlerank

artistrank

orig-rel-date

-orig-rel-date

release-date

releasedate

-releasedate

relevancerank
Artist

Availability

ItemPage

Keywords

MaximumPrice

MerchantId

MinPercentageOff

MinimumPrice

Sort

Title

----
 [ 'The value you specified for SearchIndex is invalid. Valid values include [\n\t\t\t\t\'All\',\'Wine\',\'Wireless\',\'ArtsAndCrafts\',\'Miscellaneous\',\'Electronics\',\'Jewelry\',\'MobileApps\',\'Photo\',\'Shoes\',\'KindleStore\',\'Automotive\',\'Vehicles\',\'Pantry\',\'MusicalInstruments\',\'DigitalMusic\',\'GiftCards\',\'FashionBaby\',\'FashionGirls\',\'GourmetFood\',\'HomeGarden\',\'MusicTracks\',\'UnboxVideo\',\'FashionWomen\',\'VideoGames\',\'FashionMen\',\'Kitchen\',\'Video\',\'Software\',\'Beauty\',\'Grocery\',,\'FashionBoys\',\'Industrial\',\'PetSupplies\',\'OfficeProducts\',\'Magazines\',\'Watches\',\'Luggage\',\'OutdoorLiving\',\'Toys\',\'SportingGoods\',\'PCHardware\',\'Movies\',\'Books\',\'Collectibles\',\'Handmade\',\'VHS\',\'MP3Downloads\',\'Fashion\',\'Tools\',\'Baby\',\'Apparel\',\'Marketplace\',\'DVD\',\'Appliances\',\'Music\',\'LawnAndGarden\',\'WirelessAccessories\',\'Blended\',\'HealthPersonalCare\',\'Classical\'\n\t\t\t\t].' ] }

*/
