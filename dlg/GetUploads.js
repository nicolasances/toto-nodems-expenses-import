var mongo = require('mongodb');
var config = require('../config');
var converter = require('../conv/UploadConverter');

var MongoClient = mongo.MongoClient;

/**
 * Saves the upload to DB
 */
exports.do = function(req) {

  return new Promise(function(success, failure) {

    // User check
    if (!req.query.user) {failure({code: 400, message: 'The user is mandatory (query param) to upload expenses.'}); return; }

    return MongoClient.connect(config.mongoUrl, function(err, db) {

      db.db(config.dbName).collection(config.collections.uploads).find({user: req.query.user}).sort({yearMonth: -1}).toArray(function(err, docs) {

        db.close();

        let months = [];
        for (var i = 0; i < docs.length; i++) {
          months.push(converter.toTO(docs[i]));
        }

        success({months: months});

      });

    });

  });

}
