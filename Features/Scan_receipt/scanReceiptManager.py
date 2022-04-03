from DataObjects.receiptDataObject import receiptData
from Repositories.mongoDbRepository import mongoDbRepository
from Repositories.receiptRepository import receiptRepository
from Repositories.serverLocalRepository import serverLocalRepository
from Services.parseReceiptDataService import parseReceiptDataService
from Services.preProcessReceiptService import preProcessReceiptService
from Services.scanImageService import scanImageService
from singleton_decorator import singleton
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

        #to delete
        self.scan_receipt_repository = receiptRepository()

    #call from controller
    def action_scan_receipt_manager(self, image_file, user_details, name_of_receipt):
        # generate_id = "UUID|" + uuid.uuid4().hex
        # id_of_receipt = generate_id + "|scan_receipt|" + str(datetime.now().strftime('%d %b %Y %H %M'))

        #save receipt in local server
        image_name = uuid.uuid4().hex + '.jpg'
        path_image = self.server_local_repository.save_receipt_image(image_file, image_name, user_details)


        image = cv2.imread(path_image)
        receipt_data_object = receiptData()
        process_image = self.pre_processing_image.gussianBlurProcess(image)  #pre processing image
        raw_string_receipt = self.scan_image_service.scan_image_to_string(process_image).lower()
        raw_data_receipt = self.scan_image_service.scan_image_to_data(process_image)

        self.parse_data_from_receipt_image(raw_string_receipt, raw_data_receipt, receipt_data_object)

        self.insert_receipt_data_to_db(user_details, image_name, name_of_receipt, receipt_data_object)
        return self.parse_receipt_data_service.receipt_data_to_app(name_of_receipt, receipt_data_object)


    def parse_data_from_receipt_image(self, raw_string_receipt, raw_data_receipt, receipt_data_object):
        lines = raw_string_receipt.splitlines()
        receipt_data_object.date = self.parse_receipt_data_service.parse_date(raw_string_receipt)
        receipt_data_object.market = self.parse_receipt_data_service.parse_market(lines)
        receipt_data_object.receiptID = self.parse_receipt_data_service.parse_receipt_id(lines)
        receipt_data_object.itemsList, receipt_data_object.total_price = self.parse_receipt_data_service.parse_items(raw_data_receipt, receipt_data_object.market)

    def insert_receipt_data_to_db(self, user_details, path_image, name_of_receipt, receipt_data_object):
        db = self.mongoDb_repository.get_client()[user_details]
        collection = db["scan_receipt"]
        collection.insert_one(self.parse_receipt_data_service.receipt_data_to_db(name_of_receipt, path_image, receipt_data_object))

