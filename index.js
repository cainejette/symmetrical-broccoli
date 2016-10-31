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
    cowsay(res, req.body.text);
  }
});

var cowsay = (res, query) => {
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
      handleError(res, err);
    } else {
      send(res, data.cow);
    }
  })
};

var send = (res, data) => {
  var response = {
    'response_type': 'in_channel',
    'text': data,
  };

  res.send(response);
}

var handleError = (res, err) => {
  res.send({text: 'error: ' + err, response_type: 'ephemeral'});  
}