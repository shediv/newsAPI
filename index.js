var express = require('express');
var app = express();

this.params = {};
var self = this;

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

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

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});