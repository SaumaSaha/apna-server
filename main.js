const net = require("node:net");
const { Response } = require("./src/response");
const { handle } = require("./src/request-handlers");

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
