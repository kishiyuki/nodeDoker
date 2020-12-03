var express = require('express');
var router = express.Router();
let mysql = require('mysql2');
const { body, validationResult } = require('express-validator');
const IOST = require('iost')
const KeyPair = require('iost/lib/crypto/key_pair');
const bs58 = require('bs58');
const crypto = require('crypto');
const iost = new IOST.IOST({ // will use default setting if not set
  gasRatio: 1,
  gasLimit: 100000,
  expiration: 90,
});
const rpc = new IOST.RPC(new IOST.HTTPProvider('http://192.168.16.2:30001'));
iost.setRPC(rpc);
const account = new IOST.Account("admin");
const kp = new KeyPair(bs58.decode('2yquS3ySrGWPEKywCPzX4RTJugqRh7kJSo5aehsLYPEWkUxBWA39oMrZ7ZxuM4fgyXYs2cPwh5n8aNNpH5x2VyK1'));
account.addKeyPair(kp,"owner");
account.addKeyPair(kp, "active");
iost.setAccount(account);
let connection = mysql.createConnection({
  host: 'mysql',
  user: 'root',
  password: 'secret',
  database: 'portfoliopj'
});
router.get('/', function(req, res, next){
  var sender;
  var receiver;
  connection.query('select * from users;', function(err, users) {
    connection.query('select * from users where id = ' + req.body.user_id + ';', function(err, users2) {
      connection.query('select * from events where id = ' + req.body.event_id + ';', function(err, events){
        if(users != []){
          for (i = 0; i < users.length; i++) {
            if(req.user.email == users[i].email){
            sender = users[i];
            }
          }
        }
        if(users2 != []){
          for (i = 0; i < users2.length; i++) {
            receiver = users[i];
          }
        }
        console.log(sender);
        console.log(receiver);
        console.log(events);
      });
    });
  });
});

router.post('/', [body("action").not().isEmpty().withMessage("アクションを入力してください。").isNumeric().withMessage("アクションに数字を入力してください。"),
                  body("think").not().isEmpty().withMessage("思考を入力してください。").isNumeric().withMessage("思考に数字を入力してください。"),
                  body("team").not().isEmpty().withMessage("チームを入力してください。").isNumeric().withMessage("チームに数字を入力してください。")
                　],(req, res, next) =>{
  const errors = validationResult(req);
  var sender;
  var receiver;
  if (!errors.isEmpty()) {
    console.log(errors);
    connection.query('select * from users where id = ' + req.body.sender_id + ';', function(err, users) {
      connection.query('select * from users where id = ' + req.body.receiver_id + ';', function(err, users2) {
        connection.query('select * from events where id = ' + req.body.event_id + ';', function(err, events){
          if(users != []){
            for (i = 0; i < users.length; i++) {
              sender = users[i];
            }
          }
          if(users2 != []){
            for (i = 0; i < users2.length; i++) {
              receiver = users2[i];
            }
          }
          console.log(sender);
          console.log(receiver);
          console.log(events);
        });
      });
    });
  }else {
        var address = req.body.event_id.toString() + "_" + req.body.sender_id.toString() + "_" + req.body.receiver_id.toString();
        connection.query('select * from evaluates where event_id = ' + req.body.event_id.toString() + ' and sender_id = ' + req.body.sender_id.toString() + ' and receiver_id = ' + req.body.receiver_id.toString() + ';', function(err, evaluates) {
          if(evaluates != []){
            rpc.transaction.getTxReceiptByTxHash(evaluates.txhash.toString()).then(function(retx){
              const content = JSON.parse(tx.receipts[0].content);
              if (content.action == evaluates.txhash){
                const dtx = iost.callABI("ContractCk6zmaLEtJPWqNnahYBuajMXWFpedjYXd2TUNhYSgJqC",
                "destroy",
                [content.attr]
                );
                iost.signAndSend(dtx);
              }
            });
            connection.query('delete from evaluates where event_id = ' + req.body.event_id.toString() + ' and sender_id = ' + req.body.sender_id.toString() + ' and receiver_id = ' + req.body.receiver_id.toString() + ';', function(err, success){
              if (err == null) {
                connection.query('delete from evaluates_free where id = ' + evaluates[0].id + ';', function(err, success2){
                  if (err == null) {
                  } else {
                    // res.redirect('/signup');
                    console.log(err);
                  }
                });
              } else {
                // res.redirect('/signup');
                console.log(err);
              }
            });
          }
        });
        var now = getStringFromDate(new Date());
        var freeStatement = "";
        if(req.body.free != null){
          for(var i = 0; i<req.body.free.length; i++){
            freeStatement = freeStatement + req.body.free[i].toString();
          }
        }
        var evaluationStatement = req.body.action.toString() + req.body.think.toString() + req.body.team.toString() + req.body.comments.toString() + events[0].id.toString() + address + freeStatement;
        const hash = crypto.createHash('sha256').update(evaluationStatement, 'utf8').digest('hex');
      
        const atx = iost.callABI("ContractCk6zmaLEtJPWqNnahYBuajMXWFpedjYXd2TUNhYSgJqC",
                "add",
                [address,hash]
        );
        iost.signAndSend(atx)
        .on('pending', (response) => {
          console.log("エラー");
        })
        .on('success', (response) => {
          connection.query('select * from evaluates;', function(err, evaluates){
            connection.query('insert into evaluates set ? ;', {
              action: req.body.action,
              think: req.body.think,
              team: req.body.team,
              comments: req.body.comments,
              txhash: response.tx_hash,
              event_id: req.body.event_id,
              sender_id: req.body.sender_id,
              receiver_id: req.body.reeiver_id,
              created_at: now,
            },
            function(err, success){
              if (err == null) {
                connection.query('select * from evaluates where txhash = ' + response.tx_hash + ';', function(err, evaluates2){
                  if(req.body.free != null){
                    for(var i = 0; i<req.body.free.length; i++){
                      connection.query('insert into evaluates_free set ? ;', {
                        evaluate_id: evaluates2[0].id,
                        free_id: req.body.free[i]
                      },function(err, success3){
                        if (err == null) {
                        } else {
                          // res.redirect('/signup');
                          console.log(err);
                        }
                      }
                      );
                    }
                  }
                });
              } else {
                // res.redirect('/signup');
                console.log(err);
              }
            }
            );
          });
        })
        .on('failed', (response) => {
          console.log("エラー");
        })
  }
  // if (!errors.isEmpty()) {
  //   console.log(errors);
  //   connection.query('select * from users;', function(err, users) {
  //     connection.query('select * from users where id = ' + req.body.user_id + ';', function(err, users2) {
  //       connection.query('select * from events where id = ' + req.body.event_id + ';', function(err, events){
  //         if(users != []){
  //           for (i = 0; i < users.length; i++) {
  //             if(req.user.email == users[i].email){
  //             sender = users[i];
  //             }
  //           }
  //         }
  //         if(users2 != []){
  //           for (i = 0; i < users2.length; i++) {
  //             receiver = users[i];
  //           }
  //         }
  //         console.log(sender);
  //         console.log(receiver);
  //         console.log(events);
  //       });
  //     });
  //   });
  // }else {
  //   connection.query('select * from users;', function(err, users) {
  //     connection.query('select * from events where id = ' + req.body.event_id + ';', function(err, events){
  //       for (i = 0; i < users.length; i++) {
  //         if(req.user.email == users[i].email){
  //           sender = users[i];
  //         }
  //       }
  //       var address = event_id.toString() + "_" + sender[0].email.toString() + "_" + req.body.user_id.toString();
  //       connection.query('select * from evaluates where event_id = ' + event_id.toString() + ' and sender_id = ' + sender[0].email.toString() + ' and receiver_id = ' + req.body.user_id.toString() + ';', function(err, evaluates) {
  //         if(evaluates != []){
  //           rpc.transaction.getTxReceiptByTxHash(evaluates.txhash.toString()).then(function(retx){
  //             const content = JSON.parse(tx.receipts[0].content);
  //             if (content.action == evaluates.txhash){
  //               const dtx = iost.callABI("ContractE4Nj2B5UynsrYTH7XVXbBZMmXpYJJCthSw5qWbCVw3fm",
  //               "destroy",
  //               [content.attr]
  //               );
  //               iost.signAndSend(dtx);
  //             }
  //           });
  //           connection.query('delete from evaluates where event_id = ' + events[0].id + ' and sender_id = ' + sender[0].id + ' and receiver_id = ' + receiver[0].id + ';', function(err, success){
  //             if (err == null) {
  //               connection.query('delete from evaluates_free where id = ' + evaluates[0].id + ';', function(err, success2){
  //                 if (err == null) {
  //                 } else {
  //                   // res.redirect('/signup');
  //                   console.log(err);
  //                 }
  //               });
  //             } else {
  //               // res.redirect('/signup');
  //               console.log(err);
  //             }
  //           });
  //         }
  //       });
  //       var now = getStringFromDate(new Date());
  //       var freeStatement = "";
  //       if(req.body.free != null){
  //         for(var i = 0; i<req.body.free.length; i++){
  //           freeStatement = freeStatement + req.body.free[i].toString();
  //         }
  //       }
  //       var evaluationStatement = req.body.action.toString() + req.body.think.toString() + req.body.team.toString() + req.body.comments.toString() + events[0].id.toString() + sender[0].id.toString() + receiver[0].id.toString() + now.toString() + freeStatement;
  //       const hash = crypto.createHash('sha256').update(evaluationStatement, 'utf8').digest('hex');
      
  //       const atx = iost.callABI("ContractE4Nj2B5UynsrYTH7XVXbBZMmXpYJJCthSw5qWbCVw3fm",
  //               "add",
  //               [address,hash]
  //       );
  //       iost.signAndSend(atx)
  //       .on('pending', (response) => {
  //         console.log("エラー");
  //       })
  //       .on('success', (response) => {
  //         connection.query('select * from evaluates;', function(err, evaluates){
  //           connection.query('insert into evaluates set ? ;', {
  //             action: req.body.action,
  //             think: req.body.think,
  //             team: req.body.team,
  //             comments: req.body.comments,
  //             txhash: response.tx_hash,
  //             event_id: events[0].id,
  //             sender_id: sender[0].id,
  //             receiver_id: receiver[0].id,
  //             created_at: now,
  //           },
  //           function(err, success){
  //             if (err == null) {
  //               connection.query('select * from evaluates where txhash = ' + response.tx_hash + ';', function(err, evaluates2){
  //                 if(req.body.free != null){
  //                   for(var i = 0; i<req.body.free.length; i++){
  //                     connection.query('insert into evaluates_free set ? ;', {
  //                       evaluate_id: evaluates2[0].id,
  //                       free_id: req.body.free[i]
  //                     },function(err, success3){
  //                       if (err == null) {
  //                       } else {
  //                         // res.redirect('/signup');
  //                         console.log(err);
  //                       }
  //                     }
  //                     );
  //                   }
  //                 }
  //               });
  //             } else {
  //               // res.redirect('/signup');
  //               console.log(err);
  //             }
  //           }
  //           );
  //         });
  //       })
  //       .on('failed', (response) => {
  //         console.log("エラー");
  //       })
  //     });
  //   });
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