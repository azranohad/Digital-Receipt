import glob
import cv2
from datetime import datetime
import uuid


from Features.ScanReceipt.scanReceiptManager import scanReceiptManager


def image_from_path(path):
    return cv2.imread(path)

types = ["*.jpg", "*.gif", "*.png"]

class demo_1():
    def __init__(self):
        self.scan_receipt_manager = scanReceiptManager()

    def scan_images_from_path(self, path, user_name):
        os.chdir(path)
        for type in types:
            for file in glob.glob("*.jpg"):
                path_image = path + '\\' + file
                image = image_from_path(path_image)
                generate_id = "UUID|" + uuid.uuid4().hex
                name_of_receipt = generate_id + " scan_receipt " + str(datetime.now().strftime('%d %b %Y %H %M'))
                print(self.scan_receipt_manager.action_scan_receipt_manager(image, user_name, name_of_receipt))


if __name__ == '__main__':
    import os
    current_path = os.getcwd()
    path = os.getcwd()[:current_path.find("Digital-Receipt") + 16] + "Tests\image_for_test"
    demo1 = demo_1()
    demo1.scan_images_from_path(path, "Ohad_Azran")