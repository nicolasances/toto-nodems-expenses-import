var Controller = require('toto-api-controller');

var postUCFile = require('./dlg/PostUCFile');
var getUploads = require('./dlg/GetUploads');
var deleteAllUploads = require('./dlg/DeleteAllUploads');

var apiName = 'expenses-import';

var api = new Controller(apiName);

api.path('GET', '/uploads', getUploads);
api.path('DELETE', '/uploads', deleteAllUploads);

api.fileUploadPath('/uploads/uc', postUCFile);

api.listen();
