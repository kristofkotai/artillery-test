module.exports = {
  logHttp,
  logHttpOnError
};

function logHttp (request, response, context, ee, next) {
  console.log('\n[LOG] HTTP Request:\n', getFormattedRequest(request));
  console.log('\n[LOG] HTTP Response:\n', getFormattedResponse(response));
  return next();
}

function logHttpOnError (request, response, context, ee, next) {
  if (response.statusCode < 400) {
    return next();
  }

  console.log('\n[LOG] HTTP Request:\n', getFormattedRequest(request));
  console.log('\n[LOG] HTTP Response:\n', getFormattedResponse(response));
  return next();
}

function getFormattedRequest (request) {
  delete request.agent;
  delete request.jar;
  return request;
}

function getFormattedResponse (response) {
  return {
    headers: response.headers,
    statusCode: response.statusCode,
    statusMessage: response.statusMessage,
    body: response.body,
  };
}
