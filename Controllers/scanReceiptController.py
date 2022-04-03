from flask import request, Blueprint
from Features.Scan_receipt.scanReceiptManager import scanReceiptManager
from Repositories.receiptRepository import receiptRepository
from Repositories.serverLocalRepository import serverLocalRepository
from systemFiles.logger.loggerService import loggerService

scan_receipt_api = Blueprint('scan_receipt_api', __name__)

logger = loggerService()
scan_receipt_manager = scanReceiptManager()
receipt_repository = receiptRepository()
server_local_repository = serverLocalRepository()


@scan_receipt_api.route('/scan_receipt', methods=['POST'])
def scan_receipt():
    image_file = request.files['image']
    user_details = request.form['user_name']
    logger.print_api_message("received scan receipt post request | user: " + user_details)

    #temporary solution --> default name from app
    response = scan_receipt_manager.action_scan_receipt_manager(image_file, user_details, "default name")
    return response


@scan_receipt_api.route('/get_receipt_by_date', methods=['GET'])
def get_receipt_by_date():

    user_details = request.form['user_name']
    logger.print_api_message("received get_receipt_by_date request | user: " + user_details)

    from_date = request.form['from_date']
    to_date = request.form['to_date']

    scan_receipt_repository = receiptRepository()
    return scan_receipt_repository.get_by_date(user_details, from_date, to_date)

@scan_receipt_api.route('/get_markets', methods=['GET'])
def get_markets_receipt():
    user_details = request.form['user_name']
    logger.print_api_message("received get_markets request | user: " + user_details)

    return receipt_repository.get_values_by_key(user_details, "market")


@scan_receipt_api.route('/get_receipt_by_market', methods=['GET'])
def get_receipt_by_market():
    user_details = request.form['user_name']
    market = request.form['market']
    logger.print_api_message("received get_receipt_by_market request | user: " + user_details + "| market:" + market)

    return receipt_repository.get_receipt_by_value(user_details, "market", market)

@scan_receipt_api.route('/get_receipt_by_name', methods=['GET'])
def get_receipt_by_name():
    user_details = request.form['user_name']
    name_search = request.form['name_search']
    logger.print_api_message("received get_receipt_by_name request | user: " + user_details + "| name receipt:" + name_search)

    return receipt_repository.get_receipt_by_name(user_details, name_search)

@scan_receipt_api.route('/get_image_receipt', methods=['GET'])
def get_image_receipt():
    user_details = request.form['user_name']
    image_name = request.form['image_name']
    logger.print_api_message("received get_image_receipt request | user: " + user_details + "| image name:" + image_name)

    return server_local_repository.get_image_receipt(user_details, image_name)





