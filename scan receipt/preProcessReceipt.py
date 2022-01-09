import math

import cv2
import numpy as np
from scipy.ndimage import interpolation as inter
import matplotlib.pyplot as plt



class PreProcessReceipt:
    def __init__(self):
        self.kernel = np.ones((1, 1), np.uint8)
        self.fx = 1.2
        self.fy = 1.2

    @staticmethod
    def unwarp(img, src, dst):
        """
        Args:
            img: np.array
            src: list
            dst: list
        Returns:
            un_warped: np.array
        """
        h, w = img.shape[:2]
        H, _ = cv2.findHomography(src, dst, method=cv2.RANSAC, ransacReprojThreshold=3.0)
        #print('\nThe homography matrix is: \n', H)
        un_warped = cv2.warpPerspective(img, H, (w, h), flags=cv2.INTER_LINEAR)

        """
        f, (ax1, ax2) = plt.subplots(1, 2, figsize=(15, 8))
        # f.subplots_adjust(hspace=.2, wspace=.05)
        ax1.imshow(img)
        ax1.set_title('Original Image')

        x = [src[0][0], src[2][0], src[3][0], src[1][0], src[0][0]]
        y = [src[0][1], src[2][1], src[3][1], src[1][1], src[0][1]]

        ax2.imshow(img)
        ax2.plot(x, y, color='yellow', linewidth=3)
        ax2.set_ylim([h, 0])
        ax2.set_xlim([0, w])
        ax2.set_title('Target Area')

        plt.show()
        """
        return un_warped

    @staticmethod
    def detectReceiptEdges(preproc, image):
        gray = cv2.cvtColor(image, cv2.COLOR_RGB2GRAY)
        kernel = np.ones((5, 5), np.float32) / 15
        filtered = cv2.filter2D(gray, -1, kernel)
        thresh = cv2.threshold(filtered, 250, 255, cv2.THRESH_OTSU)[1]
        canvas = np.zeros(image.shape, np.uint8)
        contours, hierarchy = cv2.findContours(thresh, cv2.RETR_TREE, cv2.CHAIN_APPROX_NONE)
        cnt = sorted(contours, key=cv2.contourArea, reverse=True)[0]
        cv2.drawContours(canvas, cnt, -1, (0, 255, 255), 3)
        plt.title('Largest Contour')
        plt.imshow(canvas)
        plt.show()

        epsilon = 0.02 * cv2.arcLength(cnt, True)
        approx_corners = cv2.approxPolyDP(cnt, epsilon, True)
        cv2.drawContours(canvas, approx_corners, -1, (255, 255, 0), 10)
        approx_corners = sorted(np.concatenate(approx_corners).tolist())

        if approx_corners[0][1] > approx_corners[1][1]:
            temp = approx_corners[0]
            approx_corners[0] = approx_corners[1]
            approx_corners[1] = temp

        if approx_corners[2][1] > approx_corners[3][1]:
            temp = approx_corners[2]
            approx_corners[2] = approx_corners[3]
            approx_corners[3] = temp

        """
        print('\nThe corner points are ...\n')
        for index, c in enumerate(approx_corners):
            character = chr(65 + index)
            print(character, ':', c)
            cv2.putText(canvas, character, tuple(c), cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 0, 0), 2, cv2.LINE_AA)
        """
        # Rearranging the order of the corner points
        corners = [approx_corners[i] for i in [0, 2, 1, 3]]

        plt.imshow(canvas)
        plt.title('Corner Points: Douglas-Peucker')
        plt.show()
        w1 = np.sqrt((corners[0][0] - corners[1][0]) ** 2 + (corners[0][1] - corners[1][1]) ** 2)
        w2 = np.sqrt((corners[2][0] - corners[3][0]) ** 2 + (corners[2][1] - corners[3][1]) ** 2)
        w = max(int(w1), int(w2))

        h1 = np.sqrt((corners[0][0] - corners[2][0]) ** 2 + (corners[0][1] - corners[2][1]) ** 2)
        h2 = np.sqrt((corners[1][0] - corners[3][0]) ** 2 + (corners[1][1] - corners[3][1]) ** 2)
        h = max(int(h1), int(h2))

        #destination_corners = np.float32([(0, h - 1), (w - 1, h - 1),  (0, 0), (w - 1, 0)])
        destination_corners = np.float32([(0, 0), (w - 1, 0), (0, h - 1), (w - 1, h - 1)])
        un_warped = preproc.unwarp(image, np.float32(corners), destination_corners)
        cv2.imwrite('unwarp.jpg', un_warped)
        cropped = un_warped[0:h, 0:w]
        cv2.imwrite('crop.jpg', cropped)
        f, (ax1, ax2) = plt.subplots(1, 2, figsize=(15, 8))
        # f.subplots_adjust(hspace=.2, wspace=.05)
        #ax1.imshow(un_warped)
        ax2.imshow(cropped)

        plt.show()
        return cropped

    def gussianBlurProcess(self, img, size):
        img = self.detectReceiptEdges(self, img)
        #cv2.imwrite("Result.jpg", dst)
        img = cv2.resize(img, None, fx=self.fx, fy=self.fy, interpolation=cv2.INTER_CUBIC)
        img = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        img = cv2.dilate(img, self.kernel, iterations=1)
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