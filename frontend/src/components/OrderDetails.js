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
    console.log("OrderDetails: ", dRes.data)
    console.log("Product: ", pRes.data)
    console.log("Order: ", oRes.data)
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
      order_id: d.OrderID,
      product_id: d.ProductID,
      quantity: d.Quantity,
      subtotal: d.Subtotal
    });
    setEditingId(d.OrderDetailID);
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
            <option key={o.OrderID} value={o.OrderID}>Order #{o.OrderID}</option>
          ))}
        </select>
        <select name="product_id" value={form.product_id} onChange={handleChange} required>
          <option value="">Select Product</option>
          {products.map(p => (
            <option key={p.ProductID} value={p.ProductID}>{p.Name}</option>
          ))}
        </select>
        <input name="quantity" type="number" placeholder="Quantity" value={form.quantity} onChange={handleChange} required />
        <input name="subtotal" type="number" placeholder="Subtotal" value={form.subtotal} onChange={handleChange} required />
        <button type="submit">{editingId ? 'Update' : 'Add'} Detail</button>
        {editingId && <button onClick={() => { setEditingId(null); setForm({ order_id: '', product_id: '', quantity: '', subtotal: '' }); }}>Cancel</button>}
      </form>

      <table border="1" cellPadding="8" style={{ marginTop: '20px', width: '100%' }}>
        <thead>
          <tr><th>Order Detail ID</th><th>Order ID</th><th>Product</th><th>Qty</th><th>Subtotal</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {details.map(d => {
            const product = products.find(p => p.ProductID === d.ProductID);
            // const order =
            return(
            <tr key={d.OrderDetailID}>
              <td>{d.OrderDetailID}</td>
              <td>{d.OrderID}</td>
              <td>{product.Name}</td>
              <td>{d.Quantity}</td>
              <td>${d.Subtotal}</td>
              <td>
                <button onClick={() => handleEdit(d)}>Edit</button>
                <button onClick={() => handleDelete(d.OrderDetailID)}>Delete</button>
              </td>
            </tr>
            );
              })}
        </tbody>
      </table>
    </div>
  );
}

export default OrderDetails;
