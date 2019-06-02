var mongo = require('mongodb');
var config = require('../config');

var MongoClient = mongo.MongoClient;

/**
 * Deletes all uploads that don't have a status set
 */
exports.do = function(req) {

  return new Promise(function(success, failure) {

    // User check
    if (!req.query.user) {failure({code: 400, message: 'The user is mandatory (query param) to upload expenses.'}); return; }

    return MongoClient.connect(config.mongoUrl, function(err, db) {

      db.db(config.dbName).collection(config.collections.uploads).deleteMany({user: req.query.user, status: null}).then(() => {

        db.close();

        success({deleted: true});

      }, failure);

    });

  });

}
