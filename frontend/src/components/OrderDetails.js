import React, { useEffect, useState } from 'react';
import api from '../api';

function OrderDetails() {
  const [details, setDetails] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);

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

  

  

  

  

  return (
    <div style={{ padding: '20px' }}>
      <h2>Order Details</h2>
      

      <table border="1" cellPadding="8" style={{ marginTop: '20px', width: '100%' }}>
        <thead>
          <tr><th>Order Detail ID</th><th>Order ID</th><th>Product</th><th>Qty</th><th>Subtotal</th></tr>
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
            </tr>
            );
              })}
        </tbody>
      </table>
    </div>
  );
}

export default OrderDetails;
