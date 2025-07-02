// src/App.jsx
import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import Plot from 'react-plotly.js';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import './App.css';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://127.0.0.1:8000';

function OrientationBox({ phi, theta, psi }) {
  return (
    <mesh rotation={[theta, psi, phi]}>
      <boxGeometry args={[2, 0.5, 3]} />
      <meshStandardMaterial color="orange" />
    </mesh>
  );
}

function App() {
  const [altitudeData, setAltitudeData] = useState([]);
  const [pitchData, setPitchData] = useState([]);
  const [velData, setVelData] = useState([]);
  const [timeData, setTimeData] = useState([]);
  const [telemetry, setTelemetry] = useState({});
  const [t, setT] = useState(0);
  const intervalRef = useRef(null);

  const initSim = async () => {
    await axios.post(`${API_BASE}/init`);
    setAltitudeData([]);
    setPitchData([]);
    setVelData([]);
    setTimeData([]);
    setT(0);
    setTelemetry({});
  };

  const stepSim = async () => {
    const res = await axios.get(`${API_BASE}/step`);
    const s = res.data.state;
    setAltitudeData((prev) => [...prev, -s.z]);
    setPitchData((prev) => [...prev, s.theta]);
    setVelData((prev) => [...prev, s.u]);
    setTimeData((prev) => [...prev, t]);
    setTelemetry(s);
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
    <div className="container">
      <h1>🛩️ 6-DOF Flight Simulator</h1>

      <div className="controls">
        <button onClick={initSim}>INIT</button>
        <button onClick={stepSim}>STEP</button>
        <button onClick={startAuto}>AUTO RUN</button>
        <button onClick={stopAuto}>STOP</button>
      </div>

      <div className="charts">
        <Plot
          data={[{ x: timeData, y: altitudeData, type: 'scatter', mode: 'lines', name: 'Altitude' }]}
          layout={{ title: 'Altitude vs Time (m)', height: 300 }}
        />
        <Plot
          data={[{ x: timeData, y: pitchData, type: 'scatter', mode: 'lines', name: 'Pitch Angle' }]}
          layout={{ title: 'Pitch Angle vs Time (rad)', height: 300 }}
        />
        <Plot
          data={[{ x: timeData, y: velData, type: 'scatter', mode: 'lines', name: 'Forward Velocity' }]}
          layout={{ title: 'Velocity (u) vs Time (m/s)', height: 300 }}
        />
      </div>

      <div className="orientation">
        <h2>3D Orientation</h2>
        <Canvas style={{ height: '300px', background: '#222' }}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[5, 5, 5]} />
          <OrbitControls enablePan={false} />
          <OrientationBox phi={telemetry.phi || 0} theta={telemetry.theta || 0} psi={telemetry.psi || 0} />
        </Canvas>
      </div>

      <div className="telemetry">
        <h2>Telemetry</h2>
        <pre>{JSON.stringify(telemetry, null, 2)}</pre>
      </div>
    </div>
  );
}

export default App;