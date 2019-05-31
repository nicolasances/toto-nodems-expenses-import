var mongo = require('mongodb');
var config = require('../config');
var postExpenses = require('./PostExpenses');
var totoEventPublisher = require('toto-event-publisher');

var Status = require('./Status');
var putUpload = require('./PutUpload');
var postedExpensesCheck = require('./PostedExpensesCheck');

var MongoClient = mongo.MongoClient;

/**
 * Confirms some of the months so that the expenses of that month can be posted.
 */
exports.do = function(req) {

  let correlationId = req.headers['x-correlation-id'];

  return new Promise(function(success, failure) {

    // Validation: an array called 'months' must be passed
    if (!req.body.months) {failure({code: 400, message: 'A "months" array must be passed. The array must contain the id of a previously uploaded month.'}); return;}
    if (!req.body.user) {failure({code: 400, message: 'A "user" must be passed.'}); return; }

    // Get the selected months
    for (var i = 0; i < req.body.months.length; i++) {

      let month = req.body.months[i];

      // If the month has been selected, post the expenses
      if (month.selected) {

        // 1. Set the status as "in progress"
        putUpload.do({params: {monthId: month.id}, body: {status: Status.INPROGRESS}});

        // 2. Post the expense
        totoEventPublisher.publishEvent('expensesUploadConfirmed', {
          correlationId: correlationId,
          monthId: month.id
        });

        // Start a poller to check that expenses have actually been posted
        // This will poll the /expenses API and update the status to "POSTED" when all the expenses are found
        postedExpensesCheck.do(month, req.body.user, correlationId);
      }

    }

    success({sent: true, message: 'The request has been sent and taken in charge. The expenses will appear later.'});

  });

}
