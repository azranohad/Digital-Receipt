import cv2
import receiptData
import preProcessReceipt
import receipt_parser_core as rp
try:
    from PIL import Image
except ImportError:
    import Image
import pytesseract


pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'
custom_config = r'-l eng --oem 3 --psm 6'
# print(pytesseract.image_to_string(Image.open('rec.jpeg')))

preprocess = preProcessReceipt.PreProcessReceipt()
image = preprocess.gussianBlurProcess(cv2.imread(r'C:\Users\azran\PycharmProjects\Data Base Digital Receipt\DataBaseReceiptImages\0325updated.task2train(626p)\X00016469612.jpg'), 5)
rec_train = pytesseract.image_to_string(image, config=custom_config)

config_file = rp.read_config(r'C:\Users\azran\PycharmProjects\Digital-Receipt\config.yml')
receipt_lines = rec_train.splitlines()
receipt = receiptData.ReceiptData(config_file, receipt_lines)
receipt.parse_date()

print(rec_train)
# rd.create_receipt_data_from_text(rec_train)
# lines = rec_train.splitlines()
x = 3