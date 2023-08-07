const assert = require("assert");
const { describe, it } = require("node:test");
const { Response } = require("../src/response");

describe("Response", () => {
  describe("setStatusCode", () => {
    it("should give response with a status code of 200 if status code is not set", (context) => {
      const write = context.mock.fn();

      const response = new Response({ write });
      response.send();

      const actualResponse = write.mock.calls[0].arguments[0];
      const expectedResponse = "HTTP/1.1 200 OK\n\n";

      assert.strictEqual(actualResponse, expectedResponse);
    });

    it("should give the response with the given status code and a message, according to the status code", (context) => {
      const write = context.mock.fn();

      const response = new Response({ write });
      response.setStatusCode(404);
      response.send();

      const actualResponse = write.mock.calls[0].arguments[0];
      const expectedResponse = "HTTP/1.1 404 NOT_FOUND\n\n";

      assert.strictEqual(actualResponse, expectedResponse);
    });
  });

  describe("setContent", () => {
    it("should set the content as empty if content is not set", (context) => {
      const write = context.mock.fn();

      const response = new Response({ write });
      response.send();

      const actualResponse = write.mock.calls[0].arguments[0];
      const expectedResponse = "HTTP/1.1 200 OK\n\n";

      assert.strictEqual(actualResponse, expectedResponse);
    });

    it("should set the content of the response if specified", (context) => {
      const write = context.mock.fn();

      const response = new Response({ write });
      response.setContent("hello");
      response.send();

      const actualResponse = write.mock.calls[0].arguments[0];
      const expectedResponse = "HTTP/1.1 200 OK\n\nhello";

      assert.strictEqual(actualResponse, expectedResponse);
    });
  });
});
