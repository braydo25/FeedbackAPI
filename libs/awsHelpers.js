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
 * SES
 */

function sendEmail({ toEmail, fromEmail, subject, bodyHtml }) {
  const ses = new aws.SES();

  if (process.env.NODE_ENV === 'local') {
    return console.log(`Local environment - Not sending email: ${subject}`);
  }

  ses.sendEmail({
    Destination: {
      ToAddresses: [ toEmail ],
    },
    Message: {
      Subject: {
        Charset: 'UTF-8',
        Data: subject,
      },
      Body: {
        Html: {
          Charset: 'UTF-8',
          Data: bodyHtml,
        },
      },
    },
    Source: fromEmail,
  }).promise().catch(error => { /* noop */ });;
}

/*
 * Export
 */

module.exports = {
  uploadToS3,
  logEvent,
  sendEmail,
};
