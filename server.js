const http = require('http')
const fs = require('fs')
const fsPromises = require('fs').promises
const path = require('path')
const logEvents = require('./logEvents')
const EventEmitter = require('events')

class Emetter extends EventEmitter {}

const myEmetter = new Emetter()
myEmetter.on('log', (msg,fileName) => logEvents(msg,fileName))

const PORT = process.env.PORT || 5000

const serveFile = async (filePath, contentType, response) => {
  try {
    const rawData = await fsPromises.readFile(
      filePath,
      !contentType.includes('image') ? 'utf8' : ''
    )
    const data =
      contentType === 'application/json' ? JSON.parse(rawData) : rawData
    response.writeHead(filePath.includes('404.html') ? 404 : 200, {
      'Content-Type': contentType,
    })
    response.end(
      contentType === 'application/json' ? JSON.stringify(data) : data
    )
  } catch (error) {
    console.log(error)
    myEmetter.emit('log', `${error.name}: ${error.message}`, 'errLog.txt')
    response.statusCode = 500
    response.end
  }
}

const server = http.createServer((req, res) => {
  console.log(req.url, req.method)
  myEmetter.emit('log', `${req.url}\t${req.method}`, 'reqLog.txt')

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

  let filePath =
    contentType === 'text/html' && req.url === '/'
      ? path.join(__dirname, 'views', 'index.html')
      : contentType === 'text/html' && req.url.slice(-1) === '/'
      ? path.join(__dirname, 'views', req.url, 'index.html')
      : contentType === 'text/html'
      ? path.join(__dirname, 'views', req.url)
      : path.join(__dirname, req.url)

  //Making .htm not required in the browser
  if (!extention && req.url.slice(-1) != '/') filePath += '.html'

  const existFile = fs.existsSync(filePath)

  //Making sure the filePath exist
  if (existFile) {
    //serve the page
    serveFile(filePath, contentType, res)
  } else {
    //404 page

    //301 redirect

    switch (path.parse(filePath).base) {
      case 'old-page.html':
        res.writeHead(301, { Location: '/new-page.html' })
        res.end()
        break
      case 'www-page.html':
        res.writeHead(301, { Location: '/' })
        res.end()
        break
      default:
        serveFile(path.join(__dirname, 'views', '404.html'), 'text/html', res)
    }
  }
})

server.listen(PORT, () => {
  console.log(`Server running on  http://localhost:${PORT}`)
})
