import express from 'express';
import cors from 'cors';
import mysql from 'mysql2/promise';
import { config } from './config';

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Database connection pool
const pool = mysql.createPool({
  host: config.database.host,
  user: config.database.user,
  password: config.database.password,
  database: config.database.name,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Follow-ups routes
app.get('/api/follow-ups', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT f.*, 
        c.name as client_name, c.company_name,
        u.full_name as assigned_to_name,
        GROUP_CONCAT(t.name) as tag_names,
        GROUP_CONCAT(t.color) as tag_colors
      FROM follow_ups f
      LEFT JOIN clients c ON f.client_id = c.id
      LEFT JOIN users u ON f.assigned_to = u.id
      LEFT JOIN follow_up_tags ft ON f.id = ft.follow_up_id
      LEFT JOIN tags t ON ft.tag_id = t.id
      GROUP BY f.id
      ORDER BY f.due_date ASC
    `);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching follow-ups:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/follow-ups/:id', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM follow_ups WHERE id = ?',
      [req.params.id]
    );
    if (rows.length === 0) {
      res.status(404).json({ error: 'Follow-up not found' });
    } else {
      res.json(rows[0]);
    }
  } catch (error) {
    console.error('Error fetching follow-up:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/follow-ups', async (req, res) => {
  try {
    const { client_id, assigned_to, title, description, status, priority, due_date } = req.body;
    const [result] = await pool.query(
      'INSERT INTO follow_ups (client_id, assigned_to, title, description, status, priority, due_date) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [client_id, assigned_to, title, description, status, priority, due_date]
    );
    const [newFollowUp] = await pool.query('SELECT * FROM follow_ups WHERE id = ?', [result.insertId]);
    res.status(201).json(newFollowUp[0]);
  } catch (error) {
    console.error('Error creating follow-up:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/api/follow-ups/:id', async (req, res) => {
  try {
    const { status, priority, due_date, completed_at } = req.body;
    await pool.query(
      'UPDATE follow_ups SET status = ?, priority = ?, due_date = ?, completed_at = ? WHERE id = ?',
      [status, priority, due_date, completed_at, req.params.id]
    );
    const [updatedFollowUp] = await pool.query('SELECT * FROM follow_ups WHERE id = ?', [req.params.id]);
    res.json(updatedFollowUp[0]);
  } catch (error) {
    console.error('Error updating follow-up:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/api/follow-ups/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM follow_ups WHERE id = ?', [req.params.id]);
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting follow-up:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Follow-up History routes
app.get('/api/follow-ups/:id/history', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM follow_up_history WHERE follow_up_id = ? ORDER BY created_at DESC',
      [req.params.id]
    );
    res.json(rows);
  } catch (error) {
    console.error('Error fetching follow-up history:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/follow-ups/:id/history', async (req, res) => {
  try {
    const { action_by, action_type, action_notes } = req.body;
    const [result] = await pool.query(
      'INSERT INTO follow_up_history (follow_up_id, action_by, action_type, action_notes) VALUES (?, ?, ?, ?)',
      [req.params.id, action_by, action_type, action_notes]
    );
    const [newHistory] = await pool.query('SELECT * FROM follow_up_history WHERE id = ?', [result.insertId]);
    res.status(201).json(newHistory[0]);
  } catch (error) {
    console.error('Error creating follow-up history:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Reminders routes
app.get('/api/follow-ups/:id/reminders', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM reminders WHERE follow_up_id = ? ORDER BY reminder_date ASC',
      [req.params.id]
    );
    res.json(rows);
  } catch (error) {
    console.error('Error fetching reminders:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/follow-ups/:id/reminders', async (req, res) => {
  try {
    const { reminder_date, reminder_type } = req.body;
    const [result] = await pool.query(
      'INSERT INTO reminders (follow_up_id, reminder_date, reminder_type) VALUES (?, ?, ?)',
      [req.params.id, reminder_date, reminder_type]
    );
    const [newReminder] = await pool.query('SELECT * FROM reminders WHERE id = ?', [result.insertId]);
    res.status(201).json(newReminder[0]);
  } catch (error) {
    console.error('Error creating reminder:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Statistics routes
app.get('/api/stats/follow-ups', async (req, res) => {
  try {
    const [statusStats] = await pool.query(`
      SELECT status, COUNT(*) as count
      FROM follow_ups
      GROUP BY status
    `);
    
    const [priorityStats] = await pool.query(`
      SELECT priority, COUNT(*) as count
      FROM follow_ups
      GROUP BY priority
    `);

    const [overdueCount] = await pool.query(`
      SELECT COUNT(*) as count
      FROM follow_ups
      WHERE status != 'completed'
      AND due_date < NOW()
    `);

    res.json({
      byStatus: statusStats,
      byPriority: priorityStats,
      overdue: overdueCount[0].count
    });
  } catch (error) {
    console.error('Error fetching follow-up stats:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
}); 