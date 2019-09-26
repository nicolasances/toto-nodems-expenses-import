const csv = require("csvtojson");
var moment = require('moment-timezone');

exports.do = (csvFilePath) => {

  return new Promise((success, failure) => {

    csv({delimiter: ';'}).fromFile(csvFilePath).then((data) => {

      let expenses = [];

      for (var i = 0; i < data.length; i++) {

        let values = Object.values(data[i]);

        // Check whether ',' or '.' is used as a decimal separator
        // TODO

        expenses.push({
          date: moment(values[0].replace(/\"/g, ''), 'DD/MM/YYYY').format('YYYYMMDD'),
          amount: parseFloat(values[2].replace(/\"/g, '').replace(',', '')),
          description: values[1].replace(/\"/g, ''),
          currency: 'DKK'
        });

        console.log(expenses);
        
      }

      success({expenses: expenses});

    }, failure)
  })
}

/**
 * Specifies whether the passed amount is a string that uses the ',' as a decimal separator. 
 * Does this with a simple logic: 
 *  - if there are only two chars after the comma, it's the decimal separator
 *  - if there are three chars, it's a thousand separators
 * @param {string} amount 
 */
var commaSeparator = (amount) => {

  if (!amount) return false;

  if (amount.indexOf(',') == -1) return false;

}