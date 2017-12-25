const Blockchain = require('../utils/blockchain/blockchain');
const ProofWorker = require('../utils/blockchain/proof-worker');

module.exports = new Blockchain({
  proofWorker: new ProofWorker('00'),
});
