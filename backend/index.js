const express = require("express");
const client = require("prom-client");

const app = express();
const PORT = 5000;

// Prometheus metrics
client.collectDefaultMetrics();

const httpRequestsTotal = new client.Counter({
  name: "http_requests_total",
  help: "Total number of HTTP requests"
});

// CPU stress function
function burnCPU(ms) {
  const end = Date.now() + ms;
  while (Date.now() < end) {
    Math.sqrt(Math.random());
  }
}

app.get("/", (req, res) => {
  httpRequestsTotal.inc();
  res.json({ message: "Backend is running 🚀" });
});

app.get("/stress", (req, res) => {
  httpRequestsTotal.inc();

  const level = req.query.level || "low";
  let duration = 0;

  if (level === "low") duration = 300;
  if (level === "medium") duration = 1500;
  if (level === "high") duration = 4000;

  burnCPU(duration);
  res.send(`CPU stress applied: ${level}`);
});

app.get("/metrics", async (req, res) => {
  res.set("Content-Type", client.register.contentType);
  res.end(await client.register.metrics());
});

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
