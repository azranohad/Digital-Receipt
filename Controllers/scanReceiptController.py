import uuid
from datetime import datetime

import cv2
from flask import Flask, request
from Features.Scan_receipt.scanReceiptManager import scanReceiptManager
app = Flask(__name__)

@app.route('/scan_receipt', methods=['POST'])
def scan_receipt():
    imagefile = request.files['image']
    path_image = 'test_image.jpg'
    imagefile.save(path_image)
    image = cv2.imread(path_image)

    user_details = request.form['user_name']
    scan_receipt_manager = scanReceiptManager(user_details)

    generate_id ="UUID|" + uuid.uuid4().hex
    name_of_receipt = generate_id + " scan_receipt " + str(datetime.now().strftime('%d %b %Y %H %M'))
    response = scan_receipt_manager.action_scan_receipt_manager(image, user_details, name_of_receipt)
    return response


app.run()