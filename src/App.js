import React, { useState } from 'react';
import PhaserGame from './components/PhaserGame';
import SessionList from './components/SessionList';
import './App.css';

function App() {
    const [sessions, setSessions] = useState([]);
    const [sessionData, setSessionData] = useState({ active: false });

    const startSession = () => {
        setSessionData({ active: true });
    };

    const handleSessionEnd = (session) => {
        setSessions([...sessions, session]);
        setSessionData({ active: false });
    };

    return (
        <div className="App">
            <div className="left-panel">
                <button onClick={startSession} disabled={sessionData.active}>
                    Start Session
                </button>
                <PhaserGame onSessionEnd={handleSessionEnd} sessionData={sessionData} />
            </div>
            <div className="right-panel">
                <SessionList sessions={sessions} />
            </div>
        </div>
    );
}

export default App;
