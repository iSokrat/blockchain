const Block = require('./block.js');
const Transaction = require('./transaction.js');
const sha256 = require('js-sha256');

module.exports = class Blockchain {
    constructor() {
        this._currentTransactions = [];
        this._chain = [];
        this.makeNewBlock(1, 100);
    }

    makeNewBlock(previousHash, proof) {
        const chain = this._chain;
        const indexForBlock = chain.length + 1;
        const transactions = this._currentTransactions;
        const newBlock = new Block(
            indexForBlock,
            transactions,
            proof,
            previousHash
        );

        this._currentTransactions = [];
        this._chain.push(newBlock);

        return newBlock;
    }

    makeNewTransaction(sender, recipient, amount) {
        const newTransaction = new Transaction(sender, recipient, amount);
        this._currentTransactions.push(newTransaction);
        return this.lastBlock.index + 1;
    }

    get lastBlock() {
        const chain = this._chain;
        const lastIndex = chain.length - 1;
        return chain[lastIndex];
    }

    static hash(block) {
        return sha256(JSON.parse(block));
    }
};
