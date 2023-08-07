const net = require("node:net");
const { Response } = require("./src/response");

const parserHeader = (headerLine) => {
  const [header, value] = headerLine.split(": ");
  return [header.toUpperCase(), value];
};

const parseHeaders = (headerLines) =>
  Object.fromEntries(headerLines.map(parserHeader));

const createRequest = (requestText) => {
  const [requestLine, ...headerLines] = requestText.split("\r\n");
  const [method, uri, protocol] = requestLine.split(" ");

  return {
    method: method.toUpperCase(),
    uri,
    protocol: protocol.toUpperCase(),
    headers: parseHeaders(headerLines),
  };
};

const isNotValidProtocol = (protocol) => protocol !== "HTTP/1.1";

const isNotValidMethod = (method) => method !== "GET";

const isNotValidHeader = (headers) => {
  return !headers["USER-AGENT"];
};

const handleBadRequest = (response) => {
  response.setStatusCode(400);
  response.setContent("Bad request\n");
  response.send();
};

const handleMethodNotAllowed = (response) => {
  response.setStatusCode(405);
  response.setContent("Method not allowed\n");
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
  const remainingComponents = request.uri.split("/").slice(2);
  response.setContent("echo\n");
  if (remainingComponents.length > 0)
    response.setContent(remainingComponents.join("/"));

  response.setStatusCode(200);
  response.send();
};

const handlePageNotFound = (request, response) => {
  response.setStatusCode(404);
  response.setContent(`${request.uri} Not Found`);
  response.send();
};

const handleValidRequest = (request, response) => {
  const RESPONSE_LOOKUP = {
    "": handleHome,
    "ping": handlePing,
    "echo": handleEcho,
  };

  const firstComponent = request.uri.split("/")[1];
  console.log(firstComponent);

  if (firstComponent in RESPONSE_LOOKUP) {
    RESPONSE_LOOKUP[firstComponent](request, response);
    return;
  }

  handlePageNotFound(request, response);
};

const handle = (request, response) => {
  if (isNotValidProtocol(request.protocol)) return handleBadRequest(response);

  if (isNotValidMethod(request.method)) return handleMethodNotAllowed(response);

  if (isNotValidHeader(request.headers)) return handleBadRequest(response);

  return handleValidRequest(request, response);
};

const handleConnection = (socket) => {
  socket.setEncoding("utf-8");

  socket.on("data", (data) => {
    const request = createRequest(data);
    const response = new Response(socket);
    handle(request, response);
  });
};

const main = () => {
  const server = net.createServer();

  server.on("connection", handleConnection);

  server.listen(8000, () => {
    console.log("Server started listening");
  });
};

main();
