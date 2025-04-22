import React, { useEffect, useState } from 'react';
import api from '../api';

function Products() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ id:'', name: '', price: '', stock_quantity: '' });
  const [editingId, setEditingId] = useState(null);

  const fetchProducts = async () => {
    const res = await api.get('/products');
    console.log(res.data);
    setProducts(res.data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (editingId) {
      await api.put(`/products/${editingId}`, form);
    } else {
      await api.post('/products/', form);
    }
    setForm({id:'', name: '', price: '', stock_quantity: '' });
    setEditingId(null);
    fetchProducts();
  };

  const handleEdit = p => {
    setForm({ id: p.ProductID, name: p.Name, price: p.Price, stock_quantity: p.StockQuantity });
    setEditingId(p.ProductID);
  };

  const handleDelete = async id => {
    await api.delete(`/products/${id}`);
    fetchProducts();
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Products</h2>
      <form onSubmit={handleSubmit}>
        <input name="id" placeholder="ProductID" value={form.id} onChange={handleChange} required />
        <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
        <input name="price" type="number" placeholder="Price" value={form.price} onChange={handleChange} required />
        <input name="stock_quantity" type="number" placeholder="Stock" value={form.stock_quantity} onChange={handleChange} required />
        <button type="submit">{editingId ? 'Update' : 'Add'} Product</button>
        {editingId && <button onClick={() => { setEditingId(null); setForm({ id: '', name: '', price: '', stock_quantity: '' }); }}>Cancel</button>}
      </form>

      <table border="1" cellPadding="8" style={{ marginTop: '20px', width: '100%' }}>
        <thead>
          <tr>
            <th>ID</th><th>Name</th><th>Price</th><th>Stock</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map(p => (
            <tr key={p.ProductID}>
              <td>{p.ProductID}</td>
              <td>{p.Name}</td>
              <td>${p.Price}</td>
              <td>{p.StockQuantity}</td>
              <td>
                <button onClick={() => handleEdit(p)}>Edit</button>
                <button onClick={() => handleDelete(p.ProductID)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Products;
