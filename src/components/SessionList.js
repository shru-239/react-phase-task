import React from 'react';
import '../App.css';

const SessionList = ({ sessions }) => {
    return (
        <div className="session-list">
            <h2 className="session-history-title"> Session History</h2>
            <ul>
                {sessions.map((session, index) => (
                    <li key={index}>
                        <p><strong>Session ID:</strong> {session.id}</p>
                        <p><strong>Start Time:</strong> {session.startTime}</p>
                        <p><strong>End Time:</strong> {session.endTime}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default SessionList;
