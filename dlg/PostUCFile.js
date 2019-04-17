var moment = require('moment-timezone');
var parser = require('../parser/uc/CSVParser');
var saveUpload = require('./SaveUpload');

exports.do = (req) => {

  return new Promise((success, failure) => {

    // Validation
    if (!req.params.yearMonth) {failure({code: 400, message: 'You need to provide the yearMonth YYYYMM as the last element of the path. E.g. /files/uc/201903'}); return;}

    // Get the file path
    let path = req.body.filepath;

    // Get the year month
    let yearMonth = req.params.yearMonth;

    // Parse
    parser.do(path).then((data) => {

      if (data == null || data.expenses == null || data.expenses.length == 0) {success({result: 'no-data'}); return;}

      // Extract only the expenses for the specified year month
      let expenses = [];
      let totalAmount = 0;
      for (var i = 0; i < data.expenses.length; i++) {
        if (data.expenses[i].date.substring(0, 6) == yearMonth) {
          expenses.push(data.expenses[i]);
          totalAmount += data.expenses[i].amount;
        }
      }

      // Upload
      // TODO: add the user mail
      let upload = {
        yearMonth: yearMonth,
        count: expenses.length,
        total: totalAmount,
        uploadedOn: moment().tz('Europe/Rome').format('YYYYMMDD'),
        expenses: expenses,
      }

      // Save the uploads to DB
      saveUpload.do(upload).then((data) => {

        // Update the id, remove the expenses to avoid unnecessary traffic
        upload.id = data.id;
        upload.expenses = null;

        // Return as a success
        success(upload);

      });

    }, failure);

  })
}
