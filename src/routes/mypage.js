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
  var searchname =" and sender_id = 99999";
  var searchname2 =" and sender_id = 99999";
  const ss = Array.from({ length: 3 }, () => 0);
  const ts = Array.from({ length: 3 }, () => 0);
  var tactionscore = 0;
  var tthinkscore = 0;
  var tteamscore = 0;
  var ttotalactionscore = 0;
  var ttotalthinkscore = 0;
  var ttotalteamscore = 0;
  var sactionscore = 0;
  var sthinkscore = 0;
  var steamscore = 0;
  var stotalactionscore = 0;
  var stotalthinkscore = 0;
  var stotalteamscore = 0;
  const social = Array.from({ length: 12 }, () => 0);
  const social2 = Array.from({ length: 12 }, () => 0);
  

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
          console.log(ev);
          if(ev.length != 0){
            if(ev.length > 1){
            searchid = ev[0].event_id.toString();
              for(var i =1; i<ev.length; i++){
                searchid = searchid + " or id = " + ev[i].event_id.toString();
              }
            }
          }
          connection.query("select * from events where id = " + searchid + ";", function(err, events){
            if(events.length != 0){
              connection.query('select * from events_tags;', function(err, events_tags){
                connection.query('select * from tags;', function(err, tags){
                  for(var i = 0; i<events.length; i++){
                    tagid[i] = [];
                    c = 0;
                    var tagname = [];
                    for(var j = 0; j<events_tags.length; j++){
                      if(events[i].id == events_tags[j].event_id){
                        tagid[i][c] = events_tags[j].tags_id;
                        tagname[c] = tags[tagid[i][c]-1].tag;
                        c++;
                      }
                    }
                    events[i]["tags"] = tagname;
                  }
                  // console.log(events);
                  connection.query('select * from users where profession = "student";', function(err, studentid){
                    if(studentid.length != 0){
                      searchname = " and (sender_id = " + studentid[0].id.toString();
                      for(var i = 1; i<studentid.length; i++){
                      searchname = searchname + " or sender_id = " + studentid[i].id.toString();
                      }
                      searchname = searchname + ")"
                    }
                    console.log(searchname);
                    connection.query('select * from evaluates where receiver_id = ' + id2.toString() + searchname + ';', function(err, student){
                      console.log(student);
                      if(student.length != 0){
                        for(var i = 0; i<student.length; i++){
                          stotalactionscore = stotalactionscore + student[i].action;
                          stotalthinkscore = stotalthinkscore + student[i].think;
                          stotalteamscore = stotalteamscore + student[i].team;
                        }
                          sactionscore = Math.round(stotalactionscore/student.length*10) /10;
                          sthinkscore = Math.round(stotalthinkscore/student.length*10) /10;
                          steamscore = Math.round(stotalteamscore/student.length*10) /10;
                      }
                      ss[0] = {
                        action:sactionscore
                      }
                      ss[1] = {
                        think:sthinkscore
                      }
                      ss[2] = {
                        team:steamscore
                      }
                      connection.query('select * from evaluates_free;', function(err, evaluates_free){
                        connection.query('select * from free;', function(err, free){
                          for(var i = 0; i<free.length; i++){
                            social[i] = {
                              name:free[i].freedom,　
                              count:0
                            }
                          }
                          if(student.length != 0){
                          for(var i = 0; i<student.length; i++){
                            for(var j = 0; j<evaluates_free.length; j++){
                              if(student[i].id == evaluates_free[j].evaluate_id){
                                if(evaluates_free[j].free_id == 1){
                                  social[0].count++;
                                } else if(evaluates_free[j].free_id == 2){
                                  social[1].count++;
                                } else if(evaluates_free[j].free_id == 3){
                                  social[2].count++;
                                } else if(evaluates_free[j].free_id == 4){
                                  social[3].count++;
                                } else if(evaluates_free[j].free_id == 5){
                                  social[4].count++;
                                } else if(evaluates_free[j].free_id == 6){
                                  social[5].count++;
                                } else if(evaluates_free[j].free_id == 7){
                                  social[6].count++;
                                } else if(evaluates_free[j].free_id == 8){
                                  social[7].count++;
                                } else if(evaluates_free[j].free_id == 9){
                                  social[8].count++;
                                } else if(evaluates_free[j].free_id == 10){
                                  social[9].count++;
                                } else if(evaluates_free[j].free_id == 11){
                                  social[10].count++;
                                } else if(evaluates_free[j].free_id == 12){
                                  social[11].count++;
                                }
                              }
                            }
                          }
                          }
                          connection.query('select * from users where profession = "teacher";', function(err, teacherid){
                            if(teacherid.length != 0){
                              searchname2 = " and (sender_id = " + teacherid[0].id.toString();
                              for(var i = 1; i<teacherid.length; i++){
                              searchname2 = searchname2 + " or sender_id = " + teacherid[i].id.toString();
                              }
                              searchname2 = searchname2 + ")"
                            }
                            connection.query('select * from evaluates where receiver_id = ' + id2.toString() + searchname2 + ';', function(err, teacher){
                              if(teacher.length != 0){
                                for(var i = 0; i<teacher.length; i++){
                                  ttotalactionscore = ttotalactionscore + teacher[i].action;
                                  ttotalthinkscore = ttotalthinkscore + teacher[i].think;
                                  ttotalteamscore = ttotalteamscore + teacher[i].team;
                                }
                                tactionscore = Math.round(ttotalactionscore/teacher.length*10) /10;
                                tthinkscore = Math.round(ttotalthinkscore/teacher.length*10) /10;
                                tteamscore = Math.round(ttotalteamscore/teacher.length*10) /10;
                                ts[0] = {
                                  action:tactionscore
                                }
                                ts[1] = {
                                  think:tthinkscore
                                }
                                ts[2] = {
                                  team:tteamscore
                                }
                                for(var i = 0; i<free.length; i++){
                                  social2[i] = {
                                    name:free[i].freedom,
                                    count:0
                                  }
                                }
                                if(teacher.length != 0){
                                for(var i = 0; i<teacher.length; i++){
                                  for(var j = 0; j<evaluates_free.length; j++){
                                    if(teacher[i].id == evaluates_free[j].evaluate_id){
                                      if(evaluates_free[j].free_id == 1){
                                        social2[0].count++;
                                      } else if(evaluates_free[j].free_id == 2){
                                        social2[1].count++;
                                      } else if(evaluates_free[j].free_id == 3){
                                        social2[2].count++;
                                      } else if(evaluates_free[j].free_id == 4){
                                        social2[3].count++;
                                      } else if(evaluates_free[j].free_id == 5){
                                        social2[4].count++;
                                      } else if(evaluates_free[j].free_id == 6){
                                        social2[5].count++;
                                      } else if(evaluates_free[j].free_id == 7){
                                        social2[6].count++;
                                      } else if(evaluates_free[j].free_id == 8){
                                        social2[7].count++;
                                      } else if(evaluates_free[j].free_id == 9){
                                        social2[8].count++;
                                      } else if(evaluates_free[j].free_id == 10){
                                        social2[9].count++;
                                      } else if(evaluates_free[j].free_id == 11){
                                        social2[10].count++;
                                      } else if(evaluates_free[j].free_id == 12){
                                        social2[11].count++;
                                      }
                                    }
                                  }
                                }
                                }
                                social.sort(compare);
                                social2.sort(compare);
                                console.log(events);
                                console.log(ss);
                                console.log(ts);
                                console.log(social);
                                console.log(social2);
                                res.render('auth/mypage2', {
                                userName: username,
                                email: req.user.email,
                                events
                                });
                              }
                            });
                          });
                        });
                      });
                    });
                  });
                });
              });
              }else{
                console.log(events); 
                res.render('auth/mypage2', {
                userName: username,
                email: req.user.email,
                events
                });
              }
            });
          });
				} else if(profession2 == "teacher"){
          connection.query("select * from events_teachers where teacher_id = " + id2.toString() + ";", function(err, ev){
            if(ev.length != 0){
              searchid = ev[0].event_id.toString();
              if(ev.length > 1){
                for(var i =1; i<ev.length; i++){
                  searchid = searchid + " or id = " + ev[i].event_id.toString();
                }
              }
            }
            connection.query("select * from events where id = " + searchid + ";", function(err, events){
              if(events.length != 0){
                connection.query('select * from events_tags;', function(err, events_tags){
                  connection.query('select * from tags;', function(err, tags){
                    for(var i = 0; i<events.length; i++){
                      tagid[i] = [];
                      c = 0;
                      var tagname = [];
                      for(var j = 0; j<events_tags.length; j++){
                        if(events[i].id == events_tags[j].event_id){
                          tagid[i][c] = events_tags[j].tags_id;
                          tagname[c] = tags[tagid[i][c]-1].tag;
                          c++;
                        }
                      }
                      events[i]["tags"] = tagname;
                    }
                    console.log(events);
                    res.render('auth/mypage3', {
                    userName: username,
                    email: req.user.email,
                    events
                    });
                  });
                });
              } else {
                res.render('auth/mypage3', {
                  userName: username,
                  email: req.user.email,
                  events
                  });
              }
            });
          });
        } else {
          res.redirect('/signin');
        }
		} else {
				res.redirect('/signin');
		}
	});
});

function compare( a, b ){
  var r = 0;
  if( a.count > b.count ){ r = -1; }
  else if( a.count < b.count ){ r = 1; }

  return r;
}

module.exports = router;
