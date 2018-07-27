const net = require('net');

const HOST = '127.0.0.1';
const PORT = 65000;

const files = ['a.js', 'b.js', 'c.js'];

for (const f of files) {
  const client = new net.Socket(); // create a socket

  // socket connect to the server
  client.connect(PORT, HOST, function() {
    console.log('connected to the server');
    client.write(f);
  });

  client.on('data', function(data) {
    console.log('Received from server: ' + data);
    client.destroy(); // kill client after receiving response
  });

  client.on('close', function() {
    console.log('disconnected to the server');
  });
}