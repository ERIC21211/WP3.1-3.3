#!/usr/bin/env node

import fs from "fs";
import path from "path";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { exportMerkleOutput } from "./merkleTree.js"; // Also rename merkleTree.js if needed

const argv = yargs(hideBin(process.argv))
  .usage("Usage: $0 -i <input.json> [-o <output.json>]")
  .option("i", {
    alias: "input",
    describe: "Path to input session JSON file",
    demandOption: true,
    type: "string",
  })
  .option("o", {
    alias: "output",
    describe: "Path to output proof JSON file",
    type: "string",
    default: "proof_output.json",
  })
  .help("h")
  .alias("h", "help")
  .argv;

(async () => {
  try {
    const inputPath = path.resolve(argv.input);
    const outputPath = path.resolve(argv.output);

    console.log("📥 Reading input file:", inputPath);
    const raw = fs.readFileSync(inputPath, "utf8");
    const json = JSON.parse(raw);

    const sessionId = json.sessionId || path.basename(inputPath, ".json");
    const points = json.points || [];

    if (!Array.isArray(points) || points.length === 0) {
      throw new Error("❌ Input file does not contain a valid 'points' array.");
    }

    const flatEntries = points.map((p) => ({
      timestamp: p.timestamp,
      latitude: p.latitude,
      longitude: p.longitude,
      acceleration: p.acceleration,
      rotation: p.rotation,
    }));

    console.log("🌳 Generating Merkle tree...");
    const output = exportMerkleOutput(sessionId, flatEntries);

    const result = {
      metadata: {
        sessionId,
        hashAlgorithm: "SHA-256",
        generatedAt: new Date().toISOString(),
        totalPoints: flatEntries.length,
      },
      merkleRoot: output.merkleRoot,
      data: output.data,
    };

    fs.writeFileSync(outputPath, JSON.stringify(result, null, 2));
    console.log("✅ Proof file created:", outputPath);
  } catch (err) {
    console.error("❌ Error:", err.message);
    process.exit(1);
  }
})();
