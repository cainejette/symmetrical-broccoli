var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var curl = require('curlrequest');
var cowsay = require('cowsay');

app.get('/', function (req, res) {
  res.send('hi');
});

app.listen(process.env.PORT || 8765, function () {
  console.log('started...');
});

app.use(bodyParser());

app.post('/', function (req, res) {
  console.log(req.body.text);
  if (req.body.text == 'help') {
    res.send({text: 'type /cowsay [text] to have a cow say it for ya, or /cowsay [animal] [text] to have that animal say it!'});
  } else {
    cowify(res, req.body.text);
  }
});

var cowify = (res, query) => {
  console.log('cowifying: [' + query + ']');
  var words = query.split(' ');
  var cowified = '';
  try {
    if (words.length > 1) {
      cowified = cowsay.say({
        'text': words.slice(1).join(' '),
        'f': words[0]
      });
    } else {
      cowified = cowsay.say({
        'text': query
      });
    }
    
    console.log('using animal: ' + words[0]);
  } catch (err) {
    console.dir(err);
    console.log('could not find animal: ' + words[0]);
    cowified = cowsay.say({
      'text': query
    });
  }
  send(res, cowified);
};

var send = (res, data) => {
  var response = {
    'response_type': 'in_channel',
    'text': '```' + data + '```',
  };

  res.send(response);
}

var handleError = (res, err) => {
  res.send({text: 'error: ' + err, response_type: 'ephemeral'});  
}