const express = require('express');
const app = express();
const cors = require('cors');
const port = 3001;

conf = {
	// look for PORT environment variable,
	// else look for CLI argument,
	// else use hard coded value for port 8080
	port: process.env.PORT || process.argv[2] || 8080,

	// origin undefined handler
	// see https://github.com/expressjs/cors/issues/71
	originUndefined: function (req, res, next) {

		if (!req.headers.origin) {
			res.json({
				mess: 'Hi you are visiting the service locally. If this was a CORS the origin header should not be undefined'
			});

		} else {
			next();
		}

	},
	// Cross Origin Resource Sharing Options
	cors: {
		// origin handler
		origin: function (origin, cb) {
			// setup a white list
			let wl = ['http://localhost:3000', 'https://saladnights.github.io'];
			if (wl.indexOf(origin) !== -1) {
				cb(null, true);
			} else {
				cb(new Error('invalid origin: ' + origin), false);
			}
		},
		optionsSuccessStatus: 200
	}

};

app.use(conf.originUndefined, cors(conf.cors));

const AWS = require('aws-sdk');
s3 = new AWS.S3({apiVersion: '2006-03-01'});

// s3.listBuckets(function(err, data) {
// 	if (err) {
// 		console.log("Error", err);
// 	} else {
// 		console.log("Success", data.Buckets);
// 	}
// });

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));

app.get('/presigned-url-put-object', (req, res) => {
	const { Key, ContentType } =  req.query;

	const url = s3.getSignedUrl('putObject', {
		Bucket: 'ada-file-upload-bucket',
		Expires: 60 * 5,
		Key,
		ContentType,
	});

	return res.send({
		url
	});
});

app.get('/presigned-url-get-object', (req, res) => {
	const { Key } =  req.query;

	const url = s3.getSignedUrl('getObject', {
		Bucket: 'ada-file-upload-bucket',
		Key,
	});

	return res.send({
		url
	});
});
