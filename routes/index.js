var express = require('express');
var router = express.Router();

//get postgres code from heroku docs
var pg = require('pg');
pg.defaults.ssl = true;


/* GET home page. */
router.get('/', function(req, res) {
  //initialise empty array for results of db query
  var results = [];

  //connect to postgres database
  pg.connect(process.env.DATABASE_URL, function(err, client) {
    if (err) throw err;
    client
      .query('SELECT * FROM todo ORDER BY pk_id ASC')

      //for each row returned by the query, add it to the array
      .on('row', function(row) {
        results.push(row);
      })

      //when query is finished, render the page, passing in the results of the query
      .on('end', function(){
        res.render('index', { list: results });
      });
  });
});

//insert new todo into database
router.post('/insert', function(req, res) {
  //connect to database
  pg.connect(process.env.DATABASE_URL, function(err, client) {
     if (err) throw err;
     client
        //insert data using prepared statement
       .query('INSERT INTO todo (title, description) VALUES ($1, $2)', [req.body.title, req.body.description])
       .on('end', function(){
         res.send('success');
       });
   });
});

//delete a todo item
router.post('/delete', function(req, res) {
  pg.connect(process.env.DATABASE_URL, function(err, client) {
     if (err) throw err;
     client
       .query('DELETE FROM todo WHERE pk_id='+req.body.id)
       .on('end', function(){
         res.send('success');
       });
   });
});

//update an item
router.post('/update', function(req, res) {
  pg.connect(process.env.DATABASE_URL, function(err, client) {
     if (err) throw err;
     client
       .query('UPDATE todo SET done='+req.body.done+' WHERE pk_id='+req.body.id)
       .on('end', function(){
         res.send('success');
       });
   });
});

module.exports = router;
