import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Customers from './components/Customers';
import Products from './components/Products';
import Orders from './components/Orders';
import OrderDetails from './components/OrderDetails';
import Analytics from './components/Analytics';

function App() {
  return (
    <Router>
      <nav style={{ margin: 20 }}>
        <Link to="/customers">Customers</Link> |{" "}
        <Link to="/products">Products</Link> |{" "}
        <Link to="/orders">Orders</Link> |{" "}
        <Link to="/orderdetails">OrderDetails</Link> |{" "}
        <Link to="/analytics">Analytics</Link>
      </nav>
      <Routes>
        <Route path="/customers" element={<Customers />} />
        <Route path="/products" element={<Products />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/orderdetails" element={<OrderDetails />} />
        <Route path="/analytics" element={<Analytics />} />
      </Routes>
    </Router>
  );
}

export default App;
