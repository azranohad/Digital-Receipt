# from flask import Flask
from flask import Flask

from Server.Controllers.creditController import scan_credit_api
from receiptController import scan_receipt_api
from storeController import store_api
from userController import users_api
from locationController import location_api
app = Flask(__name__)



#list of controller
app.register_blueprint(scan_receipt_api, url_prefix='/scan_receipt_controller')
app.register_blueprint(store_api, url_prefix='/store_controller')
app.register_blueprint(users_api, url_prefix='/users_controller')
app.register_blueprint(location_api, url_prefix='/location_controller')
app.register_blueprint(scan_credit_api, url_prefix='/scan_credit_controller')


app.debug = True
app.run(host="0.0.0.0", threaded=True)