const dbConnection = require('./../../setup/db');

module.exports = class Transaction {
    constructor(sender, recipient, amount) {
        this._model = {
          sender,
          recipient,
          amount,
        };
    }

    static async removeAllTransactions() {
      return new Promise((res, rej) => {
        dbConnection.db()
          .collection('transactionPull')
          .remove({}, (err, result) => {
            if (err) {
              rej(err);
            } else {
              res(result);
            }
          });
      });
    }

    static async currentTransactions() {
      return new Promise((res, rej) => {
        dbConnection.db()
          .collection('transactionPull').find()
          .toArray((err, result) => {
            if (err) {
              rej(err);
            } else {
              res(result);
            }
          });
      });
    }

    async save() {
      return new Promise((res, rej) => {
        dbConnection.db()
          .collection('transactionPull')
          .insert(this._model, (err, result) => {
            if (err) {
              rej(err);
            } else {
              res(result);
            }
          });
      });
    }
};
