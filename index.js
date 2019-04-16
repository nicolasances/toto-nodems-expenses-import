var Controller = require('toto-api-controller');

var postUCFile = require('./dlg/PostUCFile');

var apiName = 'card-importcsv';

var api = new Controller(apiName);

api.fileUploadPath('/files/uc/:yearMonth', postUCFile);

api.listen();
