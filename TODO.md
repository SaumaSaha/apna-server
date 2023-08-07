```
Response:
  fields:
    socket,
    statusCode,
    protocol,
    message,
    content,
    headers,

  behaviors:
    constructor(socket) =>  will take a socket and assign it

    setStatusCode(code) =>  will set the status code of the response

    addHeader(key, value) => will add the header to the headers in a specific format

    <!-- setStatusMessage(message) => set the message of the response -->

    setContent(content) => set the content of the response

    send();
```