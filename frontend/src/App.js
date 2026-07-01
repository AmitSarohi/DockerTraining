import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import EmployeeList from './components/EmployeeList';
import AddEmployee from './pages/AddEmployee';

export default function App() {
  return (
    <div className="container">
      <nav className="nav">
        <h1>Employee Management</h1>
        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/add">Add Employee</Link>
        </div>
      </nav>

      <main>
        <Routes>
          <Route path="/" element={<EmployeeList />} />
          <Route path="/add" element={<AddEmployee />} />
        </Routes>
      </main>
    </div>
  );
}
