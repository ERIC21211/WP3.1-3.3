const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { buildMerkleTree } = require("./merkleTree.js");

// Hash a single entry (used for validation)
function hashEntry(entry) {
  const jsonString = JSON.stringify(entry);
  return crypto.createHash("sha256").update(jsonString).digest("hex");
}

// Directory with proof files
const proofFiles = ["proof_valid.json", "proof_invalid.json", "proof_incomplete.json"];

function validateProof(filePath) {
  try {
    const rawData = fs.readFileSync(filePath, "utf-8");
    const proof = JSON.parse(rawData);

    if (!proof.data || proof.data.length === 0) {
      throw new Error(`❌ No data entries found in proof file: ${filePath}`);
    }

    // Step 1: Recompute all hashes from raw entries
    const recomputedHashes = proof.data.map(item => hashEntry(item.entry));

    // Step 2: Build a Merkle tree from recomputed hashes
    const tree = buildMerkleTree(recomputedHashes);
    const recomputedRoot = tree.getRoot().toString("hex");

    // Step 3: Compare to provided root
    if (recomputedRoot === proof.merkleRoot) {
      console.log(`✅ VALID: Merkle root matches for session ${proof.metadata.sessionId}`);
    } else {
      console.log(`❌ INVALID: Root mismatch for session ${proof.metadata.sessionId}`);
      console.log(`   Expected: ${proof.merkleRoot}`);
      console.log(`   Computed: ${recomputedRoot}`);
    }

    // Step 4: Simulate submission (save to local file as a placeholder for blockchain)
    const simulatedTx = {
      sessionId: proof.metadata.sessionId,
      timestamp: new Date().toISOString(),
      submittedRoot: recomputedRoot,
      status: recomputedRoot === proof.merkleRoot ? "valid" : "invalid"
    };

    const outputName = `submission_${proof.metadata.sessionId}.json`;
    fs.writeFileSync(outputName, JSON.stringify(simulatedTx, null, 2));
    console.log(`📝 Saved simulated submission: ${outputName}`);

  } catch (err) {
    console.error(`🚫 ERROR processing ${filePath}: ${err.message}`);
  }

  console.log("——————————————————————————————————————————————————");
}

// Run validation for all test files
proofFiles.forEach(file => {
  console.log(`📄 Validating ${file}`);
  validateProof(path.resolve(file));
});
