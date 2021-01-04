const IOST = require('@kunroku/iost');
const { performance } = require('perf_hooks');

// target: localhost
const iost = new IOST();
let startTime;
let endTime;
let alltime;
let time;
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

async function all() {
    for(let i =0; i<100; i++){
	startTime = await performance.now();
	await getHistory(
	    'Contract9sD6g7AgZkcfBDS555HQe9G5MHDx4dBVDeEjycjn5GMm',
	    'admin',
	    'blockchain250'
	).then(console.log);
	endTime = await performance.now();
	time = endTime - startTime;
	alltime = time++;
    }
    console.log((alltime/100).toFixed(5));
}

all();

