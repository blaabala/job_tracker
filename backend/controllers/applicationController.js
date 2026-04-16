const db = require('../config/db');

// GET all applications for logged in user
const getApplications = async (req, res) => {
  try {
    const [applications] = await db.query(
      'SELECT * FROM applications WHERE user_id = ? ORDER BY created_at DESC',
      [req.user.id]
    );
    res.json(applications);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// GET single application
const getApplication = async (req, res) => {
  try {
    const [applications] = await db.query(
      'SELECT * FROM applications WHERE id = ? AND user_id = ?',
      [req.params.id, req.user.id]
    );

    if (applications.length === 0) {
      return res.status(404).json({ message: 'Application not found' });
    }

    res.json(applications[0]);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// CREATE application
const createApplication = async (req, res) => {
  const { company, role, location, job_url, status, date_applied, follow_up_date, notes } = req.body;

  try {
    const [result] = await db.query(
      `INSERT INTO applications 
        (user_id, company, role, location, job_url, status, date_applied, follow_up_date, notes) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [req.user.id, company, role, location, job_url, status, date_applied, follow_up_date, notes]
    );

    res.status(201).json({ message: 'Application created', id: result.insertId });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// UPDATE application
const updateApplication = async (req, res) => {
  const { company, role, location, job_url, status, date_applied, follow_up_date, notes } = req.body;

  try {
    // First check if application belongs to the logged in user
    const [existing] = await db.query(
      'SELECT * FROM applications WHERE id = ? AND user_id = ?',
      [req.params.id, req.user.id]
    );

    if (existing.length === 0) {
      return res.status(404).json({ message: 'Application not found' });
    }

    await db.query(
      `UPDATE applications SET 
        company = ?, role = ?, location = ?, job_url = ?, 
        status = ?, date_applied = ?, follow_up_date = ?, notes = ?
       WHERE id = ? AND user_id = ?`,
      [company, role, location, job_url, status, date_applied, follow_up_date, notes, req.params.id, req.user.id]
    );

    res.json({ message: 'Application updated' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// DELETE application
const deleteApplication = async (req, res) => {
  try {
    // First check if application belongs to the logged in user
    const [existing] = await db.query(
      'SELECT * FROM applications WHERE id = ? AND user_id = ?',
      [req.params.id, req.user.id]
    );

    if (existing.length === 0) {
      return res.status(404).json({ message: 'Application not found' });
    }

    await db.query(
      'DELETE FROM applications WHERE id = ? AND user_id = ?',
      [req.params.id, req.user.id]
    );

    res.json({ message: 'Application deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { getApplications, getApplication, createApplication, updateApplication, deleteApplication };