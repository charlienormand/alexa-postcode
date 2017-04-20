var Alexa = require('alexa-sdk');
var CallAPIs = require("./CallAPIs");
var cardTitle = "Postcode Check";
var userName = null;
var alexa;

exports.handler = function(event, context, callback){

	  alexa = Alexa.handler(event, context);
    //alexa.appId = "amzn1.ask.skill.x81f7354-e649-432d-a77c-23f6287eb11d";
	  alexa.dynamoDBTableName = 'postcodeUsers';
    alexa.registerHandlers(handlers);
    alexa.execute();
    };

var handlers = {
    'LaunchRequest': function () {

		// fetch user name
		if (this.attributes['userName'])
		{
			userName = this.attributes['userName'];
		}

		// check postcode record
		if (this.attributes['outerPostcodeVerbatim'])
		{
			if (!this.attributes['innerPostcodeVerbatim'])
			{
				//Clear postcode
				this.attributes['postcode'] = [];
			}
		}
		else
		{
			//Clear postcode
			this.attributes['postcode'] = [];
		}

		var say = 'Please wait whilst I intialise';
		if (userName == null) { // no slot
            say = 'Welcome, please tell me your name, for example, you can say / / my name is Natasha.';
        }
		else
		{
			if (this.attributes['postcode'])
			{
			     var location = 	" your profile has you at " + '<say-as interpret-as="spell-out">' + this.attributes['postcode'] + '</say-as>';
			     say = 'Welcome, ' + userName + location;
			}
			else
			{
            // create and store session attributes
            say = 'Welcome, ' + userName;
			}
    }
		console.log("LaunchRequest requestId=" + this.event.request.requestId
        + ", sessionId=" + this.event.session.sessionId);

        //if no amazon token, return a LinkAccount card
        /*if (alexa.event.session.user.accessToken == undefined) {

		alexa.emit(':tellWithLinkAccountCard',
                       'to start using this skill, please use the companion app to authenticate on Amazon');
            return;
        }*/

		this.emit(':ask', say, 'please specify your action');
  },

	'MyNameIsIntent': function() {
		console.log("MyNameIsIntent");
        userName = this.event.request.intent.slots.firstname.value;
        var say = "";

        if (userName == null) { // no slot
            say = 'You can tell me your name, for example, you can say / / my name is Natasha.';
        }
		else {
            // create and store session attributes
            this.attributes['userName'] = userName;
            say = 'Hi ' + userName;
        }

        this.emit(':ask', say, 'try again');
    },

	'MyPostcodeOneIsIntent': function() {
		   console.log("MyPostcodeOneIsIntent");
		   console.log(this.event.request.intent.slots.PostCodeCharOne.value);
		   console.log(this.event.request.intent.slots.PostCodeCharTwo.value);

		   var store = this.event.request.intent.slots.PostCodeCharOne.value + this.event.request.intent.slots.PostCodeCharTwo.value;
		   var response = '<say-as interpret-as="spell-out">' + store + '</say-as>';
       var first2 = response; // "Confirm, " + response;
		   var first3 = first2;

		   if (this.event.request.intent.slots.PostCodeCharThree.value) {
			if (undefined != this.event.request.intent.slots.PostCodeCharThree.value) {
			   console.log("3: " + this.event.request.intent.slots.PostCodeCharThree.value);
			   first3 = this.event.request.intent.slots.PostCodeCharThree.value;
			   response = first2 + '<say-as interpret-as="spell-out">' + first3 + '</say-as>';
			   store = store + this.event.request.intent.slots.PostCodeCharThree.value;
			}
		   }
		   this.attributes['outerPostcodeVerbatim'] = store;

		   console.log(response);

           this.emit(':ask', response, 'try again');

    },
	'MyPostcodeTwoIsIntent': function() {
		   console.log("MyPostcodeTwoIsIntent");
		   var postcode = "SE17NA";
		   //PostCodeCharFour deprecated because assume that a double digit first half would be captured as a double digit number
		   console.log(this.event.request.intent.slots.PostCodeCharFive.value);
		   console.log(this.event.request.intent.slots.PostCodeCharSix.value);
		   console.log(this.event.request.intent.slots.PostCodeCharSeven.value);
		   var store = this.event.request.intent.slots.PostCodeCharFive.value + this.event.request.intent.slots.PostCodeCharSix.value  + this.event.request.intent.slots.PostCodeCharSeven.value;

		   var response = '<say-as interpret-as="spell-out">' + store + '</say-as>';
		   var last3 = store; //"Confirm,  " + store;

		   //TODO if a value is underfined or not length 3 characters
		   this.attributes['innerPostcodeVerbatim'] = store;

		   console.log(response);

		   if(this.attributes['outerPostcodeVerbatim'])
		   {
			postcode = this.attributes['outerPostcodeVerbatim'] + store;
			console.log(postcode);
			this.attributes['postcode'] = postcode;
		   }
       //Fallback
       var lat = 51.5081;
       var lon = -0.1248;
       say = "Assuming lat long of charing cross london, "

			CallAPIs.getPostcodeAPI_GET(postcode, apiResponse => {
           console.log(JSON.stringify(apiResponse));
           lat = JSON.parse(apiResponse).data.latitude;
           lon = JSON.parse(apiResponse).data.longitude;
           //lon = JSON.stringify(apiResponse.data.longitude);
          console.log("Lat: " + lat);
          console.log("Long: " + lon);
          //console.log("Long: " + lon);
           say = "Based on your set postcode, " + '<say-as interpret-as="spell-out">' +  postcode + '</say-as>';
           console.log(say);
           this.attributes['postcodeResponselat'] = lat;
           this.attributes['postcodeResponselon'] = lon;
           say = say + " you are roughly at " + lat + " latitude, and " + lon + " longitude";

           this.emit(':tell', say, 'try again');
        });
    },
	'AMAZON.YesIntent': function () {
	       // CallAPIs.getResponseAPI_GET('confirm', '', apiResponse => {
          //  say = apiResponse.response;
            say = "Affirmative"
            console.log("say = " + say);
            this.emit(':ask', say, 'try again');
        //});
    },
	'AMAZON.NoIntent': function () {
            //CallAPIs.getResponseAPI_GET('no', '', apiResponse => {
            //say = apiResponse.response;
            //console.log("say = " + say);
            this.emit(':tell', "negative", 'try again');
       // });
    },

    'AMAZON.HelpIntent': function () {
        var say = 	" I think you are at " + this.attributes['postcode'];

        postcode = this.attributes['postcode'];
        console.log(postcode);

        var lat = 51.5081;
        var lon = -0.1248;

        say = "default lat long used"

         CallAPIs.getPostcodeAPI_GET(postcode, apiResponse => {
           console.log(JSON.stringify(apiResponse));
           lat = JSON.parse(apiResponse).data.latitude;
           lon = JSON.parse(apiResponse).data.longitude;
           //lon = JSON.stringify(apiResponse.data.longitude);
          console.log("Lat: " + lat);
          console.log("Long: " + lon);
          //console.log("Long: " + lon);
           say = "You can set a postcode by saying, my outer postcode is, and then the first part, but based on your current set postcode of, " + '<say-as interpret-as="spell-out">' +  postcode + '</say-as>';
           console.log(say);
           this.attributes['postcodeResponselat'] = lat;
           this.attributes['postcodeResponselon'] = lon;

           say = say + " you are roughly at " + lat + " latitude, and " + lon + " longitude";

           this.emit(':ask', say, 'do you want to try');


         });
    },
	'AMAZON.StopIntent': function () {
       this.emit(':tell', 'Goodbye');
	},
	'AMAZON.StartOverIntent': function () {
		this.attributes['skillHistory'] = [];
        this.emit(':ask', 'Start again', 'try again');
    },
	'AMAZON.RepeatIntent': function () {
        this.emit(':ask', 'Start over', 'try again');
    },
	'AMAZON.CancelIntent': function () {
       this.emit(':tell', 'Goodbye');
	},
    "Unhandled": function () {
        var speechOutput = "unhandled interaction, sorry";
        this.emit(":ask", speechOutput, speechOutput);
    }



}
// end of handlers
// ---------------------------------------------------  User Defined Functions ---------------
