try:
    from PIL import Image
except ImportError:
    import Image
import pytesseract



pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'
custom_config = r'-l eng --oem 3 --psm 6'

class scanImageService():

    def scan_image_to_string(self, image):
        return pytesseract.image_to_string(image, config=custom_config)

    def scan_image_to_data(self, image):
        return pytesseract.image_to_data(image, config=custom_config)

