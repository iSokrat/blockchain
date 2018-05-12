const express = require('express');
const blockchain = require('../setup/blockchain');
const router = express.Router();

router.put('/register', (req, res) => {
  const {nodes} = req.body;

  if (!nodes) {
    res
      .status(400)
      .send({message: 'Missing field "nodes".'});
    return;
  }

  nodes.forEach(blockchain.registerNode.bind(blockchain));
  res
    .status(201)
    .send({
      message: 'Nodes were added',
      totalNodes: [...blockchain.nodes],
    });
});

router.get('/resolve', async (req, res) => {
  const isReplaced = await blockchain.resolveConflicts();
  let resObject;

  if (isReplaced) {
    resObject = {
      message: 'Chain was replaced.',
      chain: blockchain.chain,
    };
  } else {
    resObject = {
      message: 'Chain is authoritative.',
      chain: blockchain.chain,
    };
  }

  res
    .status(200)
    .send(resObject);
});

module.exports = router;
