import React, { useEffect, useState } from 'react';
import api from '../api';

function Orders() {
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [form, setForm] = useState({ customer_id: '', order_date: '' });
  const [editingId, setEditingId] = useState(null);

  const fetchOrders = async () => {
    const res = await api.get('/orders');
    setOrders(res.data);
  };

  const fetchCustomers = async () => {
    const res = await api.get('/customers');
    setCustomers(res.data);
  };

  useEffect(() => {
    fetchOrders();
    fetchCustomers();
  }, []);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (editingId) {
      await api.put(`/orders/${editingId}`, form);
    } else {
      await api.post('/orders', form);
    }
    setForm({ customer_id: '', order_date: '' });
    setEditingId(null);
    fetchOrders();
  };

  const handleEdit = o => {
    setForm({
        customer_id: o.customer_id,
        order_date: o.order_date ? o.order_date.slice(0, 10) : '',
      });
    setEditingId(o.order_id);
  };

  const handleDelete = async id => {
    await api.delete(`/orders/${id}`);
    fetchOrders();
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Orders</h2>
      <form onSubmit={handleSubmit}>
        <select name="customer_id" value={form.customer_id} onChange={handleChange} required>
          <option value="">Select Customer</option>
          {customers.map(c => (
            <option key={c.CustomerID} value={c.CustomerID}>{c.Name}</option>
          ))}
        </select>
        <input name="order_date" type="date" value={form.order_date} onChange={handleChange} required />
        <button type="submit">{editingId ? 'Update' : 'Add'} Order</button>
        {editingId && <button onClick={() => { setEditingId(null); setForm({ customer_id: '', order_date: '' }); }}>Cancel</button>}
      </form>

      <table border="1" cellPadding="8" style={{ marginTop: '20px', width: '100%' }}>
        <thead>
          <tr><th>ID</th><th>Customer</th><th>Date</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {orders.map(o => (
            <tr key={o.order_id}>
              <td>{o.order_id}</td>
              <td>{o.CustomerID}</td>
              <td>{o.order_date ? o.order_date.slice(0, 10) : 'N/A'}</td>
              <td>
                <button onClick={() => handleEdit(o)}>Edit</button>
                <button onClick={() => handleDelete(o.order_id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Orders;
