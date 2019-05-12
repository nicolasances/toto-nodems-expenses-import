var config = require('../config');
var totoEventPublisher = require('toto-event-publisher');

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

      // Create the event
      let event = {
        correlationId: req.headers['x-correlation-id'],
        month: month
      }

      // If the month has been selected, publish the event
      if (month.selected) totoEventPublisher.publishEvent('trainingSessionsCreated', event);
      
    }

  });

}
