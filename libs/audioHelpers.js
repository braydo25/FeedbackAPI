const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const audiowaveformPath = (process.env.NODE_ENV === 'production') ? `${__dirname}/../bin/audiowaveform` : 'audiowaveform';
const ffmpegPath = require('ffmpeg-static');
const uuidv4 = require('uuid').v4;
const awsHelpers = rootRequire('/libs/awsHelpers');

async function processAndUploadAudio(audioFile) {
  const originalFileExtension = path.extname(audioFile.name);
  const originalWithExtensionAudioPath = `${audioFile.tempFilePath}${originalFileExtension}`;
  const filename = uuidv4().replace(/-/g, '');

  // LAME and AudioWaveForm require the extension, expressFileUpload doesn't preserve it on tmp files.
  await audioFile.mv(originalWithExtensionAudioPath);

  const mp3AudioPath = await _convertAudioToMp3(originalWithExtensionAudioPath);
  const audioData = await _getAudioData(mp3AudioPath);

  const originalAudioReadStream = fs.createReadStream(originalWithExtensionAudioPath);
  const mp3AudioReadStream = fs.createReadStream(mp3AudioPath);

  const [ originalUrl, mp3Url ] = await Promise.all([
    awsHelpers.uploadToS3(originalAudioReadStream, `${filename}-original${originalFileExtension}`),
    awsHelpers.uploadToS3(mp3AudioReadStream, `${filename}.mp3`),
  ]);

  // cleanup
  fs.unlink(originalWithExtensionAudioPath, error => console.log(error));

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
  const command = `${audiowaveformPath} ` +
                  `--input-filename ${audioFilePath} ` +
                  '--output-format json ' +
                  '--bits 8 ' +
                  '--zoom 44100';

  return new Promise((resolve, reject) => {
    exec(command, (error, stdout) => {
      if (error) {
        reject(error);
      }

      const data = JSON.parse(stdout);
      const waveformPeak = data.data.reduce((waveformPeak, wave) => {
        return (Math.abs(wave) > waveformPeak) ? Math.abs(wave) : waveformPeak;
      }, 0);

      data.duration = data.length * (44100 / data.sample_rate);
      data.data = data.data.map(wave => Math.floor((Math.abs(wave) / waveformPeak) * 100));

      resolve(data);
    });
  });
}

async function _convertAudioToMp3(audioFilePath) {
  const pathData = path.parse(audioFilePath);
  const convertedFilePath  = `${pathData.dir}/${pathData.name}-converted.mp3`;
  const command = `${ffmpegPath} ` +
    `-i ${audioFilePath} ` +
    '-codec:a libmp3lame ' +
    '-qscale:a 2 ' +
    convertedFilePath;

  return new Promise((resolve, reject) => {
    exec(command, error => {
      if (error) {
        reject(error);
      }

      resolve(convertedFilePath);
    });
  });
}

/*
 * Export
 */

module.exports = {
  processAndUploadAudio,
};
