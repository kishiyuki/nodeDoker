var express = require('express');
var router = express.Router();
let mysql = require('mysql2');
let connection = mysql.createConnection({
  host: 'mysql',
  user: 'root',
  password: 'secret',
  database: 'portfoliopj'
});

router.get('/', function(req, res, next){
  var serachname;
  var today = new Date();
  var startday;
  var endday;
  connection.query('select * from events where id = "' + req.body.event_id + ";'", function(err, events){
    connection.query('select * from events_students where event_id = ' + events[0].id + ';', function(err, events_students){
      startday = events[0].start_day;
      endday = events[0].last_day;
      if(events_students.length != []){
        serachname = events_students[0].id;
        if(events_students > 1){
          for(var i = 1; i<events_students.length; i++){
            searchname = searchname + " or id = " + events_students[i].id;
          }
        }
      } else {
        serachname = "20 and id = 30";
      }
      connection.query('select * from users where id = ' + searchname + ';', function(err, users){
        if (startday.getTime()<=today.getTime() && today.getTime()<=endday.getTime()+1) {
          console.log("評価できるよ！")
        } else {
          console.log("評価できないよ！")
        }
      });
    });
  });
});
