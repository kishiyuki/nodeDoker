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
  var serachname;
  var teachername =[];
  var bool;
  var c;
  console.log(req);
  connection.query('select * from users;', function(err, users) {
		if (req.user) {
				for (i = 0; i < users.length; i++) {
					if(req.user.email == users[i].email){
            id2 = users[i].id;
						profession2 = users[i].profession;
	        }
				}
    }
    connection.query('select * from events where id = ' + req.body.event_id + ';', function(err, events){
      if(events != ""){
        connection.query('select * from events_tags;', function(err, events_tags){
          connection.query('select * from tags;', function(err, tags){
            c = 0;
            tagid[0] = [];
            for(var j = 0; j<events_tags.length; j++){
              if(events[0].id == events_tags[j].event_id){
                tagid[0][c] = events_tags[j].tag_id;
                tagname[c] = tags[tagid[0][c]-1].tag;
                c++;
              }
            }
            events[0]["tags"] = tagname;
          });
        });
        connection.query('select * from events_teachers where event_id = ' + req.body.event_id + ';', function(err, events_teachers){
          if(events_teachers != ""){
            searchname = events_teachers[0].teacher_id.toString();
            if(events_teachers.length > 1){
              for(var i=1; i<events_teachers.length; i++){
                searchname = searchname + " or id = " + events_teachers[i].event_id.toString();
              }
            }
            connection.query('select * from users where id = ' + searchname + ';', function(err, teachers){
              for(var i=0; i<teachers.length; i++){
                teachername[i] = teachers[i].user_name;
              }
              events[0]["teachers"] = tagname;
            });
          }
        });
      }
      if(profession2 == "student"){
        connection.query("select * from events_students where event_id = " + req.body.event_id + " and student_id =" + id2.toString() + ";", function(err, events_students){
          if(events_students == []){
            bool = true;
            if(events[0].deadline >= new Date()){
              console.log("未参加");
            } else {
              console.log("締め切ってます");
            }
          } else {
            bool = false;
            if(events[0].last_day >= new Date()){
              console.log("参加者リスト");
            } else {
              console.log("評価確認");
            }
          }
        });
      } else if (profession2 == "teacher"){
        connection.query("select * from events_teachers where event_id = " + eventid + " and teacher_id =" + id2.toString() + ";", function(err, events_teachers){
          if(events_teachers == []){
            bool = true;
            console.log("未参加");
          } else {
            bool = false;
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
            console.log("成功");
            // res.redirect('/eventall');
          } else {
            // res.redirect('/eventall');
            console.log(err);
          }
        }
        );
      });
    } else if (users[0].profession = "teacher"){
      connection.query('select * from events_teachers;', function(err, events_teachers){
        connection.query('insert into events_teachers set ? ;', {
          event_id: req.body.event_id,
          teacher_id: users[0].id
        },
        function(err, success){
          if (err == null) {
            console.log("成功");
            // res.redirect('/eventall');
          } else {
            // res.redirect('/eventall');
            console.log(err);
          }
        }
        );
      });
    }
  });
});
module.exports = router;
