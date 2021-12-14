import cv2
try:
    from PIL import Image
except ImportError:
    import Image
import pytesseract

pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'
# print(pytesseract.image_to_string(Image.open('rec.jpeg')))
rec_train = pytesseract.image_to_string(Image.open('train.png'))
lan = pytesseract.get_languages(config='')

lines = rec_train.splitlines()
x = 3