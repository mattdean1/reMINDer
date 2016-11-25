var express = require('express');
var mongo = require('mongodb');
var monk = require('monk');
var db = monk('heroku_klsgm29t:m31k07a3ujdc1pn8a7o1pfrsk6@ds163667.mlab.com:63667/heroku_klsgm29t');
var collection = db.get('reminders');

module.exports = function(io){
var router = express.Router();


io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
  socket.on('reminder', function(title){
    console.log('reminder='+title);
    io.emit('reminderpatient', title);
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
  if(!process.env.DATABASE_URL){
    res.render('patient', { list: results });
  }else{
    collection.find({},{},function(e,results){
        res.render('index', { list: results });
    });
  }
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
              res.send('success');
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
                          'done': req.body.done,
                        }},
                        function(e){
                          if(e){
                            res.send(e);
                          }
                          res.send('success');
                        }
      );
});

return router;
};
