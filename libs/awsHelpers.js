const aws = require('aws-sdk');
const awsConfig = rootRequire('/config/aws');

/*
 * S3
 */

async function uploadToS3(streamOrBuffer, filename) {
  const s3 = new aws.S3();
  const keyPrefix = Math.random().toString(32).substring(2, 15);
  const result = await s3.upload({
    ACL: 'public-read',
    Body: streamOrBuffer,
    Bucket: awsConfig.s3FileUploadsBucket,
    Key: `${keyPrefix}/${filename}`,
  }).promise();

  return result.Location;
}

/*
 * Cloudwatch
 */

function logEvent({ event, data }) {
  console.log(JSON.stringify({
    event,
    ...data,
  }));
}



/*
 * Export
 */

module.exports = {
  uploadToS3,
  logEvent,
};
