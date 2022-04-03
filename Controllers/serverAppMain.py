from flask import Flask
from scanReceiptController import scan_receipt_api
from storeController import store_api
from userController import users_api
app = Flask(__name__)



#list of controller
app.register_blueprint(scan_receipt_api, url_prefix='/scan_receipt_controller')
app.register_blueprint(store_api, url_prefix='/store_controller')
app.register_blueprint(users_api, url_prefix='/users_controller')



app.run(threaded=True)