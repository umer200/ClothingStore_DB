from flask import Blueprint, request, jsonify
from db_config import get_connection

products_bp = Blueprint('products', __name__)

@products_bp.route('/', methods=['GET'])
def get_all_products():
    conn = get_connection()
    try:
        with conn.cursor() as cur:
            cur.execute("SELECT * FROM Products")
            rows = cur.fetchall()
        return jsonify(rows), 200
    finally:
        conn.close()

@products_bp.route('/<int:product_id>', methods=['GET'])
def get_product(product_id):
    conn = get_connection()
    try:
        with conn.cursor() as cur:
            cur.execute("SELECT * FROM Products WHERE product_id = %s", (product_id,))
            row = cur.fetchone()
        if row:
            return jsonify(row), 200
        else:
            return jsonify({"error": "Product not found"}), 404
    finally:
        conn.close()

@products_bp.route('/', methods=['POST'])
def create_product():
    data = request.get_json()
    conn = get_connection()
    try:
        with conn.cursor() as cur:
            cur.execute(
                "INSERT INTO Products (name, price, stock_quantity) VALUES (%s, %s, %s)",
                (data['name'], data['price'], data['stock_quantity'])
            )
            conn.commit()
            new_id = cur.lastrowid
        return jsonify({"message": "Product created", "product_id": new_id}), 201
    finally:
        conn.close()

@products_bp.route('/<int:product_id>', methods=['PUT'])
def update_product(product_id):
    data = request.get_json()
    conn = get_connection()
    try:
        with conn.cursor() as cur:
            cur.execute(
                "UPDATE Products SET name = %s, price = %s, stock_quantity = %s WHERE product_id = %s",
                (data['name'], data['price'], data['stock_quantity'], product_id)
            )
            conn.commit()
        return jsonify({"message": "Product updated"}), 200
    finally:
        conn.close()

@products_bp.route('/<int:product_id>', methods=['DELETE'])
def delete_product(product_id):
    conn = get_connection()
    try:
        with conn.cursor() as cur:
            cur.execute("DELETE FROM Products WHERE product_id = %s", (product_id,))
            conn.commit()
        return jsonify({"message": "Product deleted"}), 200
    finally:
        conn.close()
