// const { performance } = require('perf_hooks');
const fs = require("fs");
var express = require('express');
var router = express.Router();
let mysql = require('mysql2');
const util = require('util');
const { body, validationResult } = require('express-validator');
const IOST = require('@kunroku/iost')
const bs58 = require('bs58');
const crypto = require('crypto');
const iost = new IOST({
  host: 'http://iost:30001',
  chainId: 1020,
  gasLimit: 1000000
});
const creatorId = 'admin';
const secretKey = '2yquS3ySrGWPEKywCPzX4RTJugqRh7kJSo5aehsLYPEWkUxBWA39oMrZ7ZxuM4fgyXYs2cPwh5n8aNNpH5x2VyK1';
const account = new IOST.Account(creatorId);
const kp = new IOST.KeyPair.Ed25519(IOST.Bs58.decode(secretKey));
account.addKeyPair("active",kp);
account.addKeyPair("owner",kp);
iost.setPublisher(account);
let connection = mysql.createConnection({
  host: 'mysql',
  user: 'root',
  password: 'secret',
  database: 'portfoliopj'
});
const query = util.promisify(connection.query).bind(connection);
router.get('/', function(req, res, next){
  let profession = "";
  let bool = false;
  let obj = {};
  let sender = {};
  let receiver = {};
  let eventlist = [];
  async function getESR(){
    const users = await query('select id,user_name,email,profession from users;');
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
      if(events_students_con.length != 0){
        bool = true;
      }
    } else if (profession == "teacher"){
      const events_teachers_con = await query('select * from events_teachers where event_id = ' + req.query.event_id + ' and teacher_id = ' + id +';');
      if(events_teachers_con.length != 0){
        bool = true;
      }
    }
    if(bool){
      const events = await query('select * from events where id = ' + req.query.event_id + ';');
      if(users.length != 0){
        for (i = 0; i < users.length; i++) {
          if(req.user.email == users[i].email){
            sender = users[i];
          }
          if(req.query.receiver_id == users[i].id){
            receiver = users[i];
          }
        }
      }
      eventlist = events;
      obj = {
        eventlist:eventlist,
        sender:sender,
        receiver:receiver,
        status:200
      }
      res.json(obj);
    } else{
      console.log("マイページへ")
      obj = {
        status:400
      }
      res.json(obj);
    }
  }

  if(req.user){
    getESR();
  } else {
    console.log("sign inへ")
    obj = {
      status:401
    }
    res.json(obj);
  }
});

router.post('/', [body("action").not().isEmpty().withMessage("アクションを入力してください。").isNumeric().withMessage("アクションに数字を入力してください。"),
                  body("think").not().isEmpty().withMessage("思考を入力してください。").isNumeric().withMessage("思考に数字を入力してください。"),
                  body("team").not().isEmpty().withMessage("チームを入力してください。").isNumeric().withMessage("チームに数字を入力してください。")
                　],(req, res, next) =>{
  const errors = validationResult(req);
  let profession = "";
  let bool = false;
  let obj = {};
  let sender = {};
  let receiver = {};
  let eventlist = [];
  async function getESR(){
    const users = await query('select id,user_name,email,profession from users;');
    const events = await query('select * from events where id = ' + req.body.event_id + ';');
    // if (req.user.email) {
    //   for (i = 0; i < users.length; i++) {
    //     if(req.user.email == users[i].email){
    //       id = users[i].id;
    //       profession = users[i].profession;
    //     }
    //   }
    // }
    if (req.body.email) {
      for (i = 0; i < users.length; i++) {
        if(req.body.email == users[i].email){
          id = users[i].id;
          profession = users[i].profession;
        }
      }
    }
    if(profession == "student"){
      const events_students_con = await query('select * from events_students where event_id = ' + req.body.event_id + ' and student_id = ' + id +';');
      if(events_students_con.length != 0){
        bool = true;
      }
    } else if (profession == "teacher"){
      const events_teachers_con = await query('select * from events_teachers where event_id = ' + req.body.event_id + ' and teacher_id = ' + id +';');
      if(events_teachers_con.length != 0){
        bool = true;
      }
    }
    if(bool){
      // if(users.length != 0){
      //   for (i = 0; i < users.length; i++) {
      //     if(req.user.email == users[i].email){
      //       sender = users[i];
      //     }
      //     if(req.body.receiver_id == users[i].id){
      //       receiver = users[i];
      //     }
      //   }
      // }
      if(users.length != 0){
        for (i = 0; i < users.length; i++) {
          if(req.body.email == users[i].email){
            sender = users[i];
          }
          if(req.body.receiver_id == users[i].id){
            receiver = users[i];
          }
        }
      }
      eventlist = events;
      obj = {
        eventlist:eventlist,
        sender:sender,
        receiver:receiver,
        status:401
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
  async function getSR(){
    const users = await query('select id,user_name,email,profession from users;');
    // if (req.user.email) {
    //   for (i = 0; i < users.length; i++) {
    //     if(req.user.email == users[i].email){
    //       id = users[i].id;
    //       profession = users[i].profession;
    //     }
    //   }
    // }
    if (req.body.email) {
      for (i = 0; i < users.length; i++) {
        if(req.body.email == users[i].email){
          id = users[i].id;
          profession = users[i].profession;
        }
      }
    }
    if(profession == "student"){
      const events_students_con = await query('select * from events_students where event_id = ' + req.body.event_id + ' and student_id = ' + id +';');
      if(events_students_con != 0){
        bool = true;
      }
    } else if (profession == "teacher"){
      const events_teachers_con = await query('select * from events_teachers where event_id = ' + req.body.event_id + ' and teacher_id = ' + id +';');
      if(events_teachers_con != 0){
        bool = true;
      }
    }
    if(users.length != 0){
      for (i = 0; i < users.length; i++) {
        // if(req.user.email == users[i].email){
        //   sender = users[i];
        // }
        // if(req.body.receiver_id == users[i].id){
        //   receiver = users[i];
        // }
        if(req.body.email == users[i].email){
          sender = users[i];
        }
        if(req.body.receiver_id == users[i].id){
          receiver = users[i];
        }
      }
    }
  }
  let address = "";
  let dtx;
  let handler;
  async function destroy(){
    // if(bool){
      address = req.body.event_id.toString() + "_" + sender.id.toString() + "_" + req.body.receiver_id.toString();
      const evaluates = await query('select * from evaluates where event_id = ' + req.body.event_id.toString() + ' and sender_id = ' + sender.id.toString() + ' and receiver_id = ' + req.body.receiver_id.toString() + ';');
      if(evaluates.length != 0){
        dtx = iost.call("ContractECj2cXk7iQW4i3uDCTXTkVpVL2PvkDr3zdpFbvvDoGSG", "destroy", [address]);
        iost.signAndSend(dtx);
        handler = iost.signAndSend(dtx);
        handler.listen();
        handler.onPending(console.log);
        handler.onSuccess(console.log);
        handler.onFailed(console.log);
        connection.query('delete from evaluates where event_id = ' + req.body.event_id.toString() + ' and sender_id = ' + sender.id.toString() + ' and receiver_id = ' + req.body.receiver_id.toString() + ';', function(err, success){
          if (err == null) {
            connection.query('delete from evaluates_free where evaluate_id = ' + evaluates[0].id + ';', function(err, success2){
              if (err == null) {
              } else {
                console.log(err);
              }
            });
          } else {
            console.log(err);
          }
        });
      }
    // }
  }
  let now = getStringFromDate(new Date());
  let freeStatement = "";
  let evaluationStatement = "";
  let hash;
  let atx;
  var txEtime;
  var txStime
  async function add(){
    // if(bool){
      if(req.body.free != null){
        for(var i = 0; i<req.body.free.length; i++){
          freeStatement = freeStatement + req.body.free[i].toString();
        }
      }
      address = req.body.event_id.toString() + "_" + sender.id.toString() + "_" + req.body.receiver_id.toString();
      // console.log(address);
      evaluationStatement = req.body.action.toString() + req.body.think.toString() + req.body.team.toString() + req.body.comments.toString() + address.toString() + freeStatement;
      // console.log(evaluationStatement);
      hash = crypto.createHash('sha256').update(evaluationStatement, 'utf8').digest('hex');
      // txStime = await performance.now();
      atx = iost.call("ContractECj2cXk7iQW4i3uDCTXTkVpVL2PvkDr3zdpFbvvDoGSG", "add", [address,hash]);
      // console.log(atx);
      handler = iost.signAndSend(atx);
      handler.listen();
      // txEtime =  await performance.now();
      // await console.log("iosttime: " + (txEtime - txStime));
      handler.onPending(console.log);
      handler.onSuccess(console.log);
      handler.onFailed(console.log);
      connection.query('insert into evaluates set ? ;', {
        action: req.body.action,
        think: req.body.think,
        team: req.body.team,
        comments: req.body.comments,
        txhash: address,
        event_id: req.body.event_id,
        sender_id: sender.id,
        receiver_id: req.body.receiver_id,
        created_at: now,
      },
      function(err, success){
        if (err == null) {
          connection.query('select * from evaluates where txhash = "' + address + '";', function(err, evaluates2){
            if(req.body.free.length != 0){
              for(var i = 0; i<req.body.free.length; i++){
                connection.query('insert into evaluates_free set ? ;', {
                  evaluate_id: evaluates2[0].id,
                  free_id: req.body.free[i]
                },function(err, success3){
                  if (err == null) {
                  } else {
                    console.log(err);
                  }
                }
                );
              }
            }
          });
        } else {
          console.log(err);
        }
      });
    // }
  }
  async function total(){
    await getSR();
    await destroy();
    await add();
    // console.log("参加者リストへ")
    obj = {
      status:200
    }
    res.json(obj);
  }
  // if(req.user){
    if (!errors.isEmpty()) {
      getESR();
    }else {
    // async function aaaa(){
    //   var startTime = await performance.now();
      total();
      // var endTime = await performance.now();
      // try{
      //   fs.appendFileSync("all.txt", (endTime - startTime) + "\n");
      //   fs.appendFileSync("iost.txt", (txEtime - txStime) + "\n");
      // }
      // catch(e){
      //   console.log(e.message);
      // }
      // console.log("alltime: " + (endTime - startTime));
    }
  // } else {
  //   console.log("sign inへ")
  //   obj = {
  //     status:401
  //   }
  //   res.json(obj);
  // }
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
