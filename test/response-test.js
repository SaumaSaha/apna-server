const assert = require("assert");
const { describe, it } = require("node:test");
const { Response } = require("../src/response");

describe("Response", () => {
  describe("send", () => {
    it("should send a default response when nothing is set and end the connection", (context) => {
      const write = context.mock.fn();
      const end = context.mock.fn();

      const response = new Response({ write, end });
      response.send();

      const actualResponse = write.mock.calls[0].arguments[0];
      const date = new Date().toGMTString();
      const expectedResponse = `HTTP/1.1 200 OK\r\nContent-Length: 0\r\nDate: ${date}\r\n\n`;

      assert.strictEqual(actualResponse, expectedResponse);
      assert.strictEqual(end.mock.callCount(), 1);
    });
  });

  describe("setStatusCode", () => {
    it("should give response with a status code of 200 if status code is not set", (context) => {
      const write = context.mock.fn();
      const end = context.mock.fn();

      const response = new Response({ write, end });
      response.send();

      const actualResponse = write.mock.calls[0].arguments[0];
      const date = new Date().toGMTString();
      const expectedResponse = `HTTP/1.1 200 OK\r\nContent-Length: 0\r\nDate: ${date}\r\n\n`;

      assert.strictEqual(actualResponse, expectedResponse);
    });

    it("should give the response with the given status code and a message, according to the status code", (context) => {
      const write = context.mock.fn();
      const end = context.mock.fn();

      const response = new Response({ write, end });
      response.setStatusCode(404);
      response.send();

      const actualResponse = write.mock.calls[0].arguments[0];
      const date = new Date().toGMTString();
      const expectedResponse = `HTTP/1.1 404 NOT_FOUND\r\nContent-Length: 0\r\nDate: ${date}\r\n\n`;

      assert.strictEqual(actualResponse, expectedResponse);
    });
  });

  describe("setContent", () => {
    it("should set the content as empty and content-length as 0 if content is not set", (context) => {
      const write = context.mock.fn();
      const end = context.mock.fn();

      const response = new Response({ write, end });
      response.send();

      const actualResponse = write.mock.calls[0].arguments[0];
      const date = new Date().toGMTString();
      const expectedResponse = `HTTP/1.1 200 OK\r\nContent-Length: 0\r\nDate: ${date}\r\n\n`;

      assert.strictEqual(actualResponse, expectedResponse);
    });

    it("should set the content and the header content-length of the response if specified", (context) => {
      const write = context.mock.fn();
      const end = context.mock.fn();

      const response = new Response({ write, end });
      response.setContent("hello");
      response.send();

      const actualResponse = write.mock.calls[0].arguments[0];
      const date = new Date().toGMTString();
      const expectedResponse = `HTTP/1.1 200 OK\r\nContent-Length: 6\r\nDate: ${date}\r\n\nhello\n`;

      assert.strictEqual(actualResponse, expectedResponse);
    });
  });
});
