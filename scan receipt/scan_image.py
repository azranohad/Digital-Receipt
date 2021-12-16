import cv2

import receiptData
import preProcessReceipt
try:
    from PIL import Image
except ImportError:
    import Image
import pytesseract

pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'
custom_config = r'-l eng --oem 3 --psm 6'
# print(pytesseract.image_to_string(Image.open('rec.jpeg')))

preprocess = preProcessReceipt.PreProcessReceipt()
rd = receiptData.ReceiptData

image = preprocess.gussianBlurProcess(cv2.imread('train.png'), 5)
rec_train = pytesseract.image_to_string(image, config=custom_config)
print(rec_train)
rd.create_receipt_data_from_text(rec_train)
lines = rec_train.splitlines()
x = 3