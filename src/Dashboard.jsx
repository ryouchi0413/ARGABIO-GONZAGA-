import React, { useState } from 'react';
import ScheduleMakerApp from './ScheduleMakerApp';

function Dashboard() {
  const [openSchedule, setOpenSchedule] = useState(false);

  return (
    <div className="dashboard">
      {!openSchedule ? (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
          <h1>Personal Scheduler</h1>
          <button 
            onClick={() => setOpenSchedule(true)} 
            style={{ padding: '10px 20px', marginTop: '20px' }}
          >
            Open Schedule Maker
          </button>
        </div>
      ) : (
        <ScheduleMakerApp onBackToDashboard={() => setOpenSchedule(false)} />
      )}
    </div>
  );
}

export default Dashboard;
