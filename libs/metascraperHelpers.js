const metascraper = require('metascraper')([
  require('metascraper-audio')(),
  require('metascraper-media-provider')(),
  require('metascraper-soundcloud')(),
  require('metascraper-youtube')(),
]);

async function extractMetadata(html, url) {
  return metascraper({ html, url });
}

/*
 * Export
 */

module.exports = { extractMetadata };
