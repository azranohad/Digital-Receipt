from flask import request, Blueprint


from Server.Services.parseStoreDataService import parseStoreDataService
from Server.Services.receiptService import receiptService
from systemFiles.logger.loggerService import loggerService

store_api = Blueprint('store_api', __name__)
convertPDF = parseStoreDataService()
logger = loggerService()
receipt_service = receiptService()


@store_api.route('/get_receipt_store', methods=['OPTIONS', 'POST'])
def get_receipt_store():
    store_details = request.get_json(force=True)
    check = "200"
    convertPDF.convertToPDF(store_details)
    return check

@store_api.route('/insert_receipt_store', methods=['OPTIONS','POST'])
def insert_receipt_store():
    store_details = request.get_json(force=True)
    phone_number = store_details['buyer_name']
    receipt_data = request.get_json(force=True)['data']
    logger.print_api_message("storeController | received insert receipt post request | user: " + phone_number)
    receipt_data['is_digital_receipt'] = True
    return receipt_service.insert_receipt(phone_number, receipt_data)


