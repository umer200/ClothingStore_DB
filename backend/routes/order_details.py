from flask import Blueprint, request, jsonify
from db_config import get_connection  

order_details_bp = Blueprint('order_details', __name__)

@order_details_bp.route('/', methods=['GET'])
def get_all_order_details():
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("SELECT * FROM OrderDetails")
    rows = cur.fetchall()
    cur.close()
    conn.close()
    return jsonify(rows), 200

@order_details_bp.route('/<int:id>', methods=['GET'])
def get_order_detail(id):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("SELECT * FROM OrderDetails WHERE id = %s", (id,))
    row = cur.fetchone()
    cur.close()
    conn.close()
    return jsonify(row), 200 if row else 404

@order_details_bp.route('/', methods=['POST'])
def create_order_detail():
    data = request.get_json()
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("INSERT INTO OrderDetails (order_id, product_id, quantity, subtotal) VALUES (%s, %s, %s, %s)", 
                (data['order_id'], data['product_id'], data['quantity'], data['subtotal']))
    conn.commit()
    new_id = cur.lastrowid
    cur.close()
    conn.close()
    return jsonify({"message": "Order detail created", "id": new_id}), 201

@order_details_bp.route('/<int:id>', methods=['PUT'])
def update_order_detail(id):
    data = request.get_json()
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("UPDATE OrderDetails SET order_id = %s, product_id = %s, quantity = %s, subtotal = %s WHERE id = %s", 
                (data['order_id'], data['product_id'], data['quantity'], data['subtotal'], id))
    conn.commit()
    cur.close()
    conn.close()
    return jsonify({"message": "Order detail updated"}), 200

@order_details_bp.route('/<int:id>', methods=['DELETE'])
def delete_order_detail(id):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("DELETE FROM OrderDetails WHERE id = %s", (id,))
    conn.commit()
    cur.close()
    conn.close()
    return jsonify({"message": "Order detail deleted"}), 200
