import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { db } from "./db.js";

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.get("/timetable", async (req, res) => {
  const [entries] = await db.query("SELECT * FROM timetable");

  for (let entry of entries) {
    const [subjects] = await db.query(
      "SELECT day, subject FROM timetable_subjects WHERE timetable_id = ?",
      [entry.id]
    );

    entry.subjects = {};
    subjects.forEach(s => {
      entry.subjects[s.day] = s.subject;
    });
  }

  res.json(entries);
});

app.post("/timetable", async (req, res) => {
  const { startTime, endTime, subjects } = req.body;

  const [result] = await db.query(
    "INSERT INTO timetable (start_time, end_time) VALUES (?, ?)",
    [startTime, endTime]
  );

  const timetableId = result.insertId;

  for (const day in subjects) {
    await db.query(
      "INSERT INTO timetable_subjects (timetable_id, day, subject) VALUES (?, ?, ?)",
      [timetableId, day, subjects[day]]
    );
  }

  res.json({ success: true });
});

app.put("/timetable/:id", async (req, res) => {
  const { id } = req.params;
  const { startTime, endTime, subjects } = req.body;

  await db.query(
    "UPDATE timetable SET start_time = ?, end_time = ? WHERE id = ?",
    [startTime, endTime, id]
  );

  await db.query(
    "DELETE FROM timetable_subjects WHERE timetable_id = ?",
    [id]
  );

  for (const day in subjects) {
    await db.query(
      "INSERT INTO timetable_subjects (timetable_id, day, subject) VALUES (?, ?, ?)",
      [id, day, subjects[day]]
    );
  }

  res.json({ success: true });
});

app.delete("/timetable/:id", async (req, res) => {
  const { id } = req.params;

  await db.query(
    "DELETE FROM timetable WHERE id = ?",
    [id]
  );

  res.json({ success: true });
});

app.listen(5000, () => console.log("Server running on port 5000"));
