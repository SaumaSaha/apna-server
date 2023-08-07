const net = require("node:net");

const main = () => {
  const server = net.createServer();

  server.on("connection", (socket) => {
    socket.setEncoding("utf-8");

    socket.on("data", (data) => {
      console.log(data);
      socket.write("HTTP/1.1 200 ALL_OK\n\nHello");
      socket.end();
    });
  });

  server.listen(8000, () => console.log("Server started listening"));
};

main();
