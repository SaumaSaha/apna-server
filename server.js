const net = require("node:net");

const generateBadRequestDetails = () => ({
  content: "Bad request\n",
  statusCode: 400,
  message: "BAD_REQUEST",
});

const generateMethodNotAllowedDetails = () => ({
  content: "Method not allowed\n",
  statusCode: 405,
  message: "METHOD_NOT_ALLOWED",
});

const generatePingDetails = () => ({
  content: "pong\n",
  statusCode: 200,
  message: "OK",
});

const generateHomeDetails = () => ({
  content: "home\n",
  statusCode: 200,
  message: "OK",
});

const generateEchoDetails = (uri) => {
  const response = { content: "echo\n", statusCode: 200, message: "OK" };
  const remainingComponents = uri.split("/").slice(2);

  if (remainingComponents.length > 0)
    response.content = remainingComponents.join("/");

  return response;
};

const parse = (requestText) => {
  const [requestLine] = requestText.split("\r\n");
  const [method, uri, protocol] = requestLine.split(" ");

  return {
    method: method.toUpperCase(),
    uri,
    protocol: protocol.toUpperCase(),
  };
};

const isNotValidProtocol = (protocol) => protocol !== "HTTP/1.1";

const isNotValidMethod = (method) => method !== "GET";

const generateNotFoundDetails = (uri) => {
  const notFoundDetails = {
    statusCode: 404,
    message: "NOT_FOUND",
  };

  notFoundDetails.content = `${uri} NOT_FOUND\n`;

  return notFoundDetails;
};

const generateValidResponseDetails = (uri) => {
  const RESPONSE_LOOKUP = {
    "": generateHomeDetails,
    "ping": generatePingDetails,
    "echo": generateEchoDetails,
  };

  const firstComponent = uri.split("/")[1];
  console.log(firstComponent);

  return firstComponent in RESPONSE_LOOKUP
    ? RESPONSE_LOOKUP[firstComponent](uri)
    : generateNotFoundDetails(uri);
};

const generateResponse = ({ uri, protocol, method }) => {
  if (isNotValidProtocol(protocol)) return generateBadRequestDetails();

  if (isNotValidMethod(method)) return generateMethodNotAllowedDetails();

  return generateValidResponseDetails(uri);
};

const formatResponse = ({ content, statusCode, message }) => {
  return `HTTP/1.1 ${statusCode} ${message}\n\n${content}`;
};

const handleRequest = (data, socket) => {
  const request = parse(data);
  const response = generateResponse(request);

  socket.write(formatResponse(response));
  socket.end();
};

const handleConnection = (socket) => {
  socket.setEncoding("utf-8");

  socket.on("data", (data) => handleRequest(data, socket));
};

const main = () => {
  const server = net.createServer();

  server.on("connection", handleConnection);

  server.listen(8000, () => {
    console.log("Server started listening");
  });
};

main();
