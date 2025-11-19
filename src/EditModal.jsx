import React from 'react';
import './EditModal.css';

function EditModal({
  days,
  editStartTime,
  editEndTime,
  editDaySubjects,
  setEditStartTime,
  setEditEndTime,
  setEditDaySubjects,
  handleEditSubmit,
  handleClose
}) {

  const handleDayChange = (day, value) => {
    setEditDaySubjects(prev => ({ ...prev, [day]: value }));
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-modal" onClick={handleClose}>X</button>
        <h2>Edit Entry</h2>
        <form onSubmit={handleEditSubmit}>
          <input
            type="time"
            value={editStartTime}
            onChange={(e) => setEditStartTime(e.target.value)}
          />
          <input
            type="time"
            value={editEndTime}
            onChange={(e) => setEditEndTime(e.target.value)}
          />
          <div id="day-subjects">
            {days.map(day => (
              <div key={day} className="day-input">
                <label>{day}:</label>
                <input
                  type="text"
                  placeholder="Subject"
                  value={editDaySubjects[day] || ''}
                  onChange={(e) => handleDayChange(day, e.target.value)}
                />
              </div>
            ))}
          </div>
          <div className="form-buttons">
            <button type="submit">Update</button>
            <button type="button" onClick={handleClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditModal;
