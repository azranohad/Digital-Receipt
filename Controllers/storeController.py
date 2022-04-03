from flask import Blueprint

store_api = Blueprint('store_api', __name__)




@store_api.route('/get_receipt_store', methods=['POST'])
def get_receipt_store():
    check = 3
    return str(check)