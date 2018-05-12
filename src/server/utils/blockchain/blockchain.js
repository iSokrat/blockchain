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
        this._proofWorker = proofWorker;
        this._nodes = new Set();
        this.makeNewBlock(100, 1);
    }

    registerNode(address) {
      this._nodes.add(address);
    }

    async makeNewBlock(
      proof,
      previousHash
    ) {
        const chainLength = await Block.chainLength();
        const indexForBlock = chainLength + 1;
        const transactions = await Transaction.currentTransactions();
        const newBlock = new Block(
            indexForBlock,
            transactions,
            proof,
            previousHash
        );
        newBlock.save();

        Transaction.removeAllTransactions();

        return newBlock;
    }

    async makeNewTransaction(sender, recipient, amount) {
        const newTransaction = new Transaction(sender, recipient, amount);
        newTransaction.save();
        const lastBlock = await this.lastBlock;
        return lastBlock.index + 1;
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
      const chain = await this.chain;
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
        return Block.chain().then((chain) => chain[chain.length-1]);
    }

    get chain() {
      return Block.chain();
    }

    set chain(newChain) {
      Block.replaceChain(newChain);
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
