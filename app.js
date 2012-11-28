 var express = require('express');
 var app = express();

var listeners = {};

var cleanup = function() {
  var trimmed = {};
  for(var guid in listeners) {
    var listener = listeners[guid];
    if(new Date().getTime() - listener.ts.getTime() < 1000*10))
      trimmed[guid] = listener;
    else
      console.log('CLEANED: ' + guid);
  }
  listeners = trimmed;
};

 app.configure(function(){
  app.set('port', process.env.PORT || 80);
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);

});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/listeners', function(req, res) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.json(listeners);
});

app.post('/listeners', function(req, res) {
  var obj = req.body;
  if(!listeners[obj.guid]) listeners[obj.guid] = { tracks: {} };
  listeners[obj.guid].tracks[obj.trackId] = obj;
  listeners[obj.guid].ts = new Date();
  cleanup();
  res.send(200);
});

app.get('/', function(req, res) {
  res.send('Express is running...');
});

app.listen(app.get('port'));