var mongo = require('mongodb');
var config = require('../config');
var converter = require('../conv/UploadConverter');

var MongoClient = mongo.MongoClient;

/**
 * Saves the upload to DB
 */
exports.do = function(req) {

  return new Promise(function(success, failure) {

    return MongoClient.connect(config.mongoUrl, function(err, db) {

      db.db(config.dbName).collection(config.collections.uploads).find({_id: new mongo.ObjectId(req.params.monthId)}).toArray(function(err, docs) {

        db.close();

        if (docs == null || docs.length == 0) {success({}); return;}

        success(converter.toTOFull(docs[0]));

      });

    });

  });

}
