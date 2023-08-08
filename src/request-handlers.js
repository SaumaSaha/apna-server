const handleBadRequest = (_, response) => {
  response.setStatusCode(400);
  response.setContent("Bad request");
  response.send();
};

const handleMethodNotAllowed = (_, response) => {
  response.setStatusCode(405);
  response.setContent("Method not allowed");
  response.send();
};

const handleHome = (_, response) => {
  response.setStatusCode(200);
  response.setContent("Home");
  response.send();
};

const handlePing = (_, response) => {
  response.setStatusCode(200);
  response.setContent("pong");
  response.send();
};

const handleEcho = (request, response) => {
  const [_, ...remainingPathComponents] = request.uri.match(/\/\w*/g);
  response.setContent("echo");

  if (remainingPathComponents.length > 0)
    response.setContent(remainingPathComponents.join(""));

  response.setStatusCode(200);
  response.send();
};

const handlePageNotFound = (request, response) => {
  response.setStatusCode(404);
  response.setContent(`${request.uri} Not Found`);
  response.send();
};

const handleValidRequest = (request, response) => {
  const ROUTES = {
    "/": handleHome,
    "/ping": handlePing,
    "/echo": handleEcho,
  };

  const [route] = request.uri.match(/^\/\w*/g);

  if (route in ROUTES) {
    ROUTES[route](request, response);
    return;
  }

  handlePageNotFound(request, response);
};

const isInvalidProtocol = (protocol) => protocol !== "HTTP/1.1";

const isInvalidMethod = (method) => method !== "GET";

const isInvalidHeader = (headers) => {
  return !headers["USER-AGENT"];
};

const handle = (request, response) => {
  if (isInvalidProtocol(request.protocol)) {
    handleBadRequest(request, response);
    return;
  }

  if (isInvalidMethod(request.method)) {
    handleMethodNotAllowed(request, response);
    return;
  }

  if (isInvalidHeader(request.headers)) {
    handleBadRequest(request, response);
    return;
  }

  handleValidRequest(request, response);
};

module.exports = {
  handle,
};
