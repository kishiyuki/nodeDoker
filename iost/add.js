const execSync = require('child_process').execSync;
var S="abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
var N =64;
for (let i = 401; i < 501; i++) {
        const hash = Array.from(Array(N)).map(()=>S[Math.floor(Math.random()*S.length)]).join('');
        var a = "blockchain" + i.toString();
        let result = execSync('iwallet --account admin --chain_id=1020 call \"Contract9sD6g7AgZkcfBDS555HQe9G5MHDx4dBVDeEjycjn5GMm\" \"add\" \'[\"'+a+'\" ,\"'+hash+'\"]\'').toString();
        console.log(result);
}

