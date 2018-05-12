const express = require('express');
const router = express.Router();
const _ = require('lodash');
const uuidv4 = require('uuid/v4');
const Blockchain = require('../utils/blockchain/blockchain');
const blockchain = require('../setup/blockchain');

const nodeId = uuidv4();

router.put('/mine', async (req, res) => {
  const {proofWorker} = blockchain;
  const lastBlock = await blockchain.lastBlock;
  const {proof: lastProof} = lastBlock;
  const newProof = proofWorker.computeProof(lastProof);

  const blockchainId = '0';
  const rewardAmount = 1;
  await blockchain.makeNewTransaction(blockchainId, nodeId, rewardAmount);

  const builtBlock = blockchain.makeNewBlock(
    newProof,
    Blockchain.hash(lastBlock)
  );
  const result = {
    message: 'New Block was built.',
    index: builtBlock.index,
    transactions: builtBlock.transactions,
    proof: builtBlock.proof,
    previousHash: builtBlock.previousHash,
  };
  res
    .status(200)
    .send(result);
});

router.put('/transaction/new', async (req, res) => {
  const reqBody = req.body;
  const mandatoryFields = [
    'sender',
    'recipient',
    'amount',
  ];
  const hasMissingMandatory = _.some(
    mandatoryFields,
    (field) => !_.has(reqBody, field)
  );

  if (hasMissingMandatory) {
    res
      .status(400)
      .send({message: 'Missing values'});
    return;
  }

  const blockIndex = await blockchain.makeNewTransaction(
    reqBody.sender,
    reqBody.recipient,
    reqBody.amount
  );

  res
    .status(201)
    .send({message: `Transaction will be added to the block [${blockIndex}]`});
});

router.get('/chain', async (req, res) => {
  const chain = await blockchain.chain;
  res.send({
    chain,
    length: chain.length,
  });
});

module.exports = router;
