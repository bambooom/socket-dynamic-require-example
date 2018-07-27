const net = require('net');
const path = require('path');

const HOST = '127.0.0.1';
const PORT = 65000;
const END_MSG = 'END';

process.on('unhandledRejection', (r) => { log(r); process.exit(1) });

(function () {
  const server = net.createServer(); // create a socket server
  server.maxConnections = 10;

  // added 'connection' event handler, which create a socket
  server.on('connection', socket => {
    console.log('client connected');

    socket.on('data', data => {
      // received msg from client, which is the module file name
      const msg = data.toString();

      if (msg === END_MSG) {
        server.close();
        // close the socket server when receiving ending message
        // it will trigger 'close' event of the socket server
        return;
      }

      const moduleFile = path.resolve(msg); // make the module file name as absolute path
      const moduleFunction = require(moduleFile);
      // here I suppose the required function is returning promise
      moduleFunction()
        .then(result => {
          // NOTE: here is to delete the require cache for the module
          // since if the moduleFile is the same as the previous one,
          // even if the content of the file is different,
          // nodejs will use the cached module instead of requiring/reloading new module
          delete require.cache[require.resolve(moduleFile)];

          // send the result to the client
          socket.write(JSON.stringify(result));
          socket.pipe(socket);
          socket.destroy(); // destroy current socket, it will trigger 'close' event of the socket
        })
        .catch(err => {
          console.error('moduleFunction error: ', err);
        });
    });

    socket.on('close', () => {
      console.log('client disconnected');
    });
  });

  server.listen({
    host: HOST,
    port: PORT,
  }, () => {
    console.log(`socket server listen on ${HOST}:${PORT}`);
  });

  server.on('error', err => {
    throw err;
  });

  server.on('close', () => {
    console.log('socket server will be closed');
  });
})();