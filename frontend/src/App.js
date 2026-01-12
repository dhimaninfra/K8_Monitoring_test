function hit(level) {
  fetch(`https://backend.dhimaninfra.online/api/stress?level=${level}`);
}

function App() {
  return (
    <div style={{ padding: 40 }}>
      <h1>React + Kubernetes 🚀</h1>
      <p>Frontend is running</p>

      <button onClick={() => hit("low")}>Low CPU</button>

      <button onClick={() => hit("medium")} style={{ marginLeft: 10 }}>
        Medium CPU
      </button>

      <button onClick={() => hit("high")} style={{ marginLeft: 10 }}>
        High CPU
      </button>
    </div>
  );
}

export default App;
