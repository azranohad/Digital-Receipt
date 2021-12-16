import cv2
import numpy as np


class PreProcessReceipt:
    def __init__(self):
        self.kernel = np.ones((1, 1), np.uint8)
        self.fx = 1.2
        self.fy = 1.2

    def gussianBlurProcess(self, img, size):
        img = cv2.resize(img, None, fx=self.fx, fy=self.fy, interpolation=cv2.INTER_CUBIC)
        img = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        img = cv2.dilate(img,self.kernel, iterations=1)
        img = cv2.erode(img, self.kernel, iterations=1)
        img = cv2.GaussianBlur(img, (5, 5), 0)
        return img

    def bilateralFilterProcess(self, img):
        img = cv2.resize(img, None, fx=self.fx, fy=self.fy, interpolation=cv2.INTER_CUBIC)
        img = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        img = cv2.dilate(img,self.kernel, iterations=1)
        img = cv2.erode(img, self.kernel, iterations=1)
        img = cv2.bilateralFilter(img, 5, 75, 75)
        img = cv2.threshold(img, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)[1]
        return img