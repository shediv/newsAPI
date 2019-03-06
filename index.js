var express = require('express');
var request = require("request");
const bodyParser = require('body-parser')
var app = express();

this.params = {};
var self = this;
var envConfig = require('./app/env');
console.log(" envConfig = ", envConfig.newsAPI)

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use(function(request, response, next){
  console.log(  "\033[34m \033[1m" + request.method , 
                "\033[36m \033[1m REQUEST URL: " + "\033[32m "+request.url , 
                "\033[36m \033[1m REQUEST TIME: " + "\033[32m "+ new Date() + "\033[31m ");
  next();
});

app.use(express.static("./app"));

app.get("/", function(req, res) {
    res.sendFile("./app/index.html");
});

//Get Summary of text.
app.post("/summary", function(req, res) {
  // Set the headers
  var headers = {
    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;',
    'Api-Key': envConfig.deepaiAPIKey
  }

  // Configure the request
  var options = {
    url: envConfig.deepaiAPI,
    method: 'POST',
    headers: headers,
    form: { text: req.body.text },
  }

  // Start the request
  request(options, function (error, response, body) {
    if (!error && response.statusCode == 200) {
        var summary = JSON.parse(body);
        return res.status(200).json({'summary': summary.output})
    }else{
      return res.status(500).json({'error': error})
    }
  })
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});