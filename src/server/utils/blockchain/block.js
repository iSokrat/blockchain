module.exports = class Block {
    constructor(index, transactions, proof, previousHash) {
        this._index = index;
        this._timestamp = Date.now();
        this._transactions = transactions;
        this._proof = proof;
        this._previousHash = previousHash;
    }

    get index() {
        return this._index;
    }
};
