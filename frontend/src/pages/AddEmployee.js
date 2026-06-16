import React, { useState } from 'react';
import api from '../services/api';

export default function AddEmployee() {
  const [form, setForm] = useState({ name: '', email: '', department: '' });
  const [saving, setSaving] = useState(false);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post('/employees', form);
      alert('Employee added');
      setForm({ name: '', email: '', department: '' });
    } catch (err) {
      console.error('Failed to add', err);
      alert('Failed to add employee');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h2>Add Employee</h2>
      <form onSubmit={onSubmit} className="form">
        <label>
          Name
          <input name="name" value={form.name} onChange={onChange} required />
        </label>
        <label>
          Email
          <input name="email" value={form.email} onChange={onChange} type="email" required />
        </label>
        <label>
          Department
          <input name="department" value={form.department} onChange={onChange} required />
        </label>
        <button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Add'}</button>
      </form>
    </div>
  );
}
