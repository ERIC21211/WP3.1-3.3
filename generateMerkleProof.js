const fs = require("fs");
const { exportMerkleOutput } = require("./merkleTree");

console.log("🔄 Loading session data...");

const sessionData = JSON.parse(fs.readFileSync("trip1.json", "utf8"));
const sessionId = "trip1";

console.log(`✅ Loaded ${sessionId}, preparing data...`);

const flatPoints = sessionData.points.map((p) => ({
  timestamp: p.timestamp,
  latitude: p.latitude,
  longitude: p.longitude,
  acceleration: p.acceleration,
  rotation: p.rotation,
}));

console.log(`🔐 Generating Merkle tree...`);

const output = exportMerkleOutput(sessionId, flatPoints);

console.log("💾 Writing to merkle_output.json...");
fs.writeFileSync("merkle_output.json", JSON.stringify(output, null, 2));

console.log("✅ Merkle output written to merkle_output.json");
