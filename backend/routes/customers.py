from flask import Blueprint, request, jsonify
from db_config import get_connection

customers_bp = Blueprint('customers', __name__)

# GET all customers
@customers_bp.route('/', methods=['GET'])
def get_all_customers():
    conn = get_connection()
    try:
        with conn.cursor() as cur:
            cur.execute("SELECT * FROM Customers")
            rows = cur.fetchall()
            return jsonify(rows), 200
    finally:
        conn.close()

# GET one customer by ID
@customers_bp.route('/<int:customer_id>', methods=['GET'])
def get_customer(customer_id):
    conn = get_connection()
    try:
        with conn.cursor() as cur:
            cur.execute("SELECT * FROM Customers WHERE CustomerID = %s", (customer_id,))
            row = cur.fetchone()
            return jsonify(row if row else {}), 200 if row else 404
    finally:
        conn.close()

# POST (create) new customer
@customers_bp.route('/', methods=['POST'])
def create_customer():
    data = request.get_json()
    conn = get_connection()
    try:
        with conn.cursor() as cur:
            cur.execute(
                "INSERT INTO Customers (CustomerID, Name, Email, Phone) VALUES (%s, %s, %s, %s)",
                (int(data['id']), data['name'], data['email'], data['phone'])
            )
            conn.commit()
            return jsonify({"message": "Customer created", "customer_id": cur.lastrowid}), 201
    finally:
        conn.close()

# PUT (update) customer by ID
@customers_bp.route('/<int:customer_id>', methods=['PUT'])
def update_customer(customer_id):
    data = request.get_json()
    conn = get_connection()
    try:
        with conn.cursor() as cur:
            cur.execute(
                "UPDATE Customers SET Name = %s, Email = %s, Phone = %s WHERE CustomerID = %s",
                (data['name'], data['email'], data['phone'], customer_id)
            )
            conn.commit()
            return jsonify({"message": "Customer updated"}), 200
    finally:
        conn.close()

# DELETE customer by ID
@customers_bp.route('/<int:customer_id>', methods=['DELETE'])
def delete_customer(customer_id):
    conn = get_connection()
    try:
        with conn.cursor() as cur:
            cur.execute("DELETE FROM Customers WHERE CustomerID = %s", (customer_id,))
            conn.commit()
            return jsonify({"message": "Customer deleted"}), 200
    finally:
        conn.close()
