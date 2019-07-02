var moment = require('moment-timezone');
var parser = require('../parser/UniCreditCSVParser');
var saveUpload = require('./SaveUpload');

exports.do = (req) => {

  return new Promise((success, failure) => {

    // Validation
    if (!req.query.user) {failure({code: 400, message: 'The user is mandatory (query param) to upload expenses.'}); return; }

    // Get the file path
    let path = req.body.filepath;

    // Parse
    parser.do(path).then((data) => {

      if (data == null || data.expenses == null || data.expenses.length == 0) {success({result: 'no-data'}); return;}

      // Extract the expenses and cluster them per yearMonth
      let months = aggregatePerYearMonth(data.expenses, req.query.user);

      // Save the uploads to DB
      saveUpload.do({months: months}).then((data) => {

        // Create the result
        let result = {months: []};

        for (var i = 0; i < months.length; i++) {
          result.months.push({
            id: data.ids[i],
            yearMonth: months[i].yearMonth,
            uploadedOn: months[i].uploadedOn,
            total: months[i].total,
            count: months[i].count,
            currency: months[i].currency
          })
        }

        // Return as a success
        success(result);

      });

    }, failure);

  })
}

/**
 * Divide the expenses per yearMonth
 * Returns a [{yearMonth, uploadedOn, expenses: [], total, count}, {}, ...]
 */
var aggregatePerYearMonth = (expenses, user) => {

  let date = moment().tz('Europe/Rome').format('YYYYMMDD');

  let months = {};

  for (var i = 0; i < expenses.length; i++) {

    let expense = expenses[i];

    // Define year month
    let yearMonth = expense.date.substring(0, 6);

    if (months[yearMonth] == null) months[yearMonth] = {
      yearMonth: yearMonth,
      uploadedOn: date,
      expenses: [],
      total: 0,
      count: 0,
      user: user,
      currency: 'EUR'
    };

    months[yearMonth].expenses.push(expense);
    months[yearMonth].total += expense.amount;
    months[yearMonth].count++;
  }

  return Object.values(months);

}
