import React, { useEffect, useState } from 'react';
import api from '../api';

function Customers() {
  const [customers, setCustomers] = useState([]);
  const [form, setForm] = useState({ name: '', email: '', phone: '' });
  const [editingId, setEditingId] = useState(null);

  // Fetch all customers
  const fetchCustomers = async () => {
    const res = await api.get('/customers');
    console.log(res.data);
    setCustomers(res.data);
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  // Handle form input changes
  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Submit form for create or update
  const handleSubmit = async e => {
    e.preventDefault();
    if (editingId) {
      await api.put(`/customers/${editingId}`, form);
    } else {
      await api.post('/customers', form);
    }
    setForm({ name: '', email: '', phone: '' });
    setEditingId(null);
    fetchCustomers();
  };

  const handleEdit = customer => {
    setForm({ name: customer.Name, email: customer.Email, phone: customer.Phone });
    setEditingId(customer.CustomerID);
  };

  const handleDelete = async id => {
    await api.delete(`/customers/${id}`);
    fetchCustomers();
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Customers</h2>
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
        <input name="email" placeholder="Email" value={form.email} onChange={handleChange} required />
        <input name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} required />
        <button type="submit">{editingId ? 'Update' : 'Add'} Customer</button>
        {editingId && <button onClick={() => {
          setEditingId(null);
          setForm({ name: '', email: '', phone: '' });
        }}>Cancel</button>}
      </form>

      <table border="1" cellPadding="8" style={{ marginTop: '20px', width: '100%' }}>
        <thead>
          <tr>
            <th>ID</th><th>Name</th><th>Email</th><th>Phone</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {customers.map(c => (
            <tr key={c.CustomerID}>
              <td>{c.CustomerID}</td>
              <td>{c.Name}</td>
              <td>{c.Email}</td>
              <td>{c.Phone}</td>
              <td>
                <button onClick={() => handleEdit(c)}>Edit</button>
                <button onClick={() => handleDelete(c.CustomerID)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Customers;
