# Bing API Wrapper for Node.js

A very simple wrapper for the Bing API (http://www.bing.com/toolbox/bingdeveloper/). Just simplifies an edge case error check and presents a simple way to set & reuse options.

Usage: 

    // set BING_APP_ID Environment Variable with a valid key!
    
    var bing = require('../lib/bing-api');
    var client = new bing.SearchClient({appId: process.env.BING_APP_ID});
    client.search("variolabs", function(error, response, data) {
  
      if (!error && response.statusCode == 200)
      {
        console.log(data.SearchResponse.Web.Results[0].Url);
      } else {
        console.log("ERROR! " + error + "/" + response.statusCode);
      }

    });
    
----

## Supported options:

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
    
## License

Provided under the The MIT License (MIT)
Copyright (c) 2011 Sujal Shah

See LICENSE for details
