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

  #generateHeaders() {
    const length = this.#content.length;
    const date = new Date().toGMTString();

    return `Content-Length: ${length}\r\nDate: ${date}`;
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
    const header = this.#generateHeaders();

    this.#socket.write(
      `HTTP/1.1 ${this.#statusCode} ${this.#statusMessage}\r\n${header}\r\n\n${
        this.#content
      }`
    );

    this.#socket.end();
  }
}

module.exports = { Response };
