# Where's Carry
## Dependencies
node v 4.3.2: https://nodejs.org/en/download/

## Where's Carry Setup
```bash
$ npm install
debug@2.2.0 node_modules/debug
└── ms@0.7.1

serve-favicon@2.3.0 node_modules/serve-favicon
├── etag@1.7.0
├── fresh@0.3.0
├── parseurl@1.3.1
└── ms@0.7.1
...
```

## Running Server
```bash
$ node app.js
Creating a pool connected to localhost:28015
Express server listening on port 3000
```
If you receive this error:
```bash
Fail to create a new connection for the connection pool. Error:{"message":"Failed to connect to localhost:28015\nFull error:\n{\"code\":\"ECONNREFUSED\",\"errno\":\"ECONNREFUSED\",\"syscall\":\"connect\",\"address\":\"127.0.0.1\",\"port\":28015}.","isOperational":true}
```
Start rethinkdb in the directory that contains `rethinkdb_data/`
```bash
$ rethinkdb
Running rethinkdb 2.2.5 (CLANG 7.0.2 (clang-700.1.81))...
Running on Darwin 15.2.0 x86_64
Loading data from directory DispatchCapstone/Kafka/py/rethinkdb_data
Listening for intracluster connections on port 29015
Listening for client driver connections on port 28015
Listening for administrative HTTP connections on port 8080
Listening on addresses: 127.0.0.1, ::1
To fully expose RethinkDB on the network, bind to all addresses by running rethinkdb with the `--bind all` command line option.
Server ready, "local_5sv" 59ab4447-dc3a-4dcc-b577-b1358ab33c00
```
### Starting server with nodemon
nodemon can also be used to run server in development environments, it updates the server after files are saved
```bash
$ npm install -g nodemon
$ nodemon app.js
[nodemon] 1.9.1
[nodemon] to restart at any time, enter `rs`
[nodemon] watching: *.*
[nodemon] starting `node app.js`
Creating a pool connected to localhost:28015
Express server listening on port 3000
```

By Default website is accessible at localhost:3000 in the web browser
