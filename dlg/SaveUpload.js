var mongo = require('mongodb');
var config = require('../config');

var MongoClient = mongo.MongoClient;

/**
 * Saves the upload to DB
 */
exports.do = function(upload) {

  return new Promise(function(success, failure) {

    return MongoClient.connect(config.mongoUrl, function(err, db) {

      console.log(err);
      console.log(db);

      db.db(config.dbName).collection(config.collections.uploads).insertOne(upload, function(err, res) {

        db.close();

        success({id: res.insertedId});

      });

    });

  });

}
