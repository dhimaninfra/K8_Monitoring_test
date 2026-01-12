let stressing = false;

function burnCPU() {
  if (!stressing) return;
  Math.sqrt(Math.random());
  setImmediate(burnCPU);
}

app.get("/stress", (req, res) => {
  const level = req.query.level || "low";

  if (level === "high") {
    stressing = true;
    burnCPU();
    res.send("High CPU stress started");
  } else if (level === "stop") {
    stressing = false;
    res.send("CPU stress stopped");
  } else {
    res.send("No stress applied");
  }
});
