const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const { Lame } = require('node-lame');
const uuidv4 = require('uuid').v4;
const awsHelpers = rootRequire('/libs/awsHelpers');

async function processAndUploadAudio(audioFile) {
  const originalAudioPath = audioFile.tempFilePath;
  const originalFileExtension = path.extname(audioFile.tempFilePath);
  const filename = uuidv4().replace(/-/g, '');

  const [ audioData, mp3AudioPath ] = await Promise.all([
    _getAudioData(audioFile),
    _convertAudioToMp3(audioFile),
  ]);

  const originalAudioReadStream = fs.createReadStream(originalAudioPath);
  const mp3AudioReadStream = fs.createReadStream(mp3AudioPath);

  const [ originalUrl, mp3Url ] = await Promise.all([
    awsHelpers.uploadToS3(originalAudioReadStream, `${filename}-original${originalFileExtension}`),
    awsHelpers.uploadToS3(mp3AudioReadStream, `${filename}.mp3`),
  ]);

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

async function _getAudioData(audioFile) {
  return new Promise((resolve, reject) => {
    const command = 'audiowaveform ' +
                    `--input-filename ${audioFile.tempFilePath} ` +
                    '--output-format json ' +
                    '--bits 8 ' +
                    '--zoom 44100';

    exec(command, (error, stdout) => {
      if (error) {
        reject(error);
      }

      const data = JSON.parse(stdout);

      data.duration = data.length * (44100 / data.sample_rate);

      resolve(data);
    });
  });
}

async function _convertAudioToMp3(audioFile) {
  const pathData = path.parse(audioFile.tempFilePath);
  const convertedFilePath  = `${pathData.dir}/${pathData.name}-converted.mp3`;
  const encoder = new Lame({
    output: convertedFilePath,
  }).setFile(audioFile.tempFilePath);

  await encoder.encode();

  return convertedFilePath;
}

/*
 * Export
 */

module.exports = {
  processAndUploadAudio,
};
