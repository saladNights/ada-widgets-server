const express = require('express');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 8000;

app.use(cors());

const AWS = require('aws-sdk');
s3 = new AWS.S3({apiVersion: '2006-03-01'});

// s3.listBuckets(function(err, data) {
// 	if (err) {
// 		console.log("Error", err);
// 	} else {
// 		console.log("Success", data.Buckets);
// 	}
// });

app.get('/', (req, res) => res.send('Working'));

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
	const { s3Key } =  req.query;

	const url = s3.getSignedUrl('getObject', {
		Bucket: 'ada-file-upload-bucket',
		VersionId: s3Key,
	});

	return res.send({
		url
	});
});

app.listen(port, () => {
	console.log('Express server listening on port', port)
});
