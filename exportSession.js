const { writeToPath } = require("fast-csv");
const fs = require("fs");

function exportToCsv(session, filePath = "session.csv") {
  const flatPoints = session.points.map(p => ({
    sessionId: session.sessionId,
    timestamp: p.timestamp,
    latitude: p.latitude,
    longitude: p.longitude,
    acceleration: p.acceleration,
    rotation: p.rotation
  }));

  writeToPath(filePath, flatPoints, { headers: true })
    .on("finish", () => console.log("CSV Export complete"));
}

const session = JSON.parse(fs.readFileSync("./trip1.json", "utf8"));
exportToCsv(session);
