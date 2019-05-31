var http = require('toto-request');
var logger = require('toto-logger');
var getUpload = require('./GetUpload');
var putUpload = require('./PutUpload');

exports.do = (month, user, correlationId) => {

  // 1. Get the month data (including the expenses)
  getUpload.do({params: {monthId: month.id}}).then((data) => {

    let expensesCount = data.expenses.length;

    // Done will be true when the actual count equals the expected count
    let done = false;
    let numberOfPolls = 0;
    let maxPolls = 20;

    // 2. Start polling until we get a result
    // Poll for a maximum timeout, after that the poll will have to be restarted manually if necessary
    // Polling function
    var poll = () => {

      numberOfPolls++;

      logger.compute(correlationId, 'Polling on /expenses for month [' + data.yearMonth + '], monthId [' + month.id + '], tentative [' + numberOfPolls + ']', 'info');

      // Perform the API call
      http({
        correlationId: correlationId,
        microservice: 'toto-nodems-expenses',
        method: 'GET',
        resource: '/expenses?user=' + user + '&yearMonth=' + data.yearMonth
      }).then((expensesData) => {

        if (expensesData == null || expensesData.expenses == null) return;

        // Number of expenses with the given monthId in additionalData
        let actualCount = 0;

        for (var i = 0 ; i < expensesData.expenses.length; i++) {

          if (expensesData.expenses[i].additionalData && expensesData.expenses[i].additionalData.monthId === month.id) actualCount++;

        }

        // Check coherency of the count and eventually update the status
        if (actualCount == expensesCount) {
          // Log
          logger.compute(correlationId, 'Found all the expenses for month [' + data.yearMonth + '], monthId [' + month.id + ']', 'info');
          // Update
          putUpload.do({params: {monthId: month.id}, body: {status: Status.POSTED}});
        }
        else if (actualCount > expensesCount) {
          // Log
          logger.compute(correlationId, 'Too many expenses found for month [' + data.yearMonth + '], monthId [' + month.id + ']: ' + actualCount + ' (expected ' + expensesCount + ')', 'info');
          // Update
          putUpload.do({params: {monthId: month.id}, body: {status: Status.INCONSISTENT}});
        }
        else if (numberOfPolls < maxPolls) {
          setTimeout(poll, 2000);
        }

      }, (err) => {
        logger.compute(correlationId, 'Error calling /expenses for month [' + data.yearMonth + ']', 'error');
      });

    }

    setTimeout(poll, 1000);

  })


}
