const express = require("express");
const client = require("prom-client");

const app = express();
const PORT = 5000;

/* ---------------- PROMETHEUS METRICS ---------------- */

client.collectDefaultMetrics();

const httpRequestsTotal = new client.Counter({
  name: "http_requests_total",
  help: "Total number of HTTP requests"
});

/* ---------------- CPU STRESS LOGIC (STABLE) ---------------- */

let stressInterval = null;

function startStress() {
  if (stressInterval) return;

  stressInterval = setInterval(() => {
    const end = Date.now() + 200; // 200ms CPU burn
    while (Date.now() < end) {
      Math.sqrt(Math.random());
    }
  }, 300); // every 300ms
}

function stopStress() {
  if (stressInterval) {
    clearInterval(stressInterval);
    stressInterval = null;
  }
}

/* ---------------- ROUTES ---------------- */

app.get("/", (req, res) => {
  httpRequestsTotal.inc();
  res.json({ message: "Backend is running 🚀" });
});

app.get("/stress", (req, res) => {
  httpRequestsTotal.inc();

  const level = req.query.level || "low";

  if (level === "high") {
    startStress();
    res.send("High CPU stress started");
  } 
  else if (level === "stop") {
    stopStress();
    res.send("CPU stress stopped");
  } 
  else {
    res.send("No stress applied");
  }
});

app.get("/metrics", async (req, res) => {
  res.set("Content-Type", client.register.contentType);
  res.end(await client.register.metrics());
});

/* ---------------- START SERVER ---------------- */

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});