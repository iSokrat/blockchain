module.exports = class Transaction {
    constructor(sender, recipient, amount) {
        this._sender = sender;
        this._recipient = recipient;
        this._amount = amount;
    }
};
