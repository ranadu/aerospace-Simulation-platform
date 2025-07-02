import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import Plot from 'react-plotly.js';

const API_BASE = 'http://127.0.0.1:8000';

function App() {
  const [altitudeData, setAltitudeData] = useState([]);
  const [timeData, setTimeData] = useState([]);
  const [telemetry, setTelemetry] = useState({});
  const [t, setT] = useState(0);
  const intervalRef = useRef(null);

  const initSim = async () => {
    await axios.post(`${API_BASE}/init`);
    setAltitudeData([]);
    setTimeData([]);
    setT(0);
    setTelemetry({});
  };

  const stepSim = async () => {
    const res = await axios.get(`${API_BASE}/step`);
    const newZ = res.data.state.z;
    setAltitudeData((prev) => [...prev, -newZ]);
    setTimeData((prev) => [...prev, t]);
    setTelemetry(res.data.state);
    setT((prev) => prev + 0.01);
  };

  const startAuto = () => {
    if (!intervalRef.current) {
      intervalRef.current = setInterval(stepSim, 50);
    }
  };

  const stopAuto = () => {
    clearInterval(intervalRef.current);
    intervalRef.current = null;
  };

  useEffect(() => {
    return () => stopAuto();
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>6-DOF Flight Simulator</h1>

      <div style={{ marginBottom: '10px' }}>
        <button onClick={initSim}>INIT</button>
        <button onClick={stepSim}>STEP</button>
        <button onClick={startAuto}>AUTO RUN</button>
        <button onClick={stopAuto}>STOP</button>
      </div>

      <Plot
        data={[
          {
            x: timeData,
            y: altitudeData,
            type: 'scatter',
            mode: 'lines+markers',
            marker: { color: 'blue' },
          },
        ]}
        layout={{ width: 700, height: 400, title: 'Altitude vs Time (m)' }}
      />

      <div style={{ marginTop: '20px' }}>
        <h2>Telemetry</h2>
        <pre style={{ background: '#eee', padding: '10px' }}>
          {JSON.stringify(telemetry, null, 2)}
        </pre>
      </div>
    </div>
  );
}

export default App;