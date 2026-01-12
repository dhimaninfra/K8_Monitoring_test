const express = require("express");
const client = require("prom-client");

const app = express();
const PORT = 5000;

// Prometheus metrics
const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics();

const httpRequestsTotal = new client.Counter({
  name: "http_requests_total",
  help: "Total number of HTTP requests"
});

app.get("/", (req, res) => {
  httpRequestsTotal.inc();
  res.json({ message: "Backend is running 🚀" });
});

app.get("/metrics", async (req, res) => {
  res.set("Content-Type", client.register.contentType);
  res.end(await client.register.metrics());
});

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
