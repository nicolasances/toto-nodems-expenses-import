var http = require('toto-request');

/**
 * This delegate is used to post a payment on the POST /expenses microservice endpoint
 */
exports.do = function(req) {

  let payment = req.body.expense;
  let correlationId = req.headers['x-correlation-id'];

  return new Promise(function(success, failure) {

      http({
        correlationId: correlationId,
        method: 'POST',
        microservice: 'toto-nodems-expenses',
        resource: '/expenses',
        body: {
          amount: Math.abs(payment.amount),
          date: payment.date,
          category: 'VARIE',
          description: payment.description,
          yearMonth: payment.date.substring(0, 6),
          currency: payment.currency ? payment.currency : 'EUR',
          user: req.body.user
        }
      }).then((data) => {success(data);}, failure);

  });

}
