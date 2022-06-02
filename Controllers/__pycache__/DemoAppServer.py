from flask import Flask, request, jsonify
from markupsafe import escape
# from Features.Scan_receipt.scanReceiptManager import scanReceiptManager
# from Repositories.receiptRepository import receiptRepository

app = Flask(__name__)

@app.route('/login', methods=['POST'])
def user_name():
    print("user name")
    print(request.get_json(force=True)["user_name"]) # מדפיס את השם משתמש ששלחתי לך
    print(request.get_json(force=True)["password"]) # מדפיס את השם משתמש ששלחתי לך
    print("--------")

    #return jsonify({"Receipt_id": 1,"Receipt_name":"receipt #1", "Date": "20-01-22" ,"Store_name": "Super-Pharm", "Total_amount": 200})
    return jsonify("1")

@app.route('/scan_receipt', methods=['POST'])
def scan_receipt():
    print("hi")
    print(request.files["image"])
    print("ll")
    return jsonify({"l":"ll"})
    # print(request["_parts"])
    # print(request.form["_parts"])
    # return jsonify({"hello":"World!"})
    # image_file = request.files['image']
    # user_details = request.form['user_name']
    # print(image_file)
    # print(user_details)
    # scan_receipt_manager = scanReceiptManager()
    #
    # #temporary solution --> default name from app
    # response = scan_receipt_manager.action_scan_receipt_manager(image_file, user_details, "default name")
    # return response

#
@app.route('/get_credits_by_date', methods=['GET'])
def get_receipt_by_date():
    #print(escape(userId))
    print("--------")
    # print(request.get_json(force=True)["userId"]) # מדפיס את השם משתמש ששלחתי לך
    print("--------")
    return jsonify({"Receipt_id": 1,"Catagory": "Clothing","Receipt_name":"receipt #1", "Date": "20-01-22" ,"Store_name": "Super-Pharm", "Total_amount": 200},
                    {"Receipt_id": 2,"Catagory": "Clothing","Receipt_name":"receipt #2", "Date": "27-01-22" ,"Store_name": "Shilav", "Total_amount": 164},
                    {"Receipt_id": 3,"Catagory": "Electronics","Receipt_name":"receipt #3", "Date": "01-05-22" ,"Store_name": "Apple Store", "Total_amount": 1500})

@app.route('/get_month_receipts', methods=['GET'])
def get_credits():

    #print(escape(userId))
    print("--------")
    # print(request.get_json(force=True)["userId"]) # מדפיס את השם משתמש ששלחתי לך
    print("--------")
    return jsonify({"Receipt_id": 1,"Catagory": "Clothing", "Receipt_name":"receipt #1", "Date": "20-01-22" ,"Store_name": "Super-Pharm", "Total_amount": 200},
                    {"Receipt_id": 2,"Catagory": "Electronics","Receipt_name":"receipt #2", "Date": "27-01-22" ,"Store_name": "Shilav", "Total_amount": 164},
                    {"Receipt_id": 3,"Catagory": "Clothing","Receipt_name":"receipt #3", "Date": "01-05-22" ,"Store_name": "Apple Store", "Total_amount": 1500})


{"Item_id": 1,"Catagory": "Clothing", "Receipt_id":"1", "Date": "20-01-22" ,"Store_name": "Super-Pharm", "price": 20}
@app.route('/get_receipt_by_date2', methods=['GET'])
def get_receipt_by_date2():
    #print(escape(userId))

    print("--------")
    # print(request.get_json(force=True)["userId"]) # מדפיס את השם משתמש ששלחתי לך
    print("--------")
    return jsonify({"Receipt_id": 1,"Receipt_name":"receipt #1", "Date": "20-01-22" ,"Store_name": "Super-Pharm", "Total_amount": "200"},
                    {"Receipt_id": 2,"Receipt_name":"receipt #2", "Date": "27-01-22" ,"Store_name": "Shilav", "Total_amount": "164"},
                    {"Receipt_id": 3,"Receipt_name":"receipt #3", "Date": "01-05-22" ,"Store_name": "Apple Store", "Total_amount": "1500"},
                    {"Receipt_id": 4,"Receipt_name":"receipt #4", "Date": "01-09-23" ,"Store_name": "Zara", "Total_amount": "370$"})
#     user_details = request.form['user_name']
#     from_date = request.form['from_date']
#     to_date = request.form['to_date']
#
#     scan_receipt_repository = receiptRepository()
#     return scan_receipt_repository.get_by_date(user_details, from_date, to_date)
# #
# @app.route('/get_markets', methods=['GET'])
# def get_markets_receipt():
#     user_details = request.form['user_name']
#     receipt_repository = receiptRepository()
#     return receipt_repository.get_values_by_key(user_details, "market")@app.route('/get_markets', methods=['GET'])
#
#
# @app.route('/get_receipt_by_market', methods=['GET'])
# def get_receipt_by_market():
#     user_details = request.form['user_name']
#     market = request.form['market']
#     receipt_repository = receiptRepository()
#     return receipt_repository.get_receipt_by_value(user_details, "market", market)
#
@app.route('/get_receipt_by_name', methods=['GET'])
def get_receipt_by_name():
    args = request.args
    name = args.get('name')
    id = args.get('id')
    print(name)
    print(id)
    # print(request.get_json(force=True)["search"])
    # if (request.get_json(force=True)["search"]=='2'):
    #     print("here")
    return jsonify({"Receipt_id": 4,"Receipt_name":"receipt #4", "Date": "01-09-23" ,"Store_name": "Zara", "Total_amount": "370$"})
    # else:
    #     return jsonify({})
#     user_details = request.form['user_name']
#     name_search = request.form['name_search']
#     receipt_repository = receiptRepository()
#     return receipt_repository.get_receipt_by_name(user_details, name_search)
app.run(host='192.168.43.254' ,port=3000, debug=True)