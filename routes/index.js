var express = require('express');
var router = express.Router();
var path = require('path');
var fs = require('fs');
var data = require(path.join(__dirname, '../public/data/data.json'));

/* GET home page. */
router.get('/', function(req, res, next) {
	var files = [{
		id: 'testVertShader',
		path: path.join(__dirname, '../shaders/testvert.vsh')
	},
	{
		id: 'testFragShader',
		path: path.join(__dirname, '../shaders/testfrag.fsh')
	}];
	getFiles(files, function(shaders) {
		res.render('index', { shaders: shaders, data: data });
	});
});

function getFiles(files, callback, data) {
	if(typeof data === 'undefined') data = [];
	if(files.length === 1) {
		var file = files.pop();
		fs.readFile(file.path, function(err, shader) {
			data.push('<script type="x-shader/x-shader" id="' + file.id + '">' + shader + '</script>');
			callback(data);
		});
	}
	else {
		var file = files.pop();
		fs.readFile(file.path, function(err, shader) {
			data.push('<script type="x-shader/x-shader" id="' + file.id + '">' + shader + '</script>');
			getFiles(files, callback, data);
		});
	}
}
module.exports = router;
