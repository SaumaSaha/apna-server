class Response {
  #socket;
  #statusCode;
  #statusMessage;
  #content;

  constructor(socket) {
    this.#socket = socket;
    this.#statusCode = 200;
    this.#statusMessage = "OK";
    this.#content = "";
  }

  setStatusCode(statusCode) {
    const statusMessages = {
      200: "OK",
      404: "NOT_FOUND",
    };

    this.#statusCode = statusCode;
    this.#statusMessage = statusMessages[statusCode];
  }

  setContent(content) {
    this.#content = content;
  }

  send() {
    this.#socket.write(
      `HTTP/1.1 ${this.#statusCode} ${this.#statusMessage}\n\n${this.#content}`
    );
  }
}

module.exports = { Response };
