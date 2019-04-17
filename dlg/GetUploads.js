var mongo = require('mongodb');
var config = require('../config');
var converter = require('../conv/UploadConverter');

var MongoClient = mongo.MongoClient;

/**
 * Saves the upload to DB
 */
exports.do = function(upload) {

  return new Promise(function(success, failure) {

    return MongoClient.connect(config.mongoUrl, function(err, db) {

      db.db(config.dbName).collection(config.collections.uploads).find().toArray(function(err, docs) {

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
