var https = require('https');
//TODO: NEEDS TESTING
module.exports = {

  getSleep:function sleep(time, callback) {
  var stop = new Date().getTime();
  while(new Date().getTime() < stop + time) {
      var foo = 1;
  }
  callback();
},

  getLetterFromNATOAlphabet:function(word, letter) {
    var input = word;
    letter(input);
  }
};
