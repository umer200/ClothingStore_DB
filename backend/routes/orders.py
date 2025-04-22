from flask import Blueprint, request, jsonify
from db_config import get_connection

orders_bp = Blueprint('orders', __name__)

@orders_bp.route('/', methods=['GET'])
def get_all_orders():
    conn = get_connection()
    try:
        with conn.cursor() as cur:
            cur.execute("SELECT * FROM Orders")
            rows = cur.fetchall()
        return jsonify(rows), 200
    finally:
        conn.close()

@orders_bp.route('/<int:order_id>', methods=['GET'])
def get_order(order_id):
    conn = get_connection()
    try:
        with conn.cursor() as cur:
            cur.execute("SELECT * FROM Orders WHERE OrderID = %s", (order_id,))
            row = cur.fetchone()
        if row:
            return jsonify(row), 200
        else:
            return jsonify({"error": "Order not found"}), 404
    finally:
        conn.close()

@orders_bp.route('/', methods=['POST'])
def create_order():
    data = request.get_json()
    conn = get_connection()
    try:
        with conn.cursor() as cur:
            cur.execute(
                "INSERT INTO Orders (OrderID, CustomerID, OrderDate, TotalAmount) VALUES (%s, %s, %s, %s)",
                (data['order_id'], data['customer_id'], data['order_date'], int(data['total_amount']))
            )
            conn.commit()
            new_id = cur.lastrowid
        return jsonify({"message": "Order created", "order_id": new_id}), 201
    finally:
        conn.close()

@orders_bp.route('/<int:order_id>', methods=['PUT'])
def update_order(order_id):
    data = request.get_json()
    conn = get_connection()
    try:
        with conn.cursor() as cur:
            cur.execute(
                "UPDATE Orders SET CustomerID = %s, OrderDate = %s WHERE OrderID = %s",
                (data['customer_id'], data['order_date'], order_id)
            )
            conn.commit()
        return jsonify({"message": "Order updated"}), 200
    finally:
        conn.close()

@orders_bp.route('/<int:order_id>', methods=['DELETE'])
def delete_order(order_id):
    conn = get_connection()
    try:
        with conn.cursor() as cur:
            cur.execute("DELETE FROM Orders WHERE OrderID = %s", (order_id,))
            conn.commit()
        return jsonify({"message": "Order deleted"}), 200
    finally:
        conn.close()
