
var https = require('https');
var http = require('http');

module.exports = {

  getSleep:function sleep(time, callback) {
  var stop = new Date().getTime();
  while(new Date().getTime() < stop + time) {
      var foo = 1;
  }
  callback();
},


    getResponseMock: function(request, slot, callback) {
		var mockAns = "This is an example of the mock interface response";
        callback(mockAns);
    },


      getPostcodeAPI_GET: (request, callback) => {

		var http = require('http');

		var options = {

            host: 'api.getthedata.com',
            port: 80,
            path: '/postcode/' + encodeURI(request),
            method: 'GET'
        };


        console.log("options");
        console.log(JSON.stringify(options));

        var req = http.request(options, res => {
            res.setEncoding('utf8');
            var returnData = "";
            var retlat = "";
            var retlon = "";

			if (res.statusCode != 200) {
                callback(new Error("Non 200 Response"));
            }

            res.on('data', chunk => {
                console.log("in chunk");
                returnData += chunk;

                console.log(JSON.stringify(returnData));
                var retdata = JSON.parse(returnData);
                console.log(JSON.stringify(retdata));
                retlat = JSON.parse(returnData).data.latitude;
                retlon = JSON.parse(returnData).data.longitude;
                console.log(JSON.stringify(retlat));
                console.log(JSON.stringify(retlon));

                callback(returnData);

            });



            res.on('end',  () => {
                console.log("on end");
                console.log(JSON.stringify(returnData));
                var retdata = JSON.parse(returnData);
                retlat = JSON.parse(returnData).data.latitude;
                retlon = JSON.parse(returnData).data.longitude;
                console.log(JSON.stringify(retlat));
                console.log(JSON.stringify(retlon));

                // this  API returns a JSON structure:
                callback(returnData);

            });
			res.on('error', function (e) {
                console.log("Communications error: " + e.message);
                callback(new Error(e.message));
            });
        });
        req.end();
      }
};
