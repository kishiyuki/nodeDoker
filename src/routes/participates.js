var express = require('express');
var router = express.Router();
const mysql = require('mysql2');
const util = require('util');
let connection = mysql.createConnection({
  host: 'mysql',
  user: 'root',
  password: 'secret',
  database: 'portfoliopj'
});
setInterval(function () {
  connection.query('SELECT 1');
}, 5000);
const query = util.promisify(connection.query).bind(connection);
router.get('/', function(req, res, next){
  let obj = {};
  let id = -1;
  let profession = "";
  let bool = false;
  let searchname = "";
  let today = getStringFromDate(new Date());
  let startday;
  let lastday;
  let today2;
  let startday2;
  let lastday2;
  let branch = 1;
  let students = [];
  async function evaluate() {
    const users = await query('select * from users;');
    if (req.user.email) {
      for (i = 0; i < users.length; i++) {
        if(req.user.email == users[i].email){
          id = users[i].id;
          profession = users[i].profession;
        }
      }
    }
    if(profession == "student"){
      const events_students_con = await query('select * from events_students where event_id = ' + req.query.event_id + ' and student_id = ' + id +';');
      if(events_students_con != 0){
        bool = true;
      }
    } else if (profession == "teacher"){
      const events_teachers_con = await query('select * from events_teachers where event_id = ' + req.query.event_id + ' and teacher_id = ' + id +';');
      if(events_teachers_con != 0){
        bool = true;
      }
    } else if (profession == "school"){
      bool = true;
    }
    if(bool){
      const events = await query('select * from events where id = ' + req.query.event_id + ';');
      const events_students = await query('select * from events_students where event_id = ' + req.query.event_id + ';');
      startday = getStringFromDate(events[0].start_day);
      lastday = getStringFromDate3(events[0].last_day);
      today2 = new Date(today);
      startday2 = new Date(startday);
      lastday2 = new Date(lastday);
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
      const users = await query('select id,user_name,profession from users where id = ' + searchname + ';');
      if (startday2<=today2 && today2<=lastday2){
        branch = 0;
        console.log("評価できるよ！");
      } else {
        branch = 1;
        console.log("評価できないよ！")
      }
      students = users;
      obj = {
        eventlist:events,
        students:students,
        branch:branch,
        status:200,
        self_id:id
      }
      res.json(obj);
    } else {
      console.log("マイページへ")
      obj = {
        status:400
      }
      res.json(obj);
    }
  }
  if(req.user){
    evaluate();
  } else {
    console.log("sign inページへ")
    obj = {
      status:401
    }
    res.json(obj);
  }
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