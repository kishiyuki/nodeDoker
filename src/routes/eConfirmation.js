var express = require('express');
var router = express.Router();
const mysql = require('mysql2');
const util = require('util');
const IOST = require('@kunroku/iost')
const crypto = require('crypto');
const json = require('body-parser/lib/types/json');
const { hash } = require('bcrypt');
const iost = new IOST({
    host: 'http://iost:30001',
    chainId: 1020,
    gasLimit: 1000000
});
const creatorId = 'admin';
const secretKey = '2yquS3ySrGWPEKywCPzX4RTJugqRh7kJSo5aehsLYPEWkUxBWA39oMrZ7ZxuM4fgyXYs2cPwh5n8aNNpH5x2VyK1';
const account = new IOST.Account(creatorId);
const kp = new IOST.KeyPair.Ed25519(IOST.Bs58.decode(secretKey));
account.addKeyPair("active", kp);
account.addKeyPair("owner", kp);
iost.setPublisher(account);
let connection = mysql.createConnection({
    host: 'mysql',
    user: 'root',
    password: 'secret',
    database: 'portfoliopj'
});
setInterval(function () {
    connection.query('SELECT 1');
  }, 5000);
const query = util.promisify(connection.query).bind(connection);

router.get('/', function (req, res, next) {
    let obj = {};
    let id2 = 0;
    let hash = "";
    let eventlist = [];
    let freeid = [];
    let tcomments = [];
    let scomments = [];
    let freenum = [];
    let freeStatement;
    let evaluationStatement;
    let searchname = " and sender_id = 99999";
    let searchname2 = " and sender_id = 99999";
    let searchname3 = "20 and id = 30";
    let tagid = [];
    let tagname = [];
    let teachername = [];
    let a = 0;
    let c = 0;
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
    async function getId() {
        const users = await query('select * from users;');
        if (req.user.email) {
            for (i = 0; i < users.length; i++) {
                if (req.user.email == users[i].email) {
                    id2 = users[i].id;
                }
            }
        }
    }
    async function addTag() {
        const events = await query('select * from events where id = ' + req.query.event_id + ';');
        if (events.length != 0) {
            const events_tags = await query('select * from events_tags;');
            const tags = await query('select * from tags;');
            c = 0;
            tagid[0] = [];
            for (var j = 0; j < events_tags.length; j++) {
                if (events[0].id == events_tags[j].event_id) {
                    tagid[0][c] = events_tags[j].tags_id;
                    tagname[c] = tags[tagid[0][c] - 1].tag;
                    c++;
                }
            }
            events[0]["tags"] = tagname;
            eventlist = events;
        }
    }
    async function addTeacher() {
        const events_teachers = await query('select * from events_teachers where event_id = ' + req.query.event_id + ';');
        searchname3 = events_teachers[0].teacher_id.toString();
        if (events_teachers.length > 1) {
            for (var i = 1; i < events_teachers.length; i++) {
                searchname3 = searchname3 + " or id = " + events_teachers[i].event_id.toString();
            }
        }
        const teachers = await query('select * from users where id = ' + searchname3 + ';');
        if(teachers.length != 0){
            for (var i = 0; i < teachers.length; i++) {
                teachername[i] = teachers[i].user_name;
            }
            eventlist[0]["teachers"] = teachername;
        }
    }
    async function studentScore() {
        const studentid = await query('select * from users where profession = "student";');
        if (studentid.length != 0) {
            searchname = " and (sender_id = " + studentid[0].id.toString();
            for (var i = 1; i < studentid.length; i++) {
                searchname = searchname + " or sender_id = " + studentid[i].id.toString();
            }
            searchname = searchname + ")"
        }
        const student = await query('select * from evaluates where receiver_id = ' + id2.toString() + " and event_id = " + req.query.event_id + searchname + ';');
        freeid = [];
        evaluates_free = await query('select * from evaluates_free;');
        free = await query('select * from free;');
        for (var i = 0; i < free.length; i++) {
            social[i] = {
                name: free[i].freedom,
                count: 0
            }
        }
        if (student.length != 0) {
            for (var i = 0; i < student.length; i++) {
                c = 0;
                freeid[i] = [];
                freeStatement = "";
                for (var j = 0; j < evaluates_free.length; j++) {
                    if (student[i].id == evaluates_free[j].evaluate_id) {
                        freeid[0][c] = evaluates_free[j].free_id;
                        freeStatement = freeStatement + evaluates_free[j].free_id.toString();
                        freenum[c] = freeid[0][c];
                        c++;
                    }
                }
                a=0;
                evaluationStatement = student[i].action.toString() + student[i].think.toString() + student[i].team.toString() + student[i].comments.toString() + student[i].txhash.toString() + freeStatement;
                console.log(evaluationStatement);
                hash = crypto.createHash('sha256').update(evaluationStatement, 'utf8').digest('hex');
                await getHistory(
                    'ContractCSzBM2TLiunN71J8ZgxSYFCGpPCfvR3vJWLSYdibQjoB',
                    'admin',
                    student[i].txhash
                ).catch(function(reason){
                })
                .then(function(reason){
                    if(reason != null){
                        console.log(reason[0]);
                        console.log(hash);
                        if(reason[0] == hash){
                            stotalactionscore = stotalactionscore + student[i].action;
                            stotalthinkscore = stotalthinkscore + student[i].think;
                            stotalteamscore = stotalteamscore + student[i].team;
                            scomments[i] = student[i].comments;
                            if (freenum.length != 0) {
                                for (var j = 0; j < freenum.length; j++) {
                                    for (var k = 0; k < free.length; k++) {
                                        if (freenum[j] == free[k].id) {
                                            social[k].count++;
                                        }
                                    }
                                }
                            }
                            a++;
                        }
                    }
                });
            }
            if(a != 0){
                sactionscore = Math.round(stotalactionscore / a * 10) / 10;
                sthinkscore = Math.round(stotalthinkscore / a * 10) / 10;
                steamscore = Math.round(stotalteamscore / a * 10) / 10;
            }

            ss[0] = {
                action: sactionscore
            }
            ss[1] = {
                think: sthinkscore
            }
            ss[2] = {
                team: steamscore
            }
            social.sort(compare);
        }
    }
    async function teacherScore() {
        const teacherid = await query('select * from users where profession = "teacher";');
        if (teacherid.length != 0) {
            searchname2 = " and (sender_id = " + teacherid[0].id.toString();
            for (var i = 1; i < teacherid.length; i++) {
                searchname2 = searchname2 + " or sender_id = " + teacherid[i].id.toString();
            }
            searchname2 = searchname2 + ")"
        }
        const teacher = await query('select * from evaluates where receiver_id = ' + id2.toString() + " and event_id = " + req.query.event_id + searchname2 + ';');
        freeid = [];
        const evaluates_free = await query('select * from evaluates_free;');
        const free = await query('select * from free;');
        for (var i = 0; i < free.length; i++) {
            social2[i] = {
                name: free[i].freedom,
                count: 0
            }
        }
        if (teacher.length != 0) {
            freenum = [];
            for (var i = 0; i < teacher.length; i++) {
                c = 0;
                freeid[i] = [];
                freeStatement = "";
                for (var j = 0; j < evaluates_free.length; j++) {
                    if (teacher[i].id == evaluates_free[j].evaluate_id) {
                        freeid[0][c] = evaluates_free[j].free_id;
                        freeStatement = freeStatement + evaluates_free[j].free_id.toString();
                        freenum[c] = freeid[0][c];
                        c++;
                    }
                }
                a=0;
                evaluationStatement = teacher[i].action.toString() + teacher[i].think.toString() + teacher[i].team.toString() + teacher[i].comments.toString() + teacher[i].txhash + freeStatement;
                console.log(evaluationStatement);
                hash = crypto.createHash('sha256').update(evaluationStatement, 'utf8').digest('hex');
                await getHistory(
                    'ContractCSzBM2TLiunN71J8ZgxSYFCGpPCfvR3vJWLSYdibQjoB',
                    'admin',
                    teacher[i].txhash
                ).catch(function(reason){
                })
                .then(function(reason){
                    if(reason != null){
                        console.log(reason[0]);
                        console.log(hash);
                        if(reason[0] == hash){
                            ttotalactionscore = ttotalactionscore + teacher[i].action;
                            ttotalthinkscore = ttotalthinkscore + teacher[i].think;
                            ttotalteamscore = ttotalteamscore + teacher[i].team;
                            tcomments[i] = teacher[i].comments;
                            if (freenum.length != 0) {
                                for (var j = 0; j < freenum.length; j++) {
                                    for (var k = 0; k < free.length; k++) {
                                        if (freenum[j] == free[k].id) {
                                            social2[k].count++;
                                        }
                                    }
                                }
                            }
                            a++;
                        }
                    }
                });
            }
            if(a != 0){
                tactionscore = Math.round(ttotalactionscore / a * 10) / 10;
                tthinkscore = Math.round(ttotalthinkscore / a * 10) / 10;
                tteamscore = Math.round(ttotalteamscore / a * 10) / 10;
            }

            ts[0] = {
                action: tactionscore
            }
            ts[1] = {
                think: tthinkscore
            }
            ts[2] = {
                team: tteamscore
            }
            social2.sort(compare);
        }
    }
    async function total() {
        await getId();
        await addTag();
        await addTeacher();
        await studentScore();
        await teacherScore();
        await social.sort(compare);
        await social2.sort(compare);
        obj = {
            eventlist: eventlist,
            ss: ss,
            social:social,
            scomments:scomments,
            ts:ts,
            social2:social2,
            tcomments:tcomments,
            status:200
        };
        res.json(obj);
    }
    if(req.user){
        total();
    } else {
        obj = {
          status:401
        }
        res.json(obj);
    }
});

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
function compare(a, b) {
    var r = 0;
    if (a.count > b.count) { r = -1; }
    else if (a.count < b.count) { r = 1; }

    return r;
}

module.exports = router;
