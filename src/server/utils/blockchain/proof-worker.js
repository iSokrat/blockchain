const sha256 = require('js-sha256');

module.exports = class ProofWorker {
    constructor(confirmSequence = '0') {
        this._confirmSequence = confirmSequence;
    }

    computeProof(lastProof) {
        let currentProof = 0;

        while (!this.isValidProof(lastProof, currentProof)) {
            currentProof += 1;
        }

        return currentProof;
    }

    isValidProof(prevProof, currentProof) {
        const confirmSequence = this._confirmSequence;
        const proofes = `${prevProof}${currentProof}`;

        return sha256(proofes)
          .slice(0, confirmSequence.length) === confirmSequence;
    }
};
