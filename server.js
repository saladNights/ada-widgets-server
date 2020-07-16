const express = require('express');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 8001;

// TODO setup CORS for specific resources
app.use(cors());

const AWS = require('aws-sdk');

app.get('/', (req, res) => res.send('Working'));

app.get('/presigned-url-put-object', (req, res) => {
	const { BucketName, Key, ContentType, s3UrlExpire } =  req.query;

	const s3 = new AWS.S3({
		apiVersion: '2006-03-01',
		accessKeyId: req.headers['X-S3-P-Key'],
		secretAccessKey: req.headers['X-S3-S-Key']
	});

	const url = s3.getSignedUrl('putObject', {
		Bucket: BucketName,
		Expires: +s3UrlExpire,
		Key,
		ContentType,
	});

	return res.send({
		url
	});
});

app.get('/presigned-url-get-object', (req, res) => {
	const { BucketName, Key, s3Key, s3UrlExpire } =  req.query;

	const s3 = new AWS.S3({
		apiVersion: '2006-03-01',
		accessKeyId: req.headers['X-S3-P-Key'],
		secretAccessKey: req.headers['X-S3-S-Key']
	});

	const url = s3.getSignedUrl('getObject', {
		Bucket: BucketName,
		Expires: +s3UrlExpire,
		Key,
		VersionId: s3Key,
	});

	return res.send({
		url
	});
});

app.listen(port, () => {
	console.log('Express server listening on port', port)
});
