# SlowerUDP

SlowerUDP is a small udp framework, it simplifies a little the data handling on udp servers. 
It is the UDP equivalent of the Slower package.

### API Methods:

```
app.onError(callback: (socket, errorMessage)): dgram.Socket

> Sets a callback that will be called on 'error' event.
> The own UDP socket is passed as argument in the callback.
> Returns the own object instance, so that methods can be chained.
```
```
app.onClose(callback: (socket)): dgram.Socket

> Sets a callback for the socket event 'close'.
> The own UDP socket is passed as argument in the callback.
> Returns the own object instance, so that methods can be chained.
```
```
app.onConnect(callback: (socket)): dgram.Socket

> Sets a callback that will be called on 'connection' event.
> The own UDP socket is passed as argument in the callback.
> Returns the own object instance, so that methods can be chained.
```
```
app.setFallback(callback: (socket, message, rInfo)): dgram.Socket

> Sets a callback that will be called on 'message' events that were 
  not handled by any declared routes.
> The own UDP socket, and the received message, are passed as 
  arguments in the callback.
> Returns the own object instance, so that methods can be chained.
```
```
app.setMiddleware(callback: (socket, message, rInfo)): dgram.Socket

> Sets a callback that will be executed before every 'message' event.
> The own UDP socket, and the received message, are passed as arguments
  in the callback.
> Returns the own object instance, so that methods can be chained.
```
```
app.setRoute(callback: (socket, message)): dgram.Socket

> Sets a callback that will be called on 'message' events that 
  matches the specified route.
> The route string supports wildcard characters: '{?}' for 
  replacing one character, or '{*}' for replacing any number 
  of characters.
> The own UDP socket, and the received message, are passed as 
  arguments in the callback.
> Returns the own object instance, so that methods can be chained.
```
```
app.start(port=8080, host='127.0.0.1', callback: (socket)): dgram.Socket

> Sets a callback that will be called when the server is started.
> The callback responds to the 'listening' event, and creates
  an internal property 'onListening' containing the callback.
> Defines the port and host to start the server.
> Returns the own object instance, so that methods can be chained.
```

### API Properties

```
app.routes
> An Array containing Route instances, representing all the 
  declared routes.
> Route objects have this structure:
Route {
    route: String
    callback: Function
}
```
```
app.routes: Array[Route...]
app.server: net.Server
app.port: Number
app.host: String
app.fallback: Function
app.middleware: Function
app.errorListener: Function
app.listeningListener: Function
app.closeListener: Function
app.connectListener: Function
```

### Example usage:
```
// Declare and initialize the module
const SlowerUDP = require('slowerudp');
const app = SlowerUDP();

// Declare 'error' handler:
app.onError((socket, errorMessage) => {
    console.log('there was an error: '+errorMessage);
    socket.close();
});

// Declare 'close' handler:
app.onClose((socket) => {
    console.log('socket closed');
});

// Declare 'connect' handler:
app.onConnect((socket) => {
    console.log('socket connected');
});

// Declare middleware for messages:
app.setMiddleware((socket, msg, rinfo) => {
    console.log(`this will be executed before any route handler`);
});

// Declare route for messages:
app.setRoute('USER {*}', (socket, msg, rinfo) => {
    console.log(`this will respond to data blocks starting with 'USER '`);
});

// Declare fallback for messages:
app.setFallback((socket, msg, rinfo) => {
    console.log(`this data: ${msg}, was not handled by any route.`);
});

// Start server
app.start(8081, '0.0.0.0', (socket) => {
    console.log('server is listening');
});

```