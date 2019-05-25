var Controller = require('toto-api-controller');
var totoEventPublisher = require('toto-event-publisher');

var postUCFile = require('./dlg/PostUCFile');
var getUploads = require('./dlg/GetUploads');
var deleteAllUploads = require('./dlg/DeleteAllUploads');
var confirmUploads = require('./dlg/ConfirmUploads');
var getUpload = require('./dlg/GetUpload');

var apiName = 'expenses-import';

// EVENT OUT : Uploads that get confirmed
totoEventPublisher.registerTopic({topicName: 'expensesUploadConfirmed', microservice: apiName}).then(() => {}, (err) => {console.log(err);});

var api = new Controller(apiName);

api.path('GET', '/uploads', getUploads);
api.path('DELETE', '/uploads', deleteAllUploads);
api.path('GET', '/uploads/:id', getUpload);

api.path('POST', '/uploads/confirm', confirmUploads);

api.fileUploadPath('/uploads/uc', postUCFile);

api.listen();
