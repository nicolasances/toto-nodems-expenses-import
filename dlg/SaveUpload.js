var mongo = require('mongodb');
var config = require('../config');

var MongoClient = mongo.MongoClient;

/**
 * Saves the upload to DB
 */
exports.do = function(upload) {

  return new Promise(function(success, failure) {

    return MongoClient.connect(config.mongoUrl, function(err, db) {

      console.log(upload);

      db.db(config.dbName).collection(config.collections.uploads).insertMany(upload, function(err, res) {

        console.log(err);
        console.log(res);

        db.close();

        success({ids: res.insertedIds});

      });

    });

  });

}
