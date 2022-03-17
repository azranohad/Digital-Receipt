from bson.binary import Binary

from DataObjects.receiptData import receiptData
from Repositories.mongoDbRepository import mongoDbRepository
from Services.parseReceiptDataService import parseReceiptDataService
from Services.preProcessReceiptService import preProcessReceiptService
from Services.scanImageService import scanImageService


class scanReceiptManager():
    def __init__(self, user_details):
        self.receipt_data = receiptData()
        self.pre_processing_image = preProcessReceiptService()
        self.scan_image_service = scanImageService()
        self.parse_receipt_data_service = parseReceiptDataService()
        self.user_details = user_details
        self.mongoDb_repository = mongoDbRepository()

    #call from controller
    def action_scan_receipt_manager(self, image, user_details, name_of_receipt):
        process_image = self.pre_processing_image.gussianBlurProcess(image)  #pre processing image
        raw_string_receipt = self.scan_image_service.scan_image_to_string(process_image).lower()
        raw_data_receipt = self.scan_image_service.scan_image_to_data(process_image)

        self.parse_data_from_receipt_image(raw_string_receipt, raw_data_receipt)

        self.insert_receipt_data_to_db(user_details, name_of_receipt)
        return self.receipt_to_dict(name_of_receipt)


    def parse_data_from_receipt_image(self, raw_string_receipt, raw_data_receipt):
        lines = raw_string_receipt.splitlines()
        self.receipt_data.date = self.parse_receipt_data_service.parse_date(raw_string_receipt)
        self.receipt_data.market = self.parse_receipt_data_service.parse_market(lines)
        self.receipt_data.receiptID = self.parse_receipt_data_service.parse_receipt_id(lines)
        self.receipt_data.itemsList, self.receipt_data.total_price = self.parse_receipt_data_service.parse_items(raw_data_receipt)

    def receipt_to_dict(self, name_of_receipt):
        receipt_dict = {
            "_id": str(name_of_receipt),
            "receiptID": str(self.receipt_data.receiptID),
            "date": str(self.receipt_data.date),
            "market": str(self.receipt_data.market),
            "items": str(self.receipt_data.itemsList),
            "total price": str(self.receipt_data.total_price),
        }
        return receipt_dict



    def insert_receipt_data_to_db(self, user_id, name_of_receipt):
        db = self.mongoDb_repository.get_client()[user_id]
        collection = db["scan_receipt"]
        collection.insert_one(self.receipt_to_dict(name_of_receipt))

