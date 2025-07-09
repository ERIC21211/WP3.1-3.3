const crypto = require("crypto");
const { MerkleTree } = require("merkletreejs");

// 🔐 Hashing function (SHA-256)
function hashData(data) {
  return crypto.createHash("sha256").update(JSON.stringify(data)).digest();
}

// 🌳 Build Merkle Tree from session entries
function buildMerkleTree(entries) {
  const leaves = entries.map(hashData);

  console.log(`🌿 Building Merkle tree with ${leaves.length} leaves`);

  const tree = new MerkleTree(
    leaves,
    (data) => crypto.createHash("sha256").update(data).digest(),
    { sortPairs: true }
  );

  return tree;
}

// 🧪 Export root + proof paths + original entries
function exportMerkleOutput(sessionId, entries) {
  console.log("🔁 Inside exportMerkleOutput()");
  console.log(`🧾 Entries received: ${entries.length}`);

  const tree = buildMerkleTree(entries);
  const root = tree.getRoot().toString("hex");

  console.log("🌳 Merkle Root:", root);

  const dataWithProofs = entries.map((entry, index) => {
    const leaf = hashData(entry);
    const proof = tree.getProof(leaf).map(p => ({
      position: p.position,
      data: p.data.toString("hex"),
    }));

    return {
      entry,
      hash: leaf.toString("hex"),
      proof,
    };
  });

  return {
    sessionId,
    merkleRoot: root,
    data: dataWithProofs,
  };
}

// 📦 Export functions for use in runner
module.exports = {
  hashData,
  buildMerkleTree,
  exportMerkleOutput,
};
