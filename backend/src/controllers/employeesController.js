const db = require('../db');

// Get all employees
exports.getEmployees = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM employees ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch employees' });
  }
};

// Create a new employee
exports.createEmployee = async (req, res) => {
  const { name, email, department } = req.body;
  if (!name || !email || !department) {
    return res.status(400).json({ error: 'Missing fields' });
  }
  try {
    const result = await db.query(
      'INSERT INTO employees (name,email,department) VALUES ($1,$2,$3) RETURNING *',
      [name, email, department]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create employee' });
  }
};

// Delete an employee
exports.deleteEmployee = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (!id) return res.status(400).json({ error: 'Invalid id' });
  try {
    await db.query('DELETE FROM employees WHERE id = $1', [id]);
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete employee' });
  }
};
