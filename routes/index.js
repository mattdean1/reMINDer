var express = require('express');
var mongo = require('mongodb');
var monk = require('monk');

if(!process.env.IS_LOCALHOST){
  var server = require('../server.js');
  server.start();
}

if(process.env.MONGODB_URI){
  var db = monk(process.env.MONGODB_URI);
}else{
  var db = monk('localhost/test');
}

var collection = db.get('reminders');

module.exports = function(io){
var router = express.Router();


io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
  socket.on('reminder', function(data){
    console.log('reminder='+data);
    io.emit('reminderpatient', data);
  });
  socket.on('reminderDeleted',function(data){
    console.log('delete='+data);
    io.emit('patientDeleted',data);
  });
});


router.get('/', function(req, res) {
  //initialise empty array for results of db query
  var results = [];
  collection.find({},{},function(e,results){
      res.render('index', { list: results });
  });
});

router.get('/patient', function(req, res) {
  //initialise empty array for results of db query
  var results = [];
    collection.find({},{},function(e,results){
        res.render('patient', { list: results });
    });
});

router.get('/reminders', function(req, res) {
  // get the reminders and return it to alexia to speak
  var results = [];
    collection.find({},{},function(e,results){
        var alexaString = '';
        for(var i = 0;i<results.length;i++){
          var result = results[i];

          //do not list 'ticked off' reminders
          if (!result.done){
            alexaString += results[i].title+', ';
          }

        }
        res.send('Your Reminders are:'+alexaString);
    });

});

//insert new todo into database
router.post('/insert', function(req, res) {
  collection.insert({
          "title" : req.body.title,
          "description": req.body.description,
          "done": false
      }, function (e, doc) {
          if (e) {
              res.send(e);
          }
          else {
              res.send(doc);
          }
      });
});

//delete a todo item
router.post('/delete', function(req, res) {
  collection.remove({_id: req.body.id},
                        function(e){
                          if(e){
                            res.send(e);
                          }
                          res.send('success');
                        }
      );
});

//update an item
router.post('/update', function(req, res) {
  collection.update({_id: req.body.id},
                        {$set:{
                          'done': (req.body.done == 'true'),
                        }},
                        function(e){
                          if(e){
                            res.send(e);
                          }
                          io.emit('itemToggled');
                          res.send('success');
                        }
      );
});

return router;
};
