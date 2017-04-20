# alexa-postcode
Code Repo to create a foundation code base for an Alexa skill that uses UK postcodes

### Optional code chunks (these can be disabled)

* Validate postcode against public API
* Store postcode against device profile using Dynamo DB

Project formed out of learnings from https://github.com/robm26/Cookbook/tree/master/Workshop/HelloWorld


##Known issues

**Outer postcode - S E twenty-two    (ok)
S E two two (not handled) neither 4 character postcodes, letter, letter, number, letter SW1V  (or S W one V)
Military alphabet not yet handled**
