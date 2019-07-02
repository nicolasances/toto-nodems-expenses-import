const csv = require("csvtojson");
var moment = require('moment-timezone');

exports.do = (csvFilePath) => {

  return new Promise((success, failure) => {

    csv({delimiter: ';'}).fromFile(csvFilePath).then((data) => {

      let expenses = [];

      for (var i = 0; i < data.length; i++) {

        let values = Object.values(data[i]);

        expenses.push({
          date: moment(values[0].replace(/\"/g, ''), 'DD/MM/YYYY').format('YYYYMMDD'),
          amount: parseFloat(values[2].replace(/\"/g, '').replace(',', '')),
          description: values[1].replace(/\"/g, '')
        });
      }

      success({expenses: expenses});

    }, failure)
  })
}
