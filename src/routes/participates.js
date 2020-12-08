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
  var searchname;
  var today = getStringFromDate(new Date());
  var startday;
  var lastday;
  var today2;
  var startday2;
  var lastday2;
  var branch;
  connection.query('select * from events where id = ' + req.body.event_id + ';', function(err, events){
    connection.query('select * from events_students where event_id = ' + events[0].id + ';', function(err, events_students){
      startday = getStringFromDate(events[0].start_day);
      lastday = getStringFromDate3(events[0].last_day);
      today2 = new Date(today);
      startday2 = new Date(startday);
      lastday2 = new Date(lastday);
      console.log(startday2 + "スタート");
      console.log(lastday2 + "ラスト");
      console.log(today2 + "今");
      if(events_students.length != 0){
        searchname = events_students[0].student_id;
        if(events_students.length > 1){
          for(var i = 1; i<events_students.length; i++){
            searchname = searchname + " or id = " + events_students[i].student_id;
          }
        }
      } else {
        serachname = "20 and id = 30";
      }
      console.log(startday2<=today2);
      console.log(today2<=lastday2);
      connection.query('select * from users where id = ' + searchname + ';', function(err, users){
        if (startday2<=today2 && today2<=lastday2){
          branch = 0;
          console.log(users);
          console.log(branch);
          console.log("評価できるよ！");
        } else {
          console.log(users);
          branch = 1;
          console.log(branch);
          console.log("評価できないよ！")
        }
      });
    });
  });
});
function getStringFromDate(date) {

  var year_str = date.getFullYear();
  //月だけ+1すること
  var month_str = 1 + date.getMonth();
  var day_str = date.getDate();
  var hour_str = date.getHours();
  var minute_str = date.getMinutes();
  var second_str = date.getSeconds();
  
  
  format_str = 'YYYY-MM-DD hh:mm:ss';
  format_str = format_str.replace(/YYYY/g, year_str);
  format_str = format_str.replace(/MM/g, month_str);
  format_str = format_str.replace(/DD/g, day_str);
  format_str = format_str.replace(/hh/g, hour_str);
  format_str = format_str.replace(/mm/g, minute_str);
  format_str = format_str.replace(/ss/g, second_str);
  
  return format_str;
  };

  function getStringFromDate3(date) {

    var year_str = date.getFullYear();
    //月だけ+1すること
    var month_str = 1 + date.getMonth();
    var day_str = date.getDate() + 3;
    var hour_str = date.getHours();
    var minute_str = date.getMinutes();
    var second_str = date.getSeconds();
    
    
    format_str = 'YYYY-MM-DD hh:mm:ss';
    format_str = format_str.replace(/YYYY/g, year_str);
    format_str = format_str.replace(/MM/g, month_str);
    format_str = format_str.replace(/DD/g, day_str);
    format_str = format_str.replace(/hh/g, hour_str);
    format_str = format_str.replace(/mm/g, minute_str);
    format_str = format_str.replace(/ss/g, second_str);
    
    return format_str;
    };
  module.exports = router;