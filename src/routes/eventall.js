var express = require('express');
var router = express.Router();
let mysql = require('mysql');
const util = require('util');
let connection = mysql.createConnection({
  host: 'mysql',
  user: 'root',
  password: 'secret',
  database: 'portfoliopj'
});
const query = util.promisify(connection.query).bind(connection);
router.get('/', function(req, res, next){
  let obj;
  let c;
  let tagid = [];
  let eventlist;
  async function all(){
    const events = await query("select * from events;");
    const events_tags = await query('select * from events_tags;');
    const tags = await query('select * from tags;');
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
    eventlist = events;
  }
  async function total(){
    await all();
    obj = {
      eventlist:eventlist
    }
    res.json(obj);
  }
  // if(req.user){
    total();
  // } else {
  //     res.redirect("auth/signin")
  // }
});

router.get('/:tags', function(req, res, next){
  let obj;
  let tagid = [];
  let c;
  let eventlist;
  let count = 1;
  let name;
  async function tag(){
    name = "'" + req.params.tags[0] + "'";
    for(var j = 1; j<req.params.tags.length; j++){
      name = name + ", '" + req.params.tags[j] + "'";
      count++;
    }
    const events = await query("SELECT * from events e WHERE " + count + " = (SELECT COUNT(*) from events_tags INNER JOIN tags ON events_tags.tags_id = tags.id WHERE e.id = events_tags.event_id AND tags.tag IN (" + name + "));");
    const events_tags = await query('select * from events_tags;');
    const tags = await query('select * from tags;');
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
    eventlist = events;
    obj = {
      eventlist:eventlist
    }
    res.json(obj);
  }
  // if(req.user){
    tag();
  // } else {
  //     res.redirect("auth/signin")
  // }
});

router.get('/:startday/:lastday', function(req, res, next){
  let obj;
  let tagid = [];
  let c;
  let eventlist;
  async function day(){
    const events = await query('SELECT * FROM events WHERE start_day BETWEEN "' + req.params.startday.toString() + '" AND "' + req.params.lastday.toString() + '";');
    const events_tags = await query('select * from events_tags;');
    const tags = await query('select * from tags;');
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
    eventlist = events;
    obj = {
      eventlist:eventlist
    }
    res.json(obj);
  }
  // if(req.user){
    day();
  // } else {
  //     res.redirect("auth/signin")
  // }
});

router.get('/:startday', function(req, res, next){
  let obj;
  let tagid = [];
  let c;
  let eventlist;
  async function day(){
    const events = await query('SELECT * FROM events WHERE start_day >"' + req.params.startday + '";');
    const events_tags = await query('select * from events_tags;');
    const tags = await query('select * from tags;');
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
    eventlist = events;     
    obj = {
      eventlist:eventlist
    }
    res.json(obj);
  }
  // if(req.user){
    day();
  // } else {
  //     res.redirect("auth/signin")
  // }
});

router.get('/:lastday', function(req, res, next){
  let obj;
  let tagid = [];
  let c;
  let eventlist;
  let today = getStringFromDate(new Date());
  async function day(){
    const events = await query('SELECT * FROM events WHERE start_day BETWEEN "' + today + '" AND "' + req.params.lastday.toString() + '";');
    const events_tags = await query('select * from events_tags;');
    const tags = await query('select * from tags;');
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
    eventlist = events; 
    obj = {
      eventlist:eventlist
    }
    res.json(obj);
  }
  // if(req.user){
    day();
  // } else {
  //     res.redirect("auth/signin")
  // }
});



router.get('/:search', function(req, res, next){
  let obj;
  let tagid = [];
  let c;
  let eventlist;
  async function search(){
    const events = await query("select * from events where event_name like '" + req.params.search +"%';");
    const events_tags = await query('select * from events_tags;');
    const tags = await query('select * from tags;');
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
    eventlist = events;
    obj = {
      eventlist:eventlist
    }
    res.json(obj);
  }
  // if(req.user){
    search();
  // } else {
  //     res.redirect("auth/signin")
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
