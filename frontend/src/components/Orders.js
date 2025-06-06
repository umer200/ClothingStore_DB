import React, { useEffect, useState } from 'react';
import api from '../api';

function Orders() {
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [form, setForm] = useState({ order_id:'', customer_id: '', order_date: '', total_amount:'' });
  const [editingId, setEditingId] = useState(null);

  const fetchOrders = async () => {
    const res = await api.get('/orders');
    console.log("Orders", res.data);
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
      await api.post('/orders/', form);
    }
    setForm({ order_id:'', customer_id: '', order_date: '', total_amount:'' });
    setEditingId(null);
    fetchOrders();
  };

  const handleEdit = o => {
    setForm({
        customer_id: o.CustomerID,
        order_date: o.OrderDate ? o.OrderDate : '',
      });
    setEditingId(o.OrderID);
  };

  const handleDelete = async id => {
    await api.delete(`/orders/${id}`);
    fetchOrders();
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Orders</h2>
      <form onSubmit={handleSubmit}>
      <input name="order_id" type="" placeholder="Order ID" value={form.order_id} onChange={handleChange} required />
        <select name="customer_id" value={form.customer_id} onChange={handleChange} required>
          <option value="">Select Customer</option>
          {customers.map(c => (
            <option key={c.CustomerID} value={c.CustomerID}>{c.Name}</option>
          ))}
        </select>
        <input name="order_date" type="date" value={form.order_date} onChange={handleChange} required />
        <input name="total_amount" type="" placeholder="Total Amount" value={form.total_amount} onChange={handleChange} required />
        <button type="submit">{editingId ? 'Update' : 'Add'} Order</button>
        {editingId && <button onClick={() => { setEditingId(null); setForm({ order_id:'', customer_id: '', order_date: '', total_amount:'' }); }}>Cancel</button>}
      </form>

      <table border="1" cellPadding="8" style={{ marginTop: '20px', width: '100%' }}>
        <thead>
          <tr><th>Order ID</th><th>Customer ID</th><th>Date</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {orders.map(o => (
            <tr key={o.OrderID}>
              <td>{o.OrderID}</td>
              <td>{o.CustomerID}</td>
              <td>{o.OrderDate ? o.OrderDate : 'N/A'}</td>
              <td>
                <button onClick={() => handleEdit(o)}>Edit</button>
                <button onClick={() => handleDelete(o.OrderID)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Orders;
