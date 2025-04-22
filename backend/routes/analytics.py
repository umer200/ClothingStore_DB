from flask import Blueprint, jsonify
from db_config import get_connection

analytics_bp = Blueprint('analytics', __name__)

# JOIN: List all orders with customer name and total amount
@analytics_bp.route('/orders_with_customers', methods=['GET'])
def orders_with_customers():
    conn = get_connection()
    try:
        with conn.cursor() as cur:
            cur.execute("""
                SELECT 
                    o.OrderID, c.Name AS customer_name, o.OrderDate, 
                    SUM(od.Subtotal) AS total_amount
                FROM Orders o
                JOIN Customers c ON o.CustomerID = c.CustomerID
                JOIN OrderDetails od ON o.OrderID = od.OrderID
                GROUP BY o.OrderID, c.name, o.OrderDate
                ORDER BY o.OrderDate DESC
            """)
            rows = cur.fetchall()
        return jsonify(rows), 200
    finally:
        conn.close()

# JOIN: Top 5 selling products
@analytics_bp.route('/top_products', methods=['GET'])
def top_products():
    conn = get_connection()
    try:
        with conn.cursor() as cur:
            cur.execute("""
                SELECT 
                    p.Name AS product_name,
                    SUM(od.Quantity) AS total_sold
                FROM OrderDetails od
                JOIN Products p ON od.ProductID = p.ProductID
                GROUP BY p.Name
                ORDER BY total_sold DESC
                LIMIT 5
            """)
            rows = cur.fetchall()
        return jsonify(rows), 200
    finally:
        conn.close()

# Subquery: Customers with total purchases > $100
@analytics_bp.route('/big_spenders', methods=['GET'])
def big_spenders():
    conn = get_connection()
    try:
        with conn.cursor() as cur:
            cur.execute("""
                SELECT Name, Email, Total_Spent FROM (
                    SELECT 
                        c.CustomerID,
                        c.Name,
                        c.Email,
                        SUM(od.Subtotal) AS total_spent
                    FROM Customers c
                    JOIN Orders o ON c.CustomerID = o.CustomerID
                    JOIN OrderDetails od ON o.OrderID = od.OrderID
                    GROUP BY c.customerID, c.Name, c.Email
                ) AS customer_totals
                WHERE total_spent > 100
            """)
            rows = cur.fetchall()
        return jsonify(rows), 200
    finally:
        conn.close()
