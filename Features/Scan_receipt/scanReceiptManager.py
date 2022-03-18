from DataObjects.receiptData import receiptData
from Repositories.mongoDbRepository import mongoDbRepository
from Services.parseReceiptDataService import parseReceiptDataService
from Services.preProcessReceiptService import preProcessReceiptService
from Services.scanImageService import scanImageService
from singleton_decorator import singleton

@singleton
class scanReceiptManager:
    def __init__(self):
        self.pre_processing_image = preProcessReceiptService()
        self.scan_image_service = scanImageService()
        self.parse_receipt_data_service = parseReceiptDataService()
        self.mongoDb_repository = mongoDbRepository()

    #call from controller
    def action_scan_receipt_manager(self, image, user_details, name_of_receipt):
        receipt_data_object = receiptData()
        process_image = self.pre_processing_image.gussianBlurProcess(image)  #pre processing image
        raw_string_receipt = self.scan_image_service.scan_image_to_string(process_image).lower()
        raw_data_receipt = self.scan_image_service.scan_image_to_data(process_image)

        self.parse_data_from_receipt_image(raw_string_receipt, raw_data_receipt, receipt_data_object)

        self.insert_receipt_data_to_db(user_details, name_of_receipt, receipt_data_object)
        return self.receipt_data_to_app(name_of_receipt, receipt_data_object)


    def parse_data_from_receipt_image(self, raw_string_receipt, raw_data_receipt, receipt_data_object):
        lines = raw_string_receipt.splitlines()
        receipt_data_object.date = self.parse_receipt_data_service.parse_date(raw_string_receipt)
        receipt_data_object.market = self.parse_receipt_data_service.parse_market(lines)
        receipt_data_object.receiptID = self.parse_receipt_data_service.parse_receipt_id(lines)
        receipt_data_object.itemsList, receipt_data_object.total_price = self.parse_receipt_data_service.parse_items(raw_data_receipt)

    def receipt_data_to_db(self, name_of_receipt, receipt_data_object):
        receipt_dict = {
            "_id": str(name_of_receipt),
            "receiptID": str(receipt_data_object.receiptID),
            "date": str(receipt_data_object.date),
            "market": str(receipt_data_object.market),
            "items": str(receipt_data_object.itemsList),
            "total price": str(receipt_data_object.total_price),
        }
        return receipt_dict

    def receipt_data_to_app(self, name_of_receipt, receipt_data_object):
        receipt_dict = {
            "_id": str(name_of_receipt),
            "date": str(receipt_data_object.date),
            "market": str(receipt_data_object.market),
        }
        return receipt_dict



    def insert_receipt_data_to_db(self, user_id, name_of_receipt, receipt_data_object):
        db = self.mongoDb_repository.get_client()[user_id]
        collection = db["scan_receipt"]
        collection.insert_one(self.receipt_data_to_db(name_of_receipt, receipt_data_object))

