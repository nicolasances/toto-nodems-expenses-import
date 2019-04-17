
/**
 * Saves the upload to DB
 */
exports.do = (upload) => {

  return new Promise((success, failure) => {

    return MongoClient.connect(config.mongoUrl, function(err, db) {

      db.db(config.dbName).collection(config.collections.uploads).insertOne(upload, function(err, res) {

        db.close();

        success({id: res.insertedId});

      });

    });

  });

}
