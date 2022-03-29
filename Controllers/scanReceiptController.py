from flask import Flask, request
from Features.Scan_receipt.scanReceiptManager import scanReceiptManager
from Repositories.receiptRepository import receiptRepository

app = Flask(__name__)


@app.route('/scan_receipt', methods=['POST'])
def scan_receipt():
    image_file = request.files['image']
    user_details = request.form['user_name']

    scan_receipt_manager = scanReceiptManager()

    #temporary solution --> default name from app
    response = scan_receipt_manager.action_scan_receipt_manager(image_file, user_details, "default name")
    return response


@app.route('/get_receipt_by_date', methods=['GET'])
def get_receipt_by_date():
    user_details = request.form['user_name']
    from_date = request.form['from_date']
    to_date = request.form['to_date']

    scan_receipt_repository = receiptRepository()
    return scan_receipt_repository.get_by_date(user_details, from_date, to_date)

@app.route('/get_markets', methods=['GET'])
def get_markets_receipt():
    user_details = request.form['user_name']
    receipt_repository = receiptRepository()
    return receipt_repository.get_values_by_key(user_details, "market")@app.route('/get_markets', methods=['GET'])


@app.route('/get_receipt_by_market', methods=['GET'])
def get_receipt_by_market():
    user_details = request.form['user_name']
    market = request.form['market']
    receipt_repository = receiptRepository()
    return receipt_repository.get_receipt_by_value(user_details, "market", market)

@app.route('/get_receipt_by_name', methods=['GET'])
def get_receipt_by_name():
    user_details = request.form['user_name']
    name_search = request.form['name_search']
    receipt_repository = receiptRepository()
    return receipt_repository.get_receipt_by_name(user_details, name_search)
app.run()