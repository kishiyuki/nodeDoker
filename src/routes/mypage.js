var express = require('express');
var router = express.Router();
let mysql = require('mysql2');
let connection = mysql.createConnection({
  host: 'mysql',
  user: 'root',
  password: 'secret',
  database: 'portfoliopj'
});

/* GET home page. */
router.get('/', function(req, res, next) {
  var tagid = [];
  var c;
  var searchid ="99999";
  var searchname ="99999";
  var tactionscore = 0;
  var tthinkscore = 0;
  var tteamscore = 0;
  var ttotalactionscore = 0;
  var ttotalthinkscore = 0;
  var ttotalteamscore = 0;
	connection.query('select * from users;', function(err, users) {
		if (req.user) {
			let username = "";
			let profession2 = "";
      let id2 = 0;
				for (i = 0; i < users.length; i++) {
					if(req.user.email == users[i].email){
            id2 = users[i].id;
	          username = users[i].user_name;
						profession2 = users[i].profession;
	        }
				}
				if(profession2 == "school"){
          connection.query('select * from events;', function(err, events){
      		res.render('auth/mypage1', {
        		userName: username,
        		email: req.user.email
      		});
        });
				} else if(profession2 == "student"){
          connection.query("select * from events_students where student_id = " + id2.toString() + ";", function(err, ev){
            if(ev != ""){
              searchid = ev[0].event_id.toString();
              if(ev.length > 1){
                for(var i =1; i<ev.length; i++){
                  searchid = searchid + " or id = " + ev[i].event_id.toString();
                }
              }
            }
            connection.query("select * from events where id = " + searchid + ";", function(err, events){
              if(events != ""){
                connection.query('select * from events_tags;', function(err, events_tags){
                  connection.query('select * from tags;', function(err, tags){
                    for(var i = 0; i<events.length; i++){
                      tagid[i] = [];
                      c = 0;
                      var tagname = [];
                      for(var j = 0; j<events_tags.length; j++){
                        if(events[i].id == events_tags[j].event_id){
                          tagid[i][c] = events_tags[j].tag_id;
                          tagname[c] = tags[tagid[i][c]-1].tag;
                          c++;
                        }
                      }
                      events[i]["tags"] = tagname;
                    }
                  });
                });
              } else{
              }
              connection.query('select * from users where profession = student;', function(err, studentid){
                if(studentid != ""){
                  searchname = " and (sender_id = " + studentid[0].id.toString();
                  for(var i = 1; i<studentid.length; i++){
                    searchname = searchname + "or sender_id = " + studentid[i].id.toString();
                  }
                  searchname = searchname + ")"
                }
              });
              connection.query('select * from evaluates where receiver_id = ' + id2.toString() + searchname + ';', function(err, evaluates_student){
                if(evaluates_student != ""){
                  for(var i = 0; i<evaluates_student.length; i++){
                    stotalactionscore = stotalactionscore + evaluates_student[i].action;
                    stotalthinkscore = stotalthinkscore + evaluates_student[i].think;
                    stotalteamscore = stotalteamscore + evaluates_student[i].team;
                  }
                  sactionscore = Math.round(stotalactionscore/evaluates_student.length*10) /10;
                  sthinkscore = Math.round(stotalthinkscore/evaluates_student.length*10) /10;
                  steamscore = Math.round(stotalteamscore/evaluates_student.length*10) /10;
                }
              });
              connection.query('select * from users where profession = teacher;', function(err, teacherid){
                if(teacherid != ""){
                  searchname = " and (sender_id = " + teacherid[0].id.toString();
                  for(var i = 1; i<teacherid.length; i++){
                    searchname = searchname + "or sender_id = " + teacherid[i].id.toString();
                  }
                  searchname = searchname + ")"
                }
              });
              connection.query('select * from evaluates where receiver_id = ' + id2.toString() + searchname + ';', function(err, evaluates_teacher){
                if(evaluates_student != ""){
                  for(var i = 0; i<evaluates_teacher.length; i++){
                    ttotalactionscore = ttotalactionscore + evaluates_teacher[i].action;
                    ttotalthinkscore = ttotalthinkscore + evaluates_teacher[i].think;
                    ttotalteamscore = ttotalteamscore + evaluates_teacher[i].team;
                  }
                  tactionscore = Math.round(ttotalactionscore/evaluates_teacher.length*10) /10;
                  tthinkscore = Math.round(ttotalthinkscore/evaluates_teacher.length*10) /10;
                  tteamscore = Math.round(ttotalteamscore/evaluates_teacher.length*10) /10;
                }
              });

                console.log(events);
                console.log(sactionscore);
                console.log(sthinkscore);
                console.log(steamscore);
                console.log(tactionscore);
                console.log(tthinkscore);
                console.log(tteamscore);
                res.render('auth/mypage2', {
                  userName: username,
                  email: req.user.email,
                  events
                });
            });
          });
				} else if(profession2 == "teacher"){
          connection.query("select * from events_teachers where teacher_id = " + id2.toString() + ";", function(err, events){
            if(ev != ""){
              var searchid = ev[0].event_id.toString();
              if(ev.length > 1){
                for(var i =1; i<ev.length; i++){
                  searchid = searchid + " or id = " + ev[i].event_id.toString();
                }
              }
            }
            connection.query("select * from events where id = " + searchid + ";", function(err, events){
              connection.query('select * from events_tags;', function(err, events_tags){
                connection.query('select * from tags;', function(err, tags){
                  if(events != ""){
                    for(var i = 0; i<events.length; i++){
                      tagid[i] = [];
                      c = 0;
                      var tagname = [];
                      for(var j = 0; j<events_tags.length; j++){
                        if(events[i].id == events_tags[j].event_id){
                          tagid[i][c] = events_tags[j].tag_id;
                          tagname[c] = tags[tagid[i][c]-1].tag;
                          c++;
                        }
                      }
                      events[i]["tags"] = tagname;
                    }
                  } else{
                  }
                  console.log(events);
                  res.render('auth/mypage3', {
                    userName: username,
                    email: req.user.email,
                    events
                  });
                });
              });
            });
          });
        } else {
              console.log("あ");
        }
			} else {
				res.redirect('/signin');
			}
	});
});

module.exports = router;
