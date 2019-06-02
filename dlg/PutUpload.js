var mongo = require('mongodb');
var config = require('../config');
var converter = require('../conv/UploadConverter');

var MongoClient = mongo.MongoClient;

/**
 * Saves the upload to DB
 */
exports.do = function(req) {

  return new Promise(function(success, failure) {

    // Validations
    if (!req.params.monthId) {failure({code: 400, message: 'The monthId is mandatory (path param /uploads/{monthId}).'}); return; }
    if (!req.body.status) {failure({code: 400, message: 'The status is mandatory in the body.'}); return; }

    return MongoClient.connect(config.mongoUrl, function(err, db) {

      // Create the update
      let update = {$set: {status: req.body.status, statusDescription: req.body.statusDescription}};

      // Do the update
      db.db(config.dbName).collection(config.collections.uploads).updateOne({_id: new mongo.ObjectId(req.params.monthId)}, update, function(err, res) {

        db.close();

        success({result: res});

      });

    });

  });

}
