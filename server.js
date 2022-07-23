const http = require('http')
const fs = require('fs')
const fsPromises = require('fs').promises
const path = require('path')
const logEvents = require('./logEvents')
const EventEmitter = require('events')

class Emetter extends EventEmitter {}

const myEmetter = new Emetter()

const PORT = process.env.PORT || 3500

const server = http.createServer((req, res) => {
  console.log(req.url, req.method)

  const extention = path.extname(req.url)

  let contentType
  switch (extention) {
    case '.css':
      contentType = 'text/css'
      break
    case 'js':
      contentType = 'text/javascript'
      break
    case '.jpg':
        contentType = 'image/jpeg'
        break
    case '.json':
        contentType = 'application/json'
        break
    case '.png': 
        contentType = 'image/png'
        break
    case '.txt':
        contentType = 'text/plain'
        break
    default:
        contentType = 'text/html'
        break

  }
})

// myEmetter.on('log', (msg) => logEvents(msg))

// myEmetter.emit('log', 'Log event emitted')

server.listen(PORT, () => {
  console.log(`Server running on  http://localhost:${PORT}`)
})
