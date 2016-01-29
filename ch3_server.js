'use strict'

var http = require('http')
var url = require('url')
var fs = require('fs')

var messages = ['testing']
var clients = []

http.createServer((req, res) => {
  let url_parts = url.parse(req.url)
  console.log(url_parts)

  if (url_parts.pathname === '/') {
    console.log('client')
    fs.readFile('./index.html', (err, data) => {
      res.end(data)
    })
  } else if (url_parts.pathname.substring(0, 5) === '/poll') {
    console.log('poll')
    let count = url_parts.pathname.replace(/[^0-9]*/, '')
    console.log(count)
    if (messages.length > count) {
      res.end(JSON.stringify({
        count: messages.length,
        append: messages.slice(count).join('\n\n')
      }))
    } else {
      clients.push(res)
    }
  } else if (url_parts.pathname.substring(0, 4) === '/msg') {
    console.log('msg')
    var msg = unescape(url_parts.pathname.substr(5))
    messages.push(msg)
    while (clients.length > 0) {
      let client = clients.pop()
      client.end(JSON.stringify({
        count: messages.length,
        append: msg + '\n'
      }))
    }
    res.end()
  } else {
    console.log('nada')
    res.end('tadat!')
  }
}).listen(8080, 'localhost')
console.log('server on port 8080')
