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
  // if (req.user) {
    var c;
    var tagid = [];
    connection.query("select * from events;", function(err, events){
      connection.query('select * from events_tags;', function(err, events_tags){
        connection.query('select * from tags;', function(err, tags){
          if(events.length != 0){
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
          } else{
          }
          console.log(events);
          // res.render('auth/eventall', {ev});
        });
      });
    });
  // }else {
  //   res.redirect('/signin');
  // }
});

router.post('/', function(req, res, next){
  var tagid = [];
  var c;
  var today = getStringFromDate(new Date());
  if(req.body.tags != null){
    var i = 1;
    var a = "'" + req.body.tags[0] + "'";
    for(var j=1; j<req.body.tags.length;j++){
      a = a + ", '" + req.body.tags[j] + "'";
      i++;
    }
    console.log(a);
    console.log(i);
    var b = "SELECT * from events e WHERE " + i + " = (SELECT COUNT(*) from events_tags INNER JOIN tags ON events_tags.tags_id = tags.id WHERE e.id = events_tags.event_id AND tags.tag IN (" + a + "));";
    connection.query(b, function(err, events){
      connection.query('select * from events_tags;', function(err, events_tags){
        connection.query('select * from tags;', function(err, tags){
          if(events.length != 0){
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
          } else{
          }
          console.log(events);
        });
      });
    });
  } else if(req.body.startday != null && req.body.lastday !=null){
    connection.query('SELECT * FROM events WHERE start_day BETWEEN "' + req.body.startday + '" AND "' + req.body.lastday.toString() + '";', function(err, events){
      connection.query('select * from events_tags;', function(err, events_tags){
        connection.query('select * from tags;', function(err, tags){
          if(events.length != 0){
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
          } else{
          }
          console.log(events);
        });
      });
    });
  } else if(req.body.startday != null && req.body.lastday == null){
    connection.query('SELECT * FROM events WHERE start_day >"' + req.body.startday + '";', function(err, events){
      connection.query('select * from events_tags;', function(err, events_tags){
        connection.query('select * from tags;', function(err, tags){
          if(events.length != 0){
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
          } else{
          }
          console.log(events);
        });
      });
    });
  } else if(req.body.startday == null && req.body.lastday !=null){
    connection.query('SELECT * FROM events WHERE start_day BETWEEN "' + today + '" AND "' + req.body.lastday.toString() + '";', function(err, events){
      connection.query('select * from events_tags;', function(err, events_tags){
        connection.query('select * from tags;', function(err, tags){
          if(events.length != 0){
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
          } else{
          }
          console.log(events);
        });
      });
    });
  } else if(req.body.search != null){
    connection.query("select * from events where event_name like '" + req.body.search +"%';", function(err, events){
      connection.query('select * from events_tags;', function(err, events_tags){
        connection.query('select * from tags;', function(err, tags){
          if(events.length != 0){
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
          } else{
          }
          console.log(events);
        });
      });
    });
  } else {
    connection.query("select * from events;", function(err, events){
      connection.query('select * from events_tags;', function(err, events_tags){
        connection.query('select * from tags;', function(err, tags){
          if(events.length != 0){
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
          } else{
          }
          console.log(events);
        });
      });
    });
  }
  // res.render('auth/eventall', {events});
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
module.exports = router;
