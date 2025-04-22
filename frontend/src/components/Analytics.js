import React, { useState } from 'react';
import api from '../api';

function Analytics() {
  const [result, setResult] = useState([]);
  const [title, setTitle] = useState('');

  const fetchData = async (endpoint, titleText) => {
    setTitle(titleText);
    const res = await api.get(`/analytics/${endpoint}`);
    setResult(res.data);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Analytics</h2>

      <div style={{ marginBottom: '15px' }}>
        <button onClick={() => fetchData('orders_with_customers', 'Orders with Customer Info')}>
          Orders with Customers
        </button>{" "}
        <button onClick={() => fetchData('top_products', 'Top 5 Selling Products')}>
          Top Products
        </button>{" "}
        <button onClick={() => fetchData('big_spenders', 'Customers Spending Over $100')}>
          Big Spenders
        </button>
      </div>

      {title && <h3>{title}</h3>}

      {result.length > 0 && (
        <table border="1" cellPadding="8" style={{ width: '100%' }}>
          <thead>
            <tr>
              {Object.keys(result[0]).map((col, idx) => (
                <th key={idx}>{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {result.map((row, i) => (
              <tr key={i}>
                {Object.values(row).map((val, j) => (
                  <td key={j}>{val}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Analytics;
