import React, { useState, useEffect } from 'react';
import './App.css';
import TimetableTable from './TimetableTable';
import EditModal from './EditModal';

function ScheduleMakerApp({ onBackToDashboard }) {
  const [timetableEntries, setTimetableEntries] = useState([]);

  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [daySubjects, setDaySubjects] = useState({});

  const [editStartTime, setEditStartTime] = useState('');
  const [editEndTime, setEditEndTime] = useState('');
  const [editDaySubjects, setEditDaySubjects] = useState({});
  const [editingIndex, setEditingIndex] = useState(null);

  const [showTable, setShowTable] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const [notification, setNotification] = useState('');
  const [showNotification, setShowNotification] = useState(false);

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  const API = "http://localhost:5000/timetable";

  useEffect(() => {
    fetch(API)
      .then(res => res.json())
      .then(data => setTimetableEntries(data));
  }, []);

  const showToast = (msg) => {
    setNotification(msg);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const valid = Object.entries(daySubjects).filter(([day, sub]) => sub.trim() !== "");

    if (!startTime || !endTime || valid.length === 0) {
      alert("Complete the form.");
      return;
    }

    const body = {
      startTime,
      endTime,
      subjects: daySubjects
    };

    await fetch(API, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(body)
    });

    showToast("Added!");
    setDaySubjects({});
    setStartTime('');
    setEndTime('');

    fetch(API)
      .then(res => res.json())
      .then(data => setTimetableEntries(data));
  };

  const handleEdit = (index) => {
    const entry = timetableEntries[index];

    setEditingIndex(entry.id);
    setEditStartTime(entry.start_time);
    setEditEndTime(entry.end_time);
    setEditDaySubjects({ ...entry.subjects });

    setShowEditModal(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    const body = {
      startTime: editStartTime,
      endTime: editEndTime,
      subjects: editDaySubjects
    };

    await fetch(`${API}/${editingIndex}`, {
      method: "PUT",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(body)
    });

    showToast("Updated!");

    setShowEditModal(false);

    fetch(API)
      .then(res => res.json())
      .then(data => setTimetableEntries(data));
  };

  const handleDelete = async (index) => {
    const entry = timetableEntries[index];
    if (!confirm("Delete this entry?")) return;

    await fetch(`${API}/${entry.id}`, { method: "DELETE" });

    showToast("Deleted!");

    fetch(API)
      .then(res => res.json())
      .then(data => setTimetableEntries(data));
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 20px", background: "#f0f0f0" }}>
        <button onClick={onBackToDashboard}>Back</button>
        <button onClick={() => setShowTable(!showTable)}>
          {showTable ? "Add Entry" : "View Table"}
        </button>
      </div>

      <div className="container">
        {showNotification && <div className="notification-toast">{notification}</div>}

        {!showTable && (
          <form id="timetable-form" onSubmit={handleSubmit}>
            <h2>Add New Entry</h2>

            <input type="time" value={startTime} onChange={(e)=>setStartTime(e.target.value)} />
            <input type="time" value={endTime} onChange={(e)=>setEndTime(e.target.value)} />

            {days.map(day => (
              <div key={day} className="day-input">
                <label>{day}</label>
                <input type="text" value={daySubjects[day] || ""} onChange={(e)=>setDaySubjects(prev=>({...prev,[day]:e.target.value}))}/>
              </div>
            ))}

            <button type="submit">Add</button>
          </form>
        )}

        {showTable && (
          <TimetableTable
            days={days}
            sortedEntries={timetableEntries}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
          />
        )}

        {showEditModal && (
          <EditModal
            days={days}
            editStartTime={editStartTime}
            editEndTime={editEndTime}
            editDaySubjects={editDaySubjects}
            setEditStartTime={setEditStartTime}
            setEditEndTime={setEditEndTime}
            setEditDaySubjects={setEditDaySubjects}
            handleEditSubmit={handleEditSubmit}
            handleClose={() => setShowEditModal(false)}
          />
        )}
      </div>
    </div>
  );
}

export default ScheduleMakerApp;
