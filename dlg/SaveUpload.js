var mongo = require('mongodb');
var config = require('../config');

var MongoClient = mongo.MongoClient;

console.log(config);

/**
 * Saves the upload to DB
 */
exports.do = function(upload) {

  console.log(config);

  return new Promise((success, failure) => {

    return MongoClient.connect(config.mongoUrl, function(err, db) {

      db.db(config.dbName).collection(config.collections.uploads).insertOne(upload, function(err, res) {

        db.close();

        success({id: res.insertedId});

      });

    });

  });

}
