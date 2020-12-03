var express = require('express');
var router = express.Router();
let mysql = require('mysql2');
const { body, validationResult } = require('express-validator');
let connection = mysql.createConnection({
  host: 'mysql',
  user: 'root',
  password: 'secret',
  database: 'portfoliopj'
});

router.get('/', function(req, res, next){
  connection.query('select * user_name from users where profession = "teacher";', function(err, teachers){
    connection.query('select * from tags;', function(err, tags){
      res.render('auth/eventcreate', {teachers,tags});
    });
  });
});
router.post('/', [body("event_name").not().isEmpty().withMessage("イベント名を入力してください。").isLength({min:0,max:30000}).withMessage("イベント名が長過ぎます。"),
                  body("start_day").isISO8601().withMessage("開催日を入力してください。").isAfter(getStringFromDate(new Date())).withMessage("開催日が過ぎています。"),
                  body("last_day").isISO8601().withMessage("終了日を入力してください。").isAfter(getStringFromDate(new Date())).withMessage("終了日が過ぎています。"),
                  body("comments").not().isEmpty().withMessage("イベントの詳細を入力してください。").isLength({min:0,max:30000}).withMessage("イベント詳細が長過ぎます。"),
                  body("deadline").isISO8601().withMessage("申し込み締切日を入力してください。").isAfter(getStringFromDate(new Date())).withMessage("申し込み締切日が過ぎています。")
],(req, res, next) =>{
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    res.redirect('/eventcreate');
  }　else {
    var now = getStringFromDate(new Date());
    connection.query('select * from events;', function(err, events){
      connection.query('insert into events set ? ;', {
        event_name: req.body.event_name,
        start_day: req.body.start_day,
        last_day: req.body.last_day,
        comments: req.body.comments,
        deadline: req.body.deadline,
        created_at: now,
        updated_at: now
      },function(err, success){
        if (err == null) {
          connection.query('select * from events where event_name = "' + req.body.event_name + '" and created_at = "' + now.toString() +'";', function(err, events2){
            for(var i = 0; i<req.body.tags.length; i++){
              connection.query('insert into events_tags set ? ;', {
                event_id: events2[0].id,
                tags_id: req.body.tags[i],
              },function(err, success2){
                if(err == null){
                  console.log("a");
                } else {
                  console.log(err);
                }
              }
              );
            }
            for(var i = 0; i<req.body.teachers.length; i++){
              connection.query('insert into events_teachers set ? ;', {
                event_id: events2[0].id,
                teacher_id: req.body.teachers[i],
              },function(err, success2){
                if(err == null){
                  console.log("b");
                } else {
                  console.log(err);
                }
              }
              );
            }
          });
          connection.query('select * from users;', function(err, users) {
        		if (req.user) {
              let name2 ="";
        			for (i = 0; i < users.length; i++) {
        				if(req.user.email == users[i].email){
        	        name2 = users[i].user_name;
        	      }
        			}
              res.render('auth/mypage1', {
            		userName: name2,
            		email: req.user.email
          		});
            }
          });
        }else {
          console.log(err);
          res.redirect('/eventcreate');
        }
      }
      );
    });
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
module.exports = router;
