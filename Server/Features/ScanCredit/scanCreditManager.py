import uuid
from datetime import datetime as datatime

import cv2
import dateutil
from dateutil.parser import parse

from Server.DataObjects.receiptDataObject import creditData
from Server.Repositories.creditRepository import creditRepository
from Server.Repositories.fireBaseRepository import fireBaseRepository, typeImage
from Server.Repositories.mongoDbRepository import mongoDbRepository
from Server.Repositories.serverLocalRepository import serverLocalRepository
from Server.Services.parseReceiptDataService import parseReceiptDataService
from Server.Services.preProcessReceiptService import preProcessReceiptService
from Server.Services.scanImageService import scanImageService
from Server.serverConsts import serverConsts

server_consts = serverConsts()

def credit_data_to_db(user_key, credit_name, image_id, credit_data_object):
    credit_dict = {
        server_consts._ID: str(image_id),
        server_consts.USER_KEY: user_key,
        server_consts.SCAN_DATE: dateutil.parser.parse(datatime.now().strftime('%d/%m/%Y')),
        server_consts.NAME_FOR_CLIENT: str(credit_name),
        server_consts.IS_DIGITAL_RECEIPT: False
    }

    try:
        if credit_data_object.creditID is not None:
            credit_dict[server_consts.CREDIT_ID] = str(credit_data_object.creditID)
        if credit_data_object.date_of_credit is not None:
            credit_dict[server_consts.DATE_OF_CREDIT] = dateutil.parser.parse(credit_data_object.date_of_credit)
        if credit_data_object.expiration_date is not None:
            credit_dict[server_consts.EXPIRATION_DATE] = dateutil.parser.parse(credit_data_object.expiration_date)
        if credit_data_object.market is not None:
            credit_dict[server_consts.MARKET] = str(credit_data_object.market)
    except:
        return {}
    return credit_dict


def credit_data_to_app(credit_id, credit_data_object, credit_name):
    credit_dict = {
        server_consts._ID: str(credit_id),
        server_consts.EXPIRATION_DATE: dateutil.parser.parse(credit_data_object.expiration_date),
        server_consts.MARKET: str(credit_data_object.market),
        server_consts.NAME_FOR_CLIENT: str(credit_name)
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
        self.fire_base_repository = fireBaseRepository()


    #call from controller
    def action_scan_credit_manager(self, image_file, user_key, credit_name, expiration_date):

        #save credit in local server
        image_key = uuid.uuid4().hex + '.jpg'
        path_image = self.server_local_repository.save_scan_image(image_file, image_key, user_key)
        url_image = self.fire_base_repository.push_image(user_key, typeImage.CREDIT, image_key, path_image)


        image = cv2.imread(path_image)
        credit_data_object = creditData()
        credit_data_object.expiration_date = expiration_date
        credit_data_object.url_scan_image = url_image

        process_image = self.pre_processing_image.gussianBlurProcess(image)  #pre processing image
        raw_string_credit = self.scan_image_service.scan_image_to_string(process_image).lower()

        self.parse_data_from_credit_image(raw_string_credit, credit_data_object)
        self.credit_repository.insert_credit(user_key, credit_data_to_db(user_key, credit_name, image_key, credit_data_object))
        self.server_local_repository.delete_scan_image(user_key, image_key)
        return credit_data_to_app(image_key, credit_data_object, credit_name)


    def parse_data_from_credit_image(self, raw_string_credit, credit_data_object):
        lines = raw_string_credit.splitlines()
        credit_data_object.date_of_credit = self.parse_receipt_data_service.parse_date(raw_string_credit)
        credit_data_object.market = self.parse_receipt_data_service.parse_market(lines)
        credit_data_object.creditID = self.parse_receipt_data_service.parse_receipt_id(lines)

