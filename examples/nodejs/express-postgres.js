var express = require('express');
const { Client } = require('pg')
var app = express();
const client = new Client({
  host: process.env.DB_HOSTNAME,
  port: 5432,
  database: 'postgres',
  user: 'postgres',
  password: 'postgres'
})

app.get('/', function (req, res) {
   console.log('Hit Main Page')
   setTimeout(function () { //simulate a long request 10 seconds before client get back respond
	  res.writeHead(200, {'Content-Type': 'text/plain'});
	  res.end('Hello\n');
	}, 10000);
})

app.get('/hello', function (req, res) {
   console.log('Hit Main Page')
   setTimeout(function () { //simulate a long request 10 seconds before client get back respond
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('Hello Greceful Shutdown with Express\n');
  }, 10000);
})

app.get('/db', async (req, res) => {
  console.log('Hit Database')
  const result = await client.query('SELECT $1::text as message', ['Hello world!'])
  await new Promise(done => setTimeout(done, 5000)); // Set delay to prove gracefull
  res.send(result.rows[0].message)
})

app.use('/healthcheck', require('express-healthcheck')({
    healthy: function () {
        return { everything: 'is ok' };
    }
}));

var server = app.listen(8080, function () {
   var host = server.address().address
   var port = server.address().port
   client.connect()
   console.log("Example app listening at http://%s:%s", host, port)
   console.log("Process PID : %s",process.pid)
})

process.on('SIGTERM', function () {
  console.log('shutdown signal received')
  console.log('shutting down server ...')
  server.close(function () {
  	console.log('server closed')
    //process.exit(0);
    client.end(function () {
      console.log('database connection closed')
      process.exit(0);
    });

  });
});