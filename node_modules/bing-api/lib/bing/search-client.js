/*!
 * Bing Search Client for Node.js
 * Copyright(c) 2011 Sujal Shah <sujal@variolabs.com>
 * Source covered by the MIT License
 * 
 * Portions from or inspired by the twitter-node library by
 * Jeff Waugh (https://github.com/jdub/node-twitter)
 * including the constructor/options storage
 *
 */
 
var request = require('request')
  , url = require('url')
  , querystring = require('querystring')
  , _ = require('underscore');
 
exports = module.exports;
 
var SearchClient = function(options)
{
  if (!(this instanceof SearchClient)) return new SearchClient(options);
 
  var defaults = {
    /*
     * Should be a space delimited list of valid bing sources:
     * Image, News, PhoneBook, RelatedSearch, Spell, Translation,
     * Video, Web
     */
    sourceList: "web"
    /*
     * App ID from Bing Dev Portal: http://www.bing.com/toolbox/bingdeveloper/
     */
    , appId: null
    
    /*
     * Base URL for API, includes the question mark
     */
    , baseUrl: "http://api.bing.net/json.aspx?"
    
    /*
     * API Version
     */
    , bingApiVersion: "2.2"
    
    /*
     * Bing API Market
     */
    , bingApiMarket: "en-US"
    
    /*
     * Limit responses to this amount
     */
    , limit: 10

    /*
     * User Agent
     *
     */
    , userAgent: "Bing Search Client for Node.js ("+SearchClient.version+")"
     
  };
  
  if (options === null || typeof options !== 'object')
    options = {};
  
  // merge options passed in with defaults
  this.options = _.extend(defaults, options);

  
 
}

SearchClient.version = "0.0.1";
module.exports = SearchClient;

/*
 * search(query, options, callback)
 *
 * callback gets 3 arguments back, basically the responses from
 * the underlying request object, except that body is turned into objects
 */
SearchClient.prototype.search = function(query, options, callback) {
  
  if (typeof options === 'function') {
		callback = options;
		options = null;
	}

	if ( typeof callback !== 'function' ) {
		throw "ERROR: Callback function required, was not present or of type function";
		return this;
	}
	
	var finalOptions = this.options;
	
	if (options !== null)
	{
	  finalOptions = _.extend(this.options, options);
	}
	
	request({
	  uri: finalOptions.baseUrl + querystring.stringify({
	                                "AppId": finalOptions.appId,
	                                "Version": finalOptions.bingApiVersion,
	                                "Sources": finalOptions.sourceList,
	                                "Web.Count": finalOptions.limit,
	                                "Query": query
	                              })
	  , method: finalOptions.method || "GET"
	  , headers: {
	    "User-Agent": finalOptions.userAgent
	    }
	  , timeout: 2000
	}, function(error, response, body){
	  if (!error && response.statusCode >= 200 && response.statusCode < 300)
	  {
	    // error could be in the body (bing returns 200 for failed requests)
	    var data = JSON.parse(body);
	    if (data && data.SearchResponse.Errors && data.SearchResponse.Errors.length > 0)
	    {
        error = new Error("Bing API Error ("+data.SearchResponse.Errors.length+" errors): See remoteErrors property for details");
        error.remoteErrors = data.SearchResponse.Errors;
	    }
	    callback(error, response, JSON.parse(body));
	  } else {
	    // probably should do something interesting here...
	    callback(error, response, body);
	  }
	});
  
}
 