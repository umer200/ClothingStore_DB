from flask import Flask
from flask_cors import CORS

from routes.customers import customers_bp
# from routes.products import products_bp
# from routes.orders import orders_bp
# from routes.orderDetails import order_details_bp

app = Flask(__name__)
CORS(app)

# Register routes with prefixes
app.register_blueprint(customers_bp, url_prefix="/api/customers")
# app.register_blueprint(products_bp, url_prefix="/api/products")
# app.register_blueprint(orders_bp, url_prefix="/api/orders")
# app.register_blueprint(order_details_bp, url_prefix="/api/orderdetails")

if __name__ == "__main__":
    app.run(debug=True)
