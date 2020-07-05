const express = require('express');
const app = express();
const cors = require('cors');
const port = 3001;

app.use(cors());
app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", '*');
	res.header("Access-Control-Allow-Credentials", true);
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
	res.header("Access-Control-Allow-Headers", 'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json');
	next();
});

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
