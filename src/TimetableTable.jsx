import React from 'react';

function TimetableTable({ days, sortedEntries, handleEdit, handleDelete }) {
  return (
    <table id="timetable">
      <thead>
        <tr>
          <th>Time</th>
          {days.map(day => <th key={day}>{day}</th>)}
          <th>Actions</th>
        </tr>
      </thead>

      <tbody>
        {sortedEntries.map((entry) => (
          <tr key={entry.id}>
            <td>{`${entry.start_time} - ${entry.end_time}`}</td>

            {days.map(day => (
              <td key={day}>{entry.subjects?.[day] || ''}</td>
            ))}

            <td className="actions">
              <button
                className="edit-btn"
                onClick={() => handleEdit(entry.id)}
              >
                Edit
              </button>
              <button
                className="delete-btn"
                onClick={() => handleDelete(entry.id)}
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default TimetableTable;
