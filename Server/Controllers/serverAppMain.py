from flask import Flask
import socket

from Server.Controllers.creditController import scan_credit_api
from Server.Controllers.recommendationSystemController import recommendation_system_api
from receiptController import receipt_api
from storeController import store_api
from userController import users_api
from locationController import location_api
app = Flask(__name__)
app.config['JSON_SORT_KEYS'] = False

#list of controller
app.register_blueprint(receipt_api, url_prefix='/scan_receipt_controller')
app.register_blueprint(store_api, url_prefix='/store_controller')
app.register_blueprint(users_api, url_prefix='/users_controller')
app.register_blueprint(location_api, url_prefix='/location_controller')
app.register_blueprint(scan_credit_api, url_prefix='/scan_credit_controller')
app.register_blueprint(recommendation_system_api, url_prefix='/recommendation_system_controller')

import socket

hostname = socket.getfqdn()

app.debug = True
IP_Address = socket.gethostbyname_ex(hostname)[2][1]
app.run(host=IP_Address, threaded=True)

