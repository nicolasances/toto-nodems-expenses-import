var mongo = require('mongodb');
var config = require('../config');
var postExpenses = require('./PostExpenses');

var MongoClient = mongo.MongoClient;

/**
 * Saves the upload to DB
 */
exports.do = function(req) {

  return new Promise(function(success, failure) {

    // Validation: an array called 'months' must be passed
    if (!req.body.months) {failure({code: 400, message: 'A "months" array must be passed. The array must contain the id of a previously uploaded month.'})}

    // Get the selected months
    for (var i = 0; i < req.body.months.length; i++) {

      let month = req.body.months[i];

      // If the month has been selected, post the expenses
      if (month.selected) postExpenses.do({headers: req.headers, body: {month: month}});

    }

    success({sent: true, message: 'The request has been sent and taken in charge. The expenses will appear later.'});

  });

}
