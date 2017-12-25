const Block = require('./block.js');
const Transaction = require('./transaction.js');
const ProofWorker = require('../blockchain/proof-worker');
const _ = require('lodash');
const sha256 = require('js-sha256');
const rpn = require('request-promise-native');

module.exports = class Blockchain {
    constructor({
      proofWorker = new ProofWorker('0'),
    }) {
        this._currentTransactions = [];
        this._chain = [];
        this._proofWorker = proofWorker;
        this._nodes = new Set();
        this.makeNewBlock(100, 1);
    }

    registerNode(address) {
      this._nodes.add(address);
    }

    makeNewBlock(
      proof,
      previousHash
    ) {
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

    isValidChain(chain) {
      const proofWorker = this.proofWorker;
      let currentIndex = 1;
      let prevBlock = chain[currentIndex - 1];
      let isValid = false;

      while (currentIndex < chain.length) {
        const currentBlock = chain[currentIndex];
        const hasCorrectProof = proofWorker.isValidProof(
          prevBlock.proof,
          currentBlock.proof
        );

        const hasCorrectHash = (
          currentBlock.previousHash === Blockchain.hash(prevBlock)
        );

        isValid = (hasCorrectProof && hasCorrectHash);

        if (!isValid) {
          break;
        }

        ++currentIndex;
        prevBlock = currentBlock;
      }

      return isValid;
    }

    async resolveConflicts() {
      const nodes = this._nodes;
      const chain = this.chain;
      let chainWithMaxLength = chain;

      for (const node of nodes) {
        const options = {
          uri: `http://${node}/chain`,
          json: true,
        };

        try {
          const {
            chain: nodeChain,
            length: nodeLength,
          } = await rpn(options);
          const hasMaxLength = (
            chainWithMaxLength.length < nodeLength &&
            this.isValidChain(nodeChain)
          );

          if (hasMaxLength) {
            chainWithMaxLength = nodeChain;
          }
        } catch (error) {
          return Promise.reject(error);
        }
      }

      if (chainWithMaxLength !== chain) {
        this.chain = chainWithMaxLength;
        return true;
      } else {
        return false;
      }
    }

    get lastBlock() {
        const chain = this._chain;
        const lastIndex = chain.length - 1;
        return chain[lastIndex];
    }

    get chain() {
      return this._chain;
    }

    set chain(newChain) {
      this._chain = newChain;
    }

    get proofWorker() {
      return this._proofWorker;
    }

    get nodes() {
      return this._nodes;
    }

    static hash(block) {
      return _.flow(
        JSON.stringify,
        sha256
      )(block);
    }
};
