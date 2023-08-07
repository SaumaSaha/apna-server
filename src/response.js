class Response {
  #socket;
  #statusCode;
  #statusMessage;

  constructor(socket) {
    this.#socket = socket;
    this.#statusCode = 200;
    this.#statusMessage = "OK";
  }

  setStatusCode(statusCode) {
    const statusMessages = {
      200: "OK",
      404: "NOT_FOUND",
    };

    this.#statusCode = statusCode;
    this.#statusMessage = statusMessages[statusCode];
  }

  send() {
    this.#socket.write(`HTTP/1.1 ${this.#statusCode} ${this.#statusMessage}`);
  }
}

module.exports = { Response };
