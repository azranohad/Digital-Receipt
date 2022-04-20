from flask import request, Blueprint
import json

from sqlalchemy import true

from Services.parseStoreDataService import parseStoreDataService

store_api = Blueprint('store_api', __name__)
convertPDF = parseStoreDataService()


@store_api.route('/get_receipt_store', methods=['OPTIONS' ,'POST'])
def get_receipt_store():
    store_details = request.get_json(force=True)
    check = "200"
    convertPDF.convertToPDF(store_details)
    return check

