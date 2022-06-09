from Server.DataObjects.receiptDataObject import creditData
from Server.Repositories.creditRepository import creditRepository
from Server.Repositories.mongoDbRepository import mongoDbRepository
import dateutil
from dateutil.parser import parse
from Server.Repositories.serverLocalRepository import serverLocalRepository
from Server.Services.parseReceiptDataService import parseReceiptDataService
from Server.Services.preProcessReceiptService import preProcessReceiptService
from Server.Services.scanImageService import scanImageService
from datetime import datetime as datatime
from singleton_decorator import singleton
import uuid
import cv2


def credit_data_to_db(user_key, credit_name, image_id, credit_data_object):
    credit_dict = {
        "_id": str(image_id),
        "user_key": user_key,
        "scan_date": dateutil.parser.parse(datatime.now().strftime('%d/%m/%Y')),
        "name_for_client": str(credit_name),
        "creditID": str(credit_data_object.creditID),
        "date_of_credit": dateutil.parser.parse(credit_data_object.date_of_credit),
        "expiration_date": dateutil.parser.parse(credit_data_object.expiration_date),
        "market": str(credit_data_object.market),
        "is_digital_credit": False
    }
    return credit_dict


def credit_data_to_app(credit_id, credit_data_object, credit_name):
    credit_dict = {
        "_id": str(credit_id),
        "expiration_date": dateutil.parser.parse(credit_data_object.expiration_date),
        "market": str(credit_data_object.market),
        "name_for_client": str(credit_name)
    }
    return credit_dict


# @singleton
class scanCreditManager:
    def __init__(self):
        self.pre_processing_image = preProcessReceiptService()
        self.scan_image_service = scanImageService()
        self.parse_receipt_data_service = parseReceiptDataService()
        self.mongoDb_repository = mongoDbRepository()
        self.server_local_repository = serverLocalRepository()
        self.credit_repository = creditRepository()

    #call from controller
    def action_scan_credit_manager(self, image_file, user_key, credit_name, expiration_date):

        #save credit in local server
        image_id = uuid.uuid4().hex + '.jpg'
        path_image = self.server_local_repository.save_scan_image(image_file, image_id, user_key)


        image = cv2.imread(path_image)
        credit_data_object = creditData()
        credit_data_object.expiration_date = expiration_date
        process_image = self.pre_processing_image.gussianBlurProcess(image)  #pre processing image
        raw_string_credit = self.scan_image_service.scan_image_to_string(process_image).lower()

        self.parse_data_from_credit_image(raw_string_credit, credit_data_object)
        self.credit_repository.insert_credit(user_key, credit_data_to_db(user_key, credit_name, image_id, credit_data_object))
        return credit_data_to_app(image_id, credit_data_object, credit_name)


    def parse_data_from_credit_image(self, raw_string_credit, credit_data_object):
        lines = raw_string_credit.splitlines()
        credit_data_object.date_of_credit = self.parse_receipt_data_service.parse_date(raw_string_credit)
        credit_data_object.market = self.parse_receipt_data_service.parse_market(lines)
        credit_data_object.creditID = self.parse_receipt_data_service.parse_receipt_id(lines)

