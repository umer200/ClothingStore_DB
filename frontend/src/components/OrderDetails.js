import React, { useEffect, useState } from 'react';
import api from '../api';

function OrderDetails() {
  const [details, setDetails] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [form, setForm] = useState({ order_id: '', product_id: '', quantity: '', subtotal: '' });
  const [editingId, setEditingId] = useState(null);

  const fetchAll = async () => {
    const [dRes, pRes, oRes] = await Promise.all([
      api.get('/order_details'),
      api.get('/products'),
      api.get('/orders')
    ]);
    setDetails(dRes.data);
    setProducts(pRes.data);
    setOrders(oRes.data);
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (editingId) {
      await api.put(`/order_details/${editingId}`, form);
    } else {
      await api.post('/order_details', form);
    }
    setForm({ order_id: '', product_id: '', quantity: '', subtotal: '' });
    setEditingId(null);
    fetchAll();
  };

  const handleEdit = d => {
    setForm({
      order_id: d.order_id,
      product_id: d.product_id,
      quantity: d.quantity,
      subtotal: d.subtotal
    });
    setEditingId(d.id);
  };

  const handleDelete = async id => {
    await api.delete(`/order_details/${id}`);
    fetchAll();
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Order Details</h2>
      <form onSubmit={handleSubmit}>
        <select name="order_id" value={form.order_id} onChange={handleChange} required>
          <option value="">Select Order</option>
          {orders.map(o => (
            <option key={o.order_id} value={o.order_id}>Order #{o.order_id}</option>
          ))}
        </select>
        <select name="product_id" value={form.product_id} onChange={handleChange} required>
          <option value="">Select Product</option>
          {products.map(p => (
            <option key={p.product_id} value={p.product_id}>{p.name}</option>
          ))}
        </select>
        <input name="quantity" type="number" placeholder="Quantity" value={form.quantity} onChange={handleChange} required />
        <input name="subtotal" type="number" placeholder="Subtotal" value={form.subtotal} onChange={handleChange} required />
        <button type="submit">{editingId ? 'Update' : 'Add'} Detail</button>
        {editingId && <button onClick={() => { setEditingId(null); setForm({ order_id: '', product_id: '', quantity: '', subtotal: '' }); }}>Cancel</button>}
      </form>

      <table border="1" cellPadding="8" style={{ marginTop: '20px', width: '100%' }}>
        <thead>
          <tr><th>ID</th><th>Order</th><th>Product</th><th>Qty</th><th>Subtotal</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {details.map(d => (
            <tr key={d.id}>
              <td>{d.id}</td>
              <td>{d.order_id}</td>
              <td>{d.product_id}</td>
              <td>{d.quantity}</td>
              <td>${d.subtotal}</td>
              <td>
                <button onClick={() => handleEdit(d)}>Edit</button>
                <button onClick={() => handleDelete(d.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default OrderDetails;
