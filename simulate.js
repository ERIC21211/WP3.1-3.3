const fs = require('fs');
const { writeToPath } = require('fast-csv');

// Simulate a trip of X minutes (1 data point per second)
function simulateTrip(durationMinutes) {
  const data = [];
  const totalPoints = durationMinutes * 60;

  let lat = 37.7749;      // Start: San Francisco
  let lng = -122.4194;
  let speed = 0;          // km/h
  let heading = 0;

  for (let i = 0; i < totalPoints; i++) {
    const timestamp = new Date(Date.now() + i * 1000).toISOString();

    // Driving Phases
    if (i < 30) speed += 1;             // Accelerating
    else if (i < 60) speed = speed;     // Maintain
    else if (i < 90) speed -= 0.5;      // Braking
    else speed = Math.max(0, speed - 0.1); // Idle

    // Move position slightly based on speed
    lat += (Math.random() - 0.5) * 0.0001 * (speed / 10);
    lng += (Math.random() - 0.5) * 0.0001 * (speed / 10);

    // Fake sensor data
    const acceleration = parseFloat((Math.random() * 2 - 1 + speed / 20).toFixed(2));
    const rotation = parseFloat((Math.sin(i / 15) * 25).toFixed(2)); // turn simulation

    data.push({ timestamp, latitude: lat, longitude: lng, acceleration, rotation });
  }

  return data;
}

// Save trip as JSON and CSV
function saveTrip(trip, index) {
  const jsonPath = `trip${index}.json`;
  const csvPath = `trip${index}.csv`;

  // Write JSON
  fs.writeFileSync(jsonPath, JSON.stringify(trip, null, 2));

  // Write CSV
  writeToPath(csvPath, trip, { headers: true })
    .on('finish', () => console.log(`Trip ${index} saved.`));
}

// Generate 3–5 trips
for (let i = 1; i <= 5; i++) {
  const trip = simulateTrip(5); // 5 minutes per trip
  saveTrip(trip, i);
}
