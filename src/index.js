const app = require('./app')
const { Server } = require('socket.io')
const http = require('http')
const sockets = require('./sockets')

const server= http.createServer(app)
const httpServer = server.listen(3000)


console.log('Server is running on port 3000');

const io = new Server(httpServer)
sockets(io)