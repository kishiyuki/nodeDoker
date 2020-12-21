class Contract {
  init() {}
  add(attr, action) {
    const prev = storage.mapGet(tx.publisher, attr);
    if (tx.hash === prev)
      throw new Error('duplicate tx hash');
    blockchain.receipt(JSON.stringify({ attr, action, prev }));
    storage.mapPut(tx.publisher, attr, tx.hash);
  }
  destroy(attr) {
    storage.mapDel(tx.publisher, attr);
  }
}
module.exports = Contract;
