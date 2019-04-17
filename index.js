var Controller = require('toto-api-controller');

var postUCFile = require('./dlg/PostUCFile');

var apiName = 'expenses-import';

var api = new Controller(apiName);

api.fileUploadPath('/uploads/uc', postUCFile);

api.listen();
