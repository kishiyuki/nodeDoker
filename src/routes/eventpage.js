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
  let profession2 = "";
  let id2;
  var tagid = [];
  var tagname = [];
  var today = getStringFromDate(new Date());
  var today2 = new Date(today);
  var teachername =[];
  var branch;
  var c;
  var deadline;
  var lastday;
  var lastday2;
  connection.query('select * from users;', function(err, users) {
		// if (req.user) {
		// 		for (i = 0; i < users.length; i++) {
		// 			if(req.user.email == users[i].email){
    //         id2 = users[i].id;
		// 				profession2 = users[i].profession;
	  //       }
		// 		}
    // }
    if (req.user.email) {
      for (i = 0; i < users.length; i++) {
        if(req.user.email == users[i].email){
          id2 = users[i].id;
          profession2 = users[i].profession;
        }
      }
  }
    connection.query('select * from events where id = ' + req.body.event_id + ';', function(err, events){
      if(events.length != 0){
        connection.query('select * from events_tags;', function(err, events_tags){
          connection.query('select * from tags;', function(err, tags){
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
          });
        });
        connection.query('select * from events_teachers where event_id = ' + req.body.event_id + ';', function(err, events_teachers){
          if(events_teachers.length != 0){
            searchname = events_teachers[0].teacher_id.toString();
            if(events_teachers.length > 1){
              for(var i=1; i<events_teachers.length; i++){
                searchname = searchname + " or id = " + events_teachers[i].event_id.toString();
              }
            }
            connection.query('select * from users where id = ' + searchname + ';', function(err, teachers){
              if(teachers.length != 0){
                for(var i=0; i<teachers.length; i++){
                  teachername[i] = teachers[i].user_name;
                }
                events[0]["teachers"] = teachername;
              }
            });
          }
        });
      }
      lastday = getStringFromDate3(events[0].last_day);
      lastday2 = new Date(lastday);
      deadline = new Date(events[0].deadline);
      if(profession2 == "student"){
        connection.query("select * from events_students where event_id = " + req.body.event_id + " and student_id =" + id2.toString() + ";", function(err, events_students){
          console.log(events_students);
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
        });
      } else if (profession2 == "teacher"){
        connection.query("select * from events_teachers where event_id = " + req.body.event_id + " and teacher_id =" + id2.toString() + ";", function(err, events_teachers2){
          if(events_teachers2.length == 0){
            bool = 1;
            console.log("参加してないから見れないよ");
          } else {
            bool = 2;
            console.log("参加者リスト");
          }
        });
      }
      console.log(events);
    });
    // res.render('auth/eventpage', {eventid,eventname,eventday,deadline,tagname,tagid,teachername,bool});
  });
});

router.post('/', function(req, res, next){
  connection.query('select * from users where email = ' + req.user.email + ';', function(err, users){
    if(users[0].profession = "student"){
      connection.query('select * from events_students;', function(err, events_students){
        connection.query('insert into events_students set ? ;', {
          event_id: req.body.event_id,
          student_id: users[0].id
        },
        function(err, success){
          if (err == null) {
            console.log("成功したのでイベントallに戻る");
            // res.redirect('/eventall');
          } else {
            console.log("ミスしたのでイベントページに戻る");
            // res.redirect('/eventall');
            console.log(err);
          }
        }
        );
      });
    // } else if (users[0].profession = "teacher"){
    //   connection.query('select * from events_teachers;', function(err, events_teachers){
    //     connection.query('insert into events_teachers set ? ;', {
    //       event_id: req.body.event_id,
    //       teacher_id: users[0].id
    //     },
    //     function(err, success){
    //       if (err == null) {
    //         console.log("成功");
    //         // res.redirect('/eventall');
    //       } else {
    //         // res.redirect('/eventall');
    //         console.log(err);
    //       }
    //     }
    //     );
    //   });
    // }
    } else {
      console.log("参加資格がないのでイベントページに戻る");
    }
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
