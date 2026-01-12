const express = require("express");
const client = require("prom-client");

const app = express();   // ✅ app defined FIRST
const PORT = 5000;

// Prometheus default metrics
client.collectDefaultMetrics();

const httpRequestsTotal = new client.Counter({
  name: "http_requests_total",
  help: "Total number of HTTP requests"
});

// ---------------- CPU STRESS LOGIC ----------------

let stressing = false;

function burnCPU() {
  if (!stressing) return;
  Math.sqrt(Math.random());
  setImmediate(burnCPU);
}

// ---------------- ROUTES ----------------

app.get("/", (req, res) => {
  httpRequestsTotal.inc();
  res.json({ message: "Backend is running 🚀" });
});

app.get("/stress", (req, res) => {
  httpRequestsTotal.inc();

  const level = req.query.level || "low";

  if (level === "high") {
    stressing = true;
    burnCPU();
    res.send("High CPU stress started");
  } 
  else if (level === "stop") {
    stressing = false;
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

// ---------------- START SERVER ----------------

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
