var express = require('express');
var router = express.Router();
let mysql = require('mysql2');
const { body, validationResult } = require('express-validator');
const IOST = require('@kunroku/iost')
const KeyPair = require('iost/lib/crypto/key_pair');
const bs58 = require('bs58');
const crypto = require('crypto');
const iost = new IOST({
  host: 'http://192.168.16.2:30001',
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

router.get('/', function(req, res, next){
    var a;
    var b;
    a = getHistory(
        'ContractFZumGwygKvhqGXmZgQhphsKc8EXq1NHw5o52ZRoz8V5s',
        'admin',
        'aaa'
    );
    b = getHistory(
        'ContractFZumGwygKvhqGXmZgQhphsKc8EXq1NHw5o52ZRoz8V5s',
        'admin',
        'a'
    );
    
    console.log(a);
    console.log(b);
    res.render('auth/signup', {});
//     let profession2 = "";
//     let id2;
//     var tagid = [];
//     var tagname = [];
//     var today = getStringFromDate(new Date());
//     var today2 = new Date(today);
//     var teachername =[];
//     var branch;
//     var c;
//     var deadline;
//     var lastday;
//     var lastday2;
//     connection.query('select * from users;', function(err, users) {
//       if (req.user) {
//         for (i = 0; i < users.length; i++) {
//           if(req.user.email == users[i].email){
//             id2 = users[i].id;
//             profession2 = users[i].profession;
//           }
//         }
//     connection.query('select * from events where id = ' + req.body.event_id + ';', function(err, events){
//         if(events.length != 0){
//             connection.query('select * from events_tags;', function(err, events_tags){
//                 if(events_tags.length != 0){
//                     connection.query('select * from tags;', function(err, tags){
//                         c = 0;
//                         tagid[0] = [];
//                         for(var j = 0; j<events_tags.length; j++){
//                             if(events[0].id == events_tags[j].event_id){
//                                 tagid[0][c] = events_tags[j].tags_id;
//                                 tagname[c] = tags[tagid[0][c]-1].tag;
//                                 c++;
//                             }
//                         }
//                         events[0]["tags"] = tagname;
//                     });
//                 }
//             });
//             connection.query('select * from events_teachers where event_id = ' + req.body.event_id + ';', function(err, events_teachers){
//                 if(events_teachers.length != 0){
//                     searchname = events_teachers[0].teacher_id.toString();
//                     if(events_teachers.length > 1){
//                         for(var i=1; i<events_teachers.length; i++){
//                         searchname = searchname + " or id = " + events_teachers[i].event_id.toString();
//                         }
//                     }
//                     connection.query('select * from users where id = ' + searchname + ';', function(err, teachers){
//                         if(teachers.length != 0){
//                             for(var i=0; i<teachers.length; i++){
//                                 teachername[i] = teachers[i].user_name;
//                             }
//                             events[0]["teachers"] = teachername;
//                         }
//                     });
//                 }
//             });
//         }
//         connection.query('select * from evaluates where receiver_id = ' + id2.toString() + " and event_id = " + req.body.event_id + ';', function(err, student){
//             if(student.length != 0){
//               for(var i = 0; i<student.length; i++){
                  
//                 stotalactionscore = stotalactionscore + student[i].action;
//                 stotalthinkscore = stotalthinkscore + student[i].think;
//                 stotalteamscore = stotalteamscore + student[i].team;
//               }
//                 sactionscore = Math.round(stotalactionscore/student.length*10) /10;
//                 sthinkscore = Math.round(stotalthinkscore/student.length*10) /10;
//                 steamscore = Math.round(stotalteamscore/student.length*10) /10;
//             }
//             ss[0] = {
//               action:sactionscore
//             }
//             ss[1] = {
//               think:sthinkscore
//             }
//             ss[2] = {
//               team:steamscore
//             }
//             connection.query('select * from evaluates_free;', function(err, evaluates_free){
//               connection.query('select * from free;', function(err, free){
//                 for(var i = 0; i<free.length; i++){
//                   social[i] = {
//                     name:free[i].freedom,　
//                     count:0
//                   }
//                 }
//                 if(student.length != 0){
//                 for(var i = 0; i<student.length; i++){
//                   for(var j = 0; j<evaluates_free.length; j++){
//                     if(student[i].id == evaluates_free[j].evaluate_id){
//                       if(evaluates_free[j].free_id == 1){
//                         social[0].count++;
//                       } else if(evaluates_free[j].free_id == 2){
//                         social[1].count++;
//                       } else if(evaluates_free[j].free_id == 3){
//                         social[2].count++;
//                       } else if(evaluates_free[j].free_id == 4){
//                         social[3].count++;
//                       } else if(evaluates_free[j].free_id == 5){
//                         social[4].count++;
//                       } else if(evaluates_free[j].free_id == 6){
//                         social[5].count++;
//                       } else if(evaluates_free[j].free_id == 7){
//                         social[6].count++;
//                       } else if(evaluates_free[j].free_id == 8){
//                         social[7].count++;
//                       } else if(evaluates_free[j].free_id == 9){
//                         social[8].count++;
//                       } else if(evaluates_free[j].free_id == 10){
//                         social[9].count++;
//                       } else if(evaluates_free[j].free_id == 11){
//                         social[10].count++;
//                       } else if(evaluates_free[j].free_id == 12){
//                         social[11].count++;
//                       }
//                     }
//                   }
//                 }
//                 }
//                 connection.query('select * from users where profession = "teacher";', function(err, teacherid){
//                   if(teacherid.length != 0){
//                     searchname2 = " and (sender_id = " + teacherid[0].id.toString();
//                     for(var i = 1; i<teacherid.length; i++){
//                     searchname2 = searchname2 + " or sender_id = " + teacherid[i].id.toString();
//                     }
//                     searchname2 = searchname2 + ")"
//                   }
//                   connection.query('select * from evaluates where receiver_id = ' + id2.toString() + searchname2 + ';', function(err, teacher){
//                     if(teacher.length != 0){
//                       for(var i = 0; i<teacher.length; i++){
//                         ttotalactionscore = ttotalactionscore + teacher[i].action;
//                         ttotalthinkscore = ttotalthinkscore + teacher[i].think;
//                         ttotalteamscore = ttotalteamscore + teacher[i].team;
//                       }
//                       tactionscore = Math.round(ttotalactionscore/teacher.length*10) /10;
//                       tthinkscore = Math.round(ttotalthinkscore/teacher.length*10) /10;
//                       tteamscore = Math.round(ttotalteamscore/teacher.length*10) /10;
//                       ts[0] = {
//                         action:tactionscore
//                       }
//                       ts[1] = {
//                         think:tthinkscore
//                       }
//                       ts[2] = {
//                         team:tteamscore
//                       }
//                       for(var i = 0; i<free.length; i++){
//                         social2[i] = {
//                           name:free[i].freedom,
//                           count:0
//                         }
//                       }
//                       if(teacher.length != 0){
//                       for(var i = 0; i<teacher.length; i++){
//                         for(var j = 0; j<evaluates_free.length; j++){
//                           if(teacher[i].id == evaluates_free[j].evaluate_id){
//                             if(evaluates_free[j].free_id == 1){
//                               social2[0].count++;
//                             } else if(evaluates_free[j].free_id == 2){
//                               social2[1].count++;
//                             } else if(evaluates_free[j].free_id == 3){
//                               social2[2].count++;
//                             } else if(evaluates_free[j].free_id == 4){
//                               social2[3].count++;
//                             } else if(evaluates_free[j].free_id == 5){
//                               social2[4].count++;
//                             } else if(evaluates_free[j].free_id == 6){
//                               social2[5].count++;
//                             } else if(evaluates_free[j].free_id == 7){
//                               social2[6].count++;
//                             } else if(evaluates_free[j].free_id == 8){
//                               social2[7].count++;
//                             } else if(evaluates_free[j].free_id == 9){
//                               social2[8].count++;
//                             } else if(evaluates_free[j].free_id == 10){
//                               social2[9].count++;
//                             } else if(evaluates_free[j].free_id == 11){
//                               social2[10].count++;
//                             } else if(evaluates_free[j].free_id == 12){
//                               social2[11].count++;
//                             }
//                           }
//                         }
//                       }
//                       }
//                       social.sort(compare);
//                       social2.sort(compare);
//                       console.log(events);
//                       console.log(ss);
//                       console.log(ts);
//                       console.log(social);
//                       console.log(social2);
//                       res.render('auth/mypage2', {
//                       userName: username,
//                       email: req.user.email,
//                       events
//                       });
//                     }
//                   });
//                 });
//               });
//             });
//         });
//         console.log(events);
//       });
//       // res.render('auth/eventpage', {eventid,eventname,eventday,deadline,tagname,tagid,teachername,bool});
//     });
//   });
  
//   router.post('/', function(req, res, next){
//     connection.query('select * from users where email = ' + req.user.email + ';', function(err, users){
//       if(users[0].profession = "student"){
//         connection.query('select * from events_students;', function(err, events_students){
//           connection.query('insert into events_students set ? ;', {
//             event_id: req.body.event_id,
//             student_id: users[0].id
//           },
//           function(err, success){
//             if (err == null) {
//               console.log("成功したのでイベントallに戻る");
//               // res.redirect('/eventall');
//             } else {
//               console.log("ミスしたのでイベントページに戻る");
//               // res.redirect('/eventall');
//               console.log(err);
//             }
//           }
//           );
//         });
//       } else {
//         console.log("参加資格がないのでイベントページに戻る");
//       }
//     });
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
      async function getHistory(address, id, attr) {
        const history = [];
        (await async function recursive(current) {
          if (current === null) return;
          const { receipts } = await iost.rpc.transaction.getTxReceiptByTxHash(current);
          const item = receipts
            .filter(({ func_name }) => func_name === `${address}/add`)
            .map(({ content }) => JSON.parse(content))
            .filter(item => item.attr === attr)[0];
          history.unshift(item.action);
          await recursive(item.prev);
        }((await iost.rpc.blockchain.getContractStorage(address, id, attr)).data));
        return history;
      }
  module.exports = router;