const dbConnection = require('./../../setup/db');

module.exports = class Block {
  constructor(index, transactions, proof, previousHash) {
    this._model = {
      index,
      timestamp: Date.now(),
      transactions,
      proof,
      previousHash,
    };
  }

  static async replaceChain(chain) {
    const bChain = dbConnection.db().collection('blockchain');
    return new Promise((res, rej) => {
      bChain.remove((err) => {
        if (err) {
          rej(err);
        }

        bChain.insert(chain, (err, result) => {
          if (err) {
            rej(err);
          } else {
            res(result);
          }
        });
      });
    });
  }

  static async chain() {
    return new Promise((res, rej) => {
      dbConnection.db()
      .collection('blockchain').find()
      .toArray((err, result) => {
        if (err) {
          rej(err);
        } else {
          res(result);
        }
      });
    });
  }

  static async chainLength() {
    return new Promise((res, rej) => {
      dbConnection.db()
      .collection('blockchain')
      .count((err, result) => {
        if (err) {
          rej(err);
        } else {
          res(result);
        }
      });
    });
  }

  save() {
    return new Promise((res, rej) => {
      dbConnection.db()
        .collection('blockchain')
        .insert(this._model, (err, result) => {
          if (err) {
            rej(err);
          } else {
            res(result);
          }
        });
    });
  }

  get(prop) {
    return this._model[prop];
  }
};
