import glob
import os
import cv2

from Controllers.scanReceiptController import scanReceiptController


def image_from_path(path):
    return cv2.imread(path)

types = ["*.jpg", "*.gif", "*.png"]

class demo_1():
    def __init__(self):
        self.scan_receipt_controller = scanReceiptController()

    def scan_images_from_path(self, path):
        os.chdir(path)
        for type in types:
            for file in glob.glob("*.jpg"):
                path_image = path + '\\' + file
                image = image_from_path(path_image)
                print(self.scan_receipt_controller.scan_receipt(image, "ohad"))


if __name__ == '__main__':
    path = r"C:\Users\azran\PycharmProjects\Digital-Receipt\Tests\image_for_test"
    demo1 = demo_1()
    demo1.scan_images_from_path(path)