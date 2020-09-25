const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const { Lame } = require('node-lame');
const uuidv4 = require('uuid').v4;
const awsHelpers = rootRequire('/libs/awsHelpers');

async function processAndUploadAudio(audioFile) {
  const originalFileExtension = path.extname(audioFile.name);
  const originalWithExtensionAudioPath = `${audioFile.tempFilePath}${originalFileExtension}`;
  const filename = uuidv4().replace(/-/g, '');

  // LAME and AudioWaveForm require the extension, expressFileUpload doesn't preserve it on tmp files.
  await audioFile.mv(originalWithExtensionAudioPath);

  const [ audioData, mp3AudioPath ] = await Promise.all([
    _getAudioData(originalWithExtensionAudioPath),
    _convertAudioToMp3(originalWithExtensionAudioPath),
  ]);

  const originalAudioReadStream = fs.createReadStream(originalWithExtensionAudioPath);
  const mp3AudioReadStream = fs.createReadStream(mp3AudioPath);

  const [ originalUrl, mp3Url ] = await Promise.all([
    awsHelpers.uploadToS3(originalAudioReadStream, `${filename}-original${originalFileExtension}`),
    awsHelpers.uploadToS3(mp3AudioReadStream, `${filename}.mp3`),
  ]);

  // cleanup
  fs.unlink(originalWithExtensionAudioPath, error => { console.log(error); });

  return {
    originalUrl,
    mp3Url,
    sampleRate: audioData.sample_rate,
    duration: audioData.duration,
    waveform: audioData.data,
  };
}

/*
 * Helpers
 */

async function _getAudioData(audioFilePath) {
  return new Promise((resolve, reject) => {
    const command = 'audiowaveform ' +
                    `--input-filename ${audioFilePath} ` +
                    '--output-format json ' +
                    '--bits 8 ' +
                    '--zoom 88200';

    exec(command, (error, stdout) => {
      if (error) {
        reject(error);
      }

      const data = JSON.parse(stdout);

      data.duration = data.length * (88200 / data.sample_rate);

      resolve(data);
    });
  });
}

async function _convertAudioToMp3(audioFilePath) {
  const pathData = path.parse(audioFilePath);
  const convertedFilePath  = `${pathData.dir}/${pathData.name}-converted.mp3`;
  const encoder = new Lame({
    output: convertedFilePath,
  }).setFile(audioFilePath);

  await encoder.encode();

  return convertedFilePath;
}

/*
 * Export
 */

module.exports = {
  processAndUploadAudio,
};
