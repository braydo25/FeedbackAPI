/*
 * JSON Handler for multipart/form-data requests.
 */

module.exports = (request, response, next) => {
  const contentType = request.get('content-type');

  if (!contentType || !contentType.includes('multipart/form-data')) {
    return next();
  }

  Object.keys(request.body).forEach(key => {
    try {
      request.body[key] = JSON.parse(request.body[key]);
    } catch(error) { /* noop */ }
  });

  Object.keys(request.body).forEach(key => {
    if (Array.isArray(request.body[key])) {
      request.body[key].forEach((item, index) => {
        if (!isNaN(item)) {
          request.body[key][index] = parseInt(item);
        }
      });
    }
  });

  next();
};
