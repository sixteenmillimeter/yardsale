var search = {},
	amazon = require('amazon-product-api'),
	amClient = amazon.createClient({
		awsId: process.env.AWS_ID,
		awsSecret: process.env.AWS_SECRET,
		awsTag: process.env.AWS_TAG
	});

amClient.itemSearch({
  director: 'Quentin Tarantino',
  actor: 'Samuel L. Jackson',
  searchIndex: 'DVD',
  audienceRating: 'R',
  responseGroup: 'ItemAttributes,Offers,Images'
}).then(function(results){
  console.log(results);
}).catch(function(err){
  console.dir(err);
  console.dir(err.Error[0].Message);
});

module.exports = search;