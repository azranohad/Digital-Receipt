from Server.DataObjects.receiptDataObject import receiptData
from Server.Repositories.fireBaseRepository import fireBaseRepository, typeImage
from Server.Repositories.mongoDbRepository import mongoDbRepository
from Server.Repositories.receiptRepository import receiptRepository
from Server.Repositories.serverLocalRepository import serverLocalRepository
from Server.Services.parseReceiptDataService import parseReceiptDataService
from Server.Services.preProcessReceiptService import preProcessReceiptService
from Server.Services.scanImageService import scanImageService
from singleton_decorator import singleton
from Server.serverConsts import serverConsts

import uuid
import cv2





@singleton
class scanReceiptManager:
    def __init__(self):
        self.pre_processing_image = preProcessReceiptService()
        self.scan_image_service = scanImageService()
        self.parse_receipt_data_service = parseReceiptDataService()
        self.mongoDb_repository = mongoDbRepository()
        self.server_local_repository = serverLocalRepository()
        self.fire_base_repository = fireBaseRepository()
        self.receipt_repository = receiptRepository()

    #call from controller
    def action_scan_receipt_manager(self, image_file, user_key):

        #save receipt in local server
        image_key = uuid.uuid4().hex + serverConsts.JPG
        path_image = self.server_local_repository.save_scan_image(image_file, image_key, user_key)
        url_image = self.fire_base_repository.push_image(user_key, typeImage.RECEIPT, image_key, path_image)

        image = cv2.imread(path_image)
        receipt_data_object = receiptData()
        receipt_data_object.url_scan_image = url_image

        process_image = self.pre_processing_image.gussianBlurProcess(image)  #pre processing image
        raw_string_receipt = self.scan_image_service.scan_image_to_string(process_image).lower()
        raw_data_receipt = self.scan_image_service.scan_image_to_data(process_image)

        self.parse_data_from_receipt_image(raw_string_receipt, raw_data_receipt, receipt_data_object)
        self.receipt_repository.insert_receipt(user_key, self.parse_receipt_data_service.receipt_data_to_db(user_key, image_key, receipt_data_object))
        self.server_local_repository.delete_scan_image(user_key, image_key)
        return self.parse_receipt_data_service.receipt_data_to_app(image_key, receipt_data_object)


    def parse_data_from_receipt_image(self, raw_string_receipt, raw_data_receipt, receipt_data_object):
        lines = raw_string_receipt.splitlines()
        receipt_data_object.date_of_receipt = self.parse_receipt_data_service.parse_date(raw_string_receipt)
        receipt_data_object.market = self.parse_receipt_data_service.parse_market(lines)
        receipt_data_object.receiptID = self.parse_receipt_data_service.parse_receipt_id(lines)
        receipt_data_object.items, receipt_data_object.total_price = self.parse_receipt_data_service.parse_items(raw_data_receipt, receipt_data_object.market)


