from flask import Flask
from flask_cors import CORS
from db_config import init_db

app = Flask(__name__)
CORS(app)

mysql = init_db(app)

# Register Blueprints
from routes.customers import customers_bp
from routes.products import products_bp
from routes.orders import orders_bp
from routes.orderDetails import order_details_bp
from routes.analytics import analytics_bp


app.register_blueprint(customers_bp, url_prefix='/api/customers')
app.register_blueprint(products_bp, url_prefix='/api/products')
app.register_blueprint(orders_bp, url_prefix='/api/orders')
app.register_blueprint(order_details_bp, url_prefix='/api/orderdetails')
app.register_blueprint(analytics_bp, url_prefix='/api/analytics')

if __name__ == "__main__":
    app.run(debug=True)
