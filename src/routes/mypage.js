var express = require('express');
var router = express.Router();
const mysql = require('mysql2');
const util = require('util');
let connection = mysql.createConnection({
  host: 'mysql',
  user: 'root',
  password: 'secret',
  database: 'portfoliopj'
});
const query = util.promisify(connection.query).bind(connection);
/* GET home page. */
router.get('/', function(req, res, next) {
  let obj={};
  let username = "";
	let profession2 = "";
  let id2 = 0;
  let eventlist = [];
  let tagid = [];
  let c = 0;
  let searchid ="99999";
  let searchname =" and sender_id = 99999";
  let searchname2 =" and sender_id = 99999";
  const ss = Array.from({ length: 3 }, () => 0);
  const ts = Array.from({ length: 3 }, () => 0);
  let tactionscore = 0;
  let tthinkscore = 0;
  let tteamscore = 0;
  let ttotalactionscore = 0;
  let ttotalthinkscore = 0;
  let ttotalteamscore = 0;
  let sactionscore = 0;
  let sthinkscore = 0;
  let steamscore = 0;
  let stotalactionscore = 0;
  let stotalthinkscore = 0;
  let stotalteamscore = 0;
  const social = Array.from({ length: 12 }, () => 0);
  const social2 = Array.from({ length: 12 }, () => 0);
  
  async function getUser(){
    const users = await query('select * from users;');
    for (i = 0; i < users.length; i++) {
      if(req.user.email == users[i].email){
        id2 = users[i].id;
        username = users[i].user_name;
        profession2 = users[i].profession;
      }
    }
  }

  async function school(){
    if(profession2 == "school"){
      obj = {
        profession:profession2,
        username:username,
        status:200
      }
      res.json(obj);
    }
  }

  async function studentEvent(){
	  if(profession2 == "student"){
      const ev = await query("select * from events_students where student_id = " + id2.toString() + ";");
      if(ev.length != 0){
        searchid = ev[0].event_id.toString();
        if(ev.length > 1){
          for(var i =1; i<ev.length; i++){
            searchid = searchid + " or id = " + ev[i].event_id.toString();
          }
        }
      }
      const events = await query("select * from events where id = " + searchid + ";");
      if(events.length != 0){
        const events_tags = await query('select * from events_tags;');
        const tags = await query('select * from tags;');
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
        eventlist = events;
      }
    }
  }

  async function studentScore1(){
    if(profession2 == "student"){
      const studentid = await query('select * from users where profession = "student";');
      if(studentid.length != 0){
        searchname = " and (sender_id = " + studentid[0].id.toString();
        for(var i = 1; i<studentid.length; i++){
        searchname = searchname + " or sender_id = " + studentid[i].id.toString();
        }
        searchname = searchname + ")"
      }
      const evaluates_free = await query('select * from evaluates_free;');
      const free = await query('select * from free;');
      for(var i = 0; i<free.length; i++){
        social[i] = {
          name:free[i].freedom,　
          count:0
        }
      }
      const student = await query('select * from evaluates where receiver_id = ' + id2.toString() + searchname + ';');
      if(student.length != 0){
        for(var i = 0; i<student.length; i++){
          stotalactionscore = stotalactionscore + student[i].action;
          stotalthinkscore = stotalthinkscore + student[i].think;
          stotalteamscore = stotalteamscore + student[i].team;
          if (evaluates_free.length != 0) {
            for (var j = 0; j < evaluates_free.length; j++) {
                for (var k = 0; k < free.length; k++) {
                    if(student[i].id == evaluates_free[j].evaluate_id){
                        if (evaluates_free[j].free_id == free[k].id) {
                            social[k].count++;
                        }
                    }
                }
            }
          }
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
      social.sort(compare);
    }
  }

  async function studentScore2(){
    if(profession2 == "student"){
      const teacherid = await query('select * from users where profession = "teacher";');
      if(teacherid.length != 0){
        searchname2 = " and (sender_id = " + teacherid[0].id.toString();
        for(var i = 1; i<teacherid.length; i++){
        searchname2 = searchname2 + " or sender_id = " + teacherid[i].id.toString();
        }
        searchname2 = searchname2 + ")"
      }
      const evaluates_free = await query('select * from evaluates_free;');
      const free = await query('select * from free;');
      for(var i = 0; i<free.length; i++){
        social2[i] = {
          name:free[i].freedom,　
          count:0
        }
      }
      const teacher = await query('select * from evaluates where receiver_id = ' + id2.toString() + searchname2 + ';');
      if(teacher.length != 0){
        for(var i = 0; i<teacher.length; i++){
          ttotalactionscore = ttotalactionscore + teacher[i].action;
          ttotalthinkscore = ttotalthinkscore + teacher[i].think;
          ttotalteamscore = ttotalteamscore + teacher[i].team;
          if (evaluates_free.length != 0) {
            for (var j = 0; j < evaluates_free.length; j++) {
                for (var k = 0; k < free.length; k++) {
                    if(teacher[i].id == evaluates_free[j].evaluate_id){
                        if (evaluates_free[j].free_id == free[k].id) {
                            social2[k].count++;
                        }
                    }
                }
            }
          }
        }
        tactionscore = Math.round(ttotalactionscore/teacher.length*10) /10;
        tthinkscore = Math.round(ttotalthinkscore/teacher.length*10) /10;
        tteamscore = Math.round(ttotalteamscore/teacher.length*10) /10;
      }
      ts[0] = {
        action:tactionscore
      }
      ts[1] = {
        think:tthinkscore
      }
      ts[2] = {
        team:tteamscore
      }
      social2.sort(compare);
      obj = {
        profession:profession2,
        eventlist:eventlist,
        username:username,
        ss:ss,
        social:social,
        ts:ts,
        social2:social2,
        status:200
      }
      res.json(obj);
    }
  }
  
  async function teacher(){
	  if(profession2 == "teacher"){
      const ev = await query("select * from events_teachers where teacher_id = " + id2.toString() + ";");
      if(ev.length != 0){
        searchid = ev[0].event_id.toString();
        if(ev.length > 1){
          for(var i =1; i<ev.length; i++){
            searchid = searchid + " or id = " + ev[i].event_id.toString();
          }
        }
      }
      const events = await query("select * from events where id = " + searchid + ";");
      if(events.length != 0){
        const events_tags = await query('select * from events_tags;');
        const tags = await query('select * from tags;');
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
        eventlist = events;
      }
      obj = {
        profession:profession2,
        eventlist:eventlist,
        username:username,
        status:200
      }
      res.json(obj);
    }
  }

  async function total(){
    await getUser();
    await school();
    await studentEvent();
    await studentScore1();
    await studentScore2();
    await teacher();
  }
  if(req.user){
    total();
  } else {
    console.log("sign inページへ")
    obj = {
      status:401
    }
    res.json(obj);
  }
});

function compare( a, b ){
  var r = 0;
  if( a.count > b.count ){ r = -1; }
  else if( a.count < b.count ){ r = 1; }

  return r;
}

module.exports = router;
