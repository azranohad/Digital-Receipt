from flask import request, Blueprint
from Server.Features.ScanReceipt.scanReceiptManager import scanReceiptManager
from Server.Repositories.receiptRepository import receiptRepository
from Server.Repositories.serverLocalRepository import serverLocalRepository
from SystemFiles.logger.loggerService import loggerService

scan_receipt_api = Blueprint('scan_receipt_api', __name__)

logger = loggerService()
scan_receipt_manager = scanReceiptManager()
receipt_repository = receiptRepository()
server_local_repository = serverLocalRepository()

@scan_receipt_api.route('/scan_receipt', methods=['POST'])
def scan_receipt():
    image_file = request.files['image']
    user_key = request.form['user_key']
    #image_name = request.form['name']
    image_name = "request.form['name']"
    logger.print_api_message("received scan receipt post request | user: " + user_key)

    response = scan_receipt_manager.action_scan_receipt_manager(image_file, user_key, image_name)
    return response


@scan_receipt_api.route('/update_receipt', methods=['PATCH'])
def update_credit():
    user_key = request.get_json(force=True)['user_key']
    receipt_id = request.get_json(force=True)['credit_id']
    logger.print_api_message("received update receipt post request | user: " + user_key + ", receipt id: " + receipt_id)


@scan_receipt_api.route('/get_receipt_by_date', methods=['GET'])
def get_receipt_by_date():
    user_details = request.get_json(force=True)['user_key']
    logger.print_api_message("received get_receipt_by_date request | user: " + user_details)

    from_date = request.get_json(force=True)['from_date']
    to_date = request.get_json(force=True)['to_date']

    scan_receipt_repository = receiptRepository()
    return scan_receipt_repository.get_by_date(user_details, from_date, to_date)


@scan_receipt_api.route('/get_markets', methods=['GET'])
def get_markets_receipt():
    user_details = request.get_json(force=True)['user_key']
    logger.print_api_message("received get_markets request | user: " + user_details)

    return receipt_repository.get_values_by_key(user_details, "market")


@scan_receipt_api.route('/get_receipt_by_market', methods=['GET'])
def get_receipt_by_market():
    user_details = request.get_json(force=True)['user_key']
    market = request.get_json(force=True)['market']
    logger.print_api_message("received get_receipt_by_market request | user: " + user_details + "| market:" + market)

    return receipt_repository.get_receipt_by_value(user_details, "market", market)


@scan_receipt_api.route('/get_all_receipts_user', methods=['GET'])
def get_all_receipts_user():
    user_key = request.get_json(force=True)['user_key']
    logger.print_api_message("received get_all_receipts_user request | user: " + user_key)

    return receipt_repository.get_all_receipts_user(user_key)


@scan_receipt_api.route('/get_receipt_by_name', methods=['GET'])
def get_receipt_by_name():
    user_details = request.get_json(force=True)['user_key']
    name_search = request.get_json(force=True)['name_search']
    logger.print_api_message("received get_receipt_by_name request | user: " + user_details + "| name receipt:" + name_search)

    return receipt_repository.get_receipt_by_name(user_details, name_search)


@scan_receipt_api.route('/get_image_receipt', methods=['GET'])
def get_image_receipt():
    user_details = request.get_json(force=True)['user_key']
    image_name = request.get_json(force=True)['image_name']
    logger.print_api_message("received get_image_receipt request | user: " + user_details + "| image name:" + image_name)

    return server_local_repository.get_image(user_details, image_name)





