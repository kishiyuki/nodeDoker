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
  let profession2 = "";
  let id2 = 0;
  var tagid = [];
  var tagname = [];
  let eventlist = [];
  var today = getStringFromDate(new Date());
  var today2 = new Date(today);
  var teachername =[];
  var branch = 1;
  var c = 0;
  var deadline;
  var lastday;
  var lastday2;
  async function getUser() {
    const users = await query('select * from users;');
    if (req.user.email) {
      for (i = 0; i < users.length; i++) {
        if(req.user.email == users[i].email){
          id2 = users[i].id;
          profession2 = users[i].profession;
        }
      }
    }
  }
  async function addTag() {
    const events = await query('select * from events where id = ' + req.query.event_id + ';');
    if(events.length != 0){
      const events_tags = await query('select * from events_tags;');
      const tags = await query('select * from tags;');
      c = 0;
      tagid[0] = [];
      for(var j = 0; j<events_tags.length; j++){
        if(events[0].id == events_tags[j].event_id){
          tagid[0][c] = events_tags[j].tags_id;
          tagname[c] = tags[tagid[0][c]-1].tag;
          c++;
        }
      }
      events[0]["tags"] = tagname;
      eventlist = events;
    }
  }
      
  async function addTeacher() {
    const events = await query('select * from events where id = ' + req.query.event_id + ';');
    const events_teachers = await query('select * from events_teachers where event_id = ' + req.query.event_id + ';');
    if(events_teachers.length != 0){
      searchname = events_teachers[0].teacher_id.toString();
      if(events_teachers.length > 1){
        for(var i=1; i<events_teachers.length; i++){
          searchname = searchname + " or id = " + events_teachers[i].event_id.toString();
        }
      }
      const teachers = await query('select * from users where id = ' + searchname + ';');
      if(teachers.length != 0){
        for(var i=0; i<teachers.length; i++){
          teachername[i] = teachers[i].user_name;
        }
        eventlist[0]["teachers"] = teachername;
      }
    }
  }

  async function part() {
    const events = await query('select * from events where id = ' + req.query.event_id + ';');
    lastday = getStringFromDate3(events[0].last_day);
    lastday2 = new Date(lastday);
    deadline = new Date(events[0].deadline);
    if(profession2 == "student"){
      const events_students = await query("select * from events_students where event_id = " + req.query.event_id + " and student_id =" + id2.toString() + ";");
      if(events_students.length == 0){
        if(deadline >= today2){
          branch = 0;
          console.log("参加できるよ");
        } else {
          branch = 1;
          console.log("締め切ってるのでみれないよ");
        }
      } else {
        if(lastday2 >= today2){
          branch = 2;
          console.log("参加者リストのみ");
        } else {
          branch = 3;
          console.log("評価確認と参加者リスト");
        }
      }
    } else if (profession2 == "teacher"){
      const events_teachers = await query("select * from events_teachers where event_id = " + req.query.event_id + " and teacher_id =" + id2.toString() + ";");
      if(events_teachers2.length == 0){
        branch = 1;
        console.log("参加してないから見れないよ");
      } else {
        branch = 2;
        console.log("参加者リスト");
      }
    } else if(profession2 = "school"){
      branch = 2;
      console.log("参加者リスト");
    }
  }
  async function total() {
    await getUser();
    await addTag();
    await addTeacher();
    await part();
    obj = {
      eventlist:eventlist,
      branch:branch,
      status:200
    }
    res.json(obj);
  }
  if(req.user){
    total();
  } else {
    obj = {
      status:401
    }
    res.json(obj);
  }
});

router.post('/', function(req, res, next){
  async function participate() {
    const users = await query('select * from users where email = "' + req.user.email + '";');
    if(users.length != 0){
      if(users[0].profession = "student"){
        connection.query('insert into events_students set ? ;', {
          event_id: req.body.event_id,
          student_id: users[0].id
        },
        function(err, success){
          if (err == null) {
            console.log("成功したのでイベントallに戻る");
            obj = {
              status:200
            };
            res.json(obj);
          } else {
            console.log("ミスしたのでイベントページに戻る");
            obj = {
              status:500
            };
            res.json(obj);
            console.log(err);
          }
        }
        );
      } else {
        console.log("参加資格がないのでイベントページに戻る");
        obj = {
          status:400
        };
        res.json(obj);
      }
    }
  }
  if(req.user){
    participate();
  } else {
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
