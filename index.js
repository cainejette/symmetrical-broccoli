var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var curl = require('curlrequest');

app.get('/', function (req, res) {
  res.send('hi');
});

app.listen(process.env.PORT || 8765, function () {
  console.log('started...');
});

app.use(bodyParser());

app.post('/', function (req, res) {
  if (req.body.text == 'help') {
    res.send({text: 'type /cowsay [text] to have a cow say it for ya!'});
  } else {
    cowsay(res, req.body.text, req.body.response_url);
  }
});

var cowsay = (res, query, response_url) => {
  console.log('cowifying: [' + query + ']');

  var options = {
    'url': 'http://cowsay.morecode.org/say',
    'method': 'POST',
    'data': {
      'message': query,
      'format': 'json'
    }
  };

  curl.request(options, (err, data) => {
    if (err) {
      console.log('err!');
      console.dir(err);
      handleError(res, err);
    } else {
      send(res, data, response_url);
    }
  });
};

var send = (res, data, response_url) => {
  var results = JSON.parse(data);
  results.cow = '\n' + results.cow;
  console.log('results: [' + results.cow + ']');
  var response = {
    'response_type': 'in_channel',
    'text': '```' + results.cow + '```',
  };

  res.send(response);
}

var handleError = (res, err) => {
  res.send({text: 'error: ' + err, response_type: 'ephemeral'});  
}