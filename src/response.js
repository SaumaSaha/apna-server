class Response {
  #socket;
  #statusCode;
  #statusMessage;
  #content;
  #header;
  #protocol;
  #version;

  constructor(socket, protocol = "HTTP", version = "1.1") {
    this.#socket = socket;
    this.#statusCode = 200;
    this.#statusMessage = "OK";
    this.#content = "";
    this.#header = "";
    this.#protocol = protocol;
    this.#version = version;
  }

  #addHeader(header, value) {
    this.#header += `${header}: ${value}\r\n`;
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

  #formatResponse() {
    return `${this.#protocol}/${this.#version} ${this.#statusCode} ${
      this.#statusMessage
    }\r\n${this.#header}\n${this.#content}`;
  }

  send() {
    this.#addHeader("Content-Length", this.#content.length);
    this.#addHeader("Date", new Date().toGMTString());

    const response = this.#formatResponse();

    this.#socket.write(response);
    this.#socket.end();
  }
}

module.exports = { Response };
