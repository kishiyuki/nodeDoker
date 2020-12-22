var express = require('express');
var router = express.Router();
let mysql = require('mysql2');
const util = require('util');
const { body, validationResult } = require('express-validator');
const { create } = require('domain');
let connection = mysql.createConnection({
  host: 'mysql',
  user: 'root',
  password: 'secret',
  database: 'portfoliopj'
});
const query = util.promisify(connection.query).bind(connection);
router.get('/', function(req, res, next){
  console.log(req.user);
  let obj;
  let teachers;
  let tags;
  let profession;
  async function create(){
    const users = await query('select * from users;');
    if (req.user.email) {
      for (i = 0; i < users.length; i++) {
        if(req.user.email == users[i].email){
          profession = users[i].profession;
        }
      }
    }
    if(profession == "school"){
      const teacher = await query('select user_name from users where profession = "teacher";');
      const tag = await query('select * from tags;');
      teachers = teacher;
      tags = tag;
      obj = {
        teachers:teachers,
        tags:tags
      }
      res.json(obj);
    } else {
      console.log("学校アカウントじゃ無いから作成できないよ。マイページへ");
      obj = {
        status:400
      }
      res.json(obj);
    }
  }
  if(req.user){
    create();
  } else {
    console.log("sign inページへ");
    obj = {
      status:401
    }
    res.json(obj);
  }
});
router.post('/', [body("event_name").not().isEmpty().withMessage("イベント名を入力してください。").isLength({min:0,max:30000}).withMessage("イベント名が長過ぎます。"),
                  body("start_day").isISO8601().withMessage("開催日を入力してください。").isAfter(getStringFromDate(new Date())).withMessage("開催日が過ぎています。"),
                  body("last_day").isISO8601().withMessage("終了日を入力してください。").isAfter(getStringFromDate(new Date())).withMessage("終了日が過ぎています。"),
                  body("comments").not().isEmpty().withMessage("イベントの詳細を入力してください。").isLength({min:0,max:30000}).withMessage("イベント詳細が長過ぎます。"),
                  body("deadline").isISO8601().withMessage("申し込み締切日を入力してください。").isAfter(getStringFromDate(new Date())).withMessage("申し込み締切日が過ぎています。")
],(req, res, next) =>{
  const errors = validationResult(req);
  let obj;
  async function create(){
    const teachers = await query('select user_name from users where profession = "teacher";');
    const tags = await query('select * from tags;');
    teachers = teacher;
    tags = tag;
    obj = {
      teachers:teachers,
      tags:tags,
      status:400
    }
    res.json(obj);
  }
  let now = getStringFromDate(new Date());
  async function add(){
    const users = await query('select * from users;');
    if (req.user.email) {
      for (i = 0; i < users.length; i++) {
        if(req.user.email == users[i].email){
          profession = users[i].profession;
        }
      }
    }
    if(profession == "school"){
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
                } else {
                  console.log(err);
                }
              });
            }
            for(var i = 0; i<req.body.teachers.length; i++){
              connection.query('insert into events_teachers set ? ;', {
                event_id: events2[0].id,
                teacher_id: req.body.teachers[i],
              },function(err, success2){
                if(err == null){
                } else {
                  console.log(err);
                }
              });
            }
          });
          console.log("マイページへ");
          obj = {
            status:200
          }
          res.json(obj);
        }else {
          console.log(err);
          console.log("イベント作成ページへ");
          obj = {
            status:500
          }
          res.json(obj);
        }
      });
    } else {
      console.log("学校アカウントじゃ無いから作成できないよ。マイページへ");
      obj = {
        status:400
      }
      res.json(obj);
    }
  }
  if(req.user){
    if (!errors.isEmpty()) {
      create();
    }　else {
      add();
    }
  } else {
    console.log("sign inページへ");
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
module.exports = router;
