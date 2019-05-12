var mongo = require('mongodb');
var config = require('../config');
var converter = require('../conv/UploadConverter');
var postExpense = require('./PostExpense');

var MongoClient = mongo.MongoClient;

/**
 * Post expenses
 * Expenses a req.body.month = {id: 'hash'}
 */
exports.do = function(req) {

  return new Promise(function(success, failure) {

    return MongoClient.connect(config.mongoUrl, function(err, db) {

      db.db(config.dbName).collection(config.collections.uploads).find({id: req.body.month.id}).toArray(function(err, docs) {

        db.close();

        if (docs == null) return;

        let month = docs[0];
        let expenses = month.expenses;

        if (expenses == null) return;

        for (var i = 0; i < expenses.length; i++) {

          // Create the expense
          postExpense.do({headers: req.headers, body: expenses[i]});

        }

        success({sent: true});

      });

    });

  });

}
