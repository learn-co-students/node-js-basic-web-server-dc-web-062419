"use strict";

const http         = require('http');
const finalhandler = require('finalhandler');
const Router       = require('router');
const urlParser = require('url');
const querystring = require('querystring');

const router = new Router();
const bodyParser = require('body-parser')

//indicates we want to use the parser for JSON data
router.use(bodyParser.json())

let messages = []
let nextMessageId = 1

class Message {
  constructor(message) {
    this.id = nextMessageId,
    this.message = message
    nextMessageId++
  }
}

router.get('/', (request, response) => {
  response.setHeader("content-type", "text/plain; charset=utf-8")
  // response.send()
  response.end("Hello, World!");
});

router.get('/messages', (request, response)=>{
  let allMessages = JSON.stringify(messages)
  response.setHeader('Content-Type', 'application/json; charset=utf-8')
  response.end(allMessages)
})

router.get('/message/:id', (request, response)=>{
  let url = urlParser.parse(request.url)
  let params = querystring.parse(url.query)

  response.setHeader('Content-Type', 'application/json; charset=utf-8')

  if (!request.params.id) {
    response.statusCode = 400;
    response.statusMessage = "No message id provided.";
    response.end();
    return;
  }

  const found = messages.find((message) => {
    return message.id == request.params.id;
  });

  if (!found) {
    response.statusCode = 404;
    response.statusMessage = `Unable to find a message with id ${request.params.id}`;
    response.end();
    return;
  }

  const result = JSON.stringify(found);

  response.end(result);
})

router.post('/message', (req, res) => {
  let newMessage;

  res.setHeader('Content-Type', 'application/json; charset=utf-8');

  if(!req.body.message) {
    res.statusCode = 400;
    res.statusMessage = 'No message provided.';
    res.end();
    return;
  }

  newMessage = new Message(req.body.message);
  messages.push(newMessage);

  res.end(JSON.stringify(newMessage.id))
})

const server = http.createServer((request, response) => {
  router(request, response, finalhandler(request, response));
});

exports.listen = function(port, callback) {
  server.listen(port, callback);
};

exports.close = function(callback) {
  server.close(callback);
};
