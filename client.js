/*
**  Usage:
**   tcp>  SOCKET_MODE=tcp node client.js
**   ipc>  SOCKET_MODE=ipc node client.js
**
*/

const net = require('net');

const HOST = '127.0.0.1';
const PORT = 65000;
const SOCKETFILE = '/tmp/unix.sock';

const files = ['a.js', 'b.js', 'c.js'];

let SOCKET_MODE;
const TCP = 'tcp';
const IPC = 'ipc';

switch(process.env["SOCKET_MODE"]){
    case TCP: SOCKET_MODE = TCP; break;
    case IPC: SOCKET_MODE = IPC; break;
    default: console.error("SOCKET_MODE not set"); process.exit(1);
}

for (const f of files) {
  const client = new net.Socket(); // create a socket

  // socket connect to the server
  if (SOCKET_MODE === TCP) {
    client.connect(PORT, HOST, function() {
      console.log('connected to the server');
      client.write(f);
    });
  } else if (SOCKET_MODE === IPC) {
    client.connect(SOCKETFILE, function() {
      console.log('connected to the server');
      client.write(f);
    });
  }

  client.on('data', function(data) {
    console.log('Received from server: ' + data);
    client.destroy(); // kill client after receiving response
  });

  client.on('close', function() {
    console.log('disconnected to the server');
  });

  client.on('error', function(data) {
    console.error('Server not active.');
    process.exit(1);
  });
}