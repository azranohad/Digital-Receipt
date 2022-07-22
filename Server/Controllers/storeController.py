from flask import request, Blueprint


from Server.Services.parseStoreDataService import parseStoreDataService
from Server.Services.receiptService import receiptService
from Server.serverConsts import serverConsts
from SystemFiles.logger.loggerService import loggerService
import dateutil
from dateutil.parser import parse
store_api = Blueprint('store_api', __name__)
convertPDF = parseStoreDataService()
logger = loggerService()
receipt_service = receiptService()
server_consts = serverConsts()


@store_api.route('/get_receipt_store', methods=['OPTIONS', 'POST'])
def get_receipt_store():
    store_details = request.get_json(force=True)
    check = "200"
    convertPDF.convertToPDF(store_details)
    return check

@store_api.route('/insert_receipt_store', methods=['POST'])
def insert_receipt_store():
    phone_number = request.get_json(force=True)[server_consts.PHONE_NUMBER]
    receipt_data = request.get_json(force=True)[server_consts.RECEIPT_DATA]
    logger.print_api_message("storeController | received insert receipt post request | user: " + phone_number)
    receipt_data[server_consts.IS_DIGITAL_RECEIPT] = True
    receipt_data[server_consts.DATE_OF_RECEIPT] = dateutil.parser.parse(
        receipt_data.get(server_consts.DATE_OF_RECEIPT))
    return receipt_service.insert_receipt(phone_number, receipt_data)


