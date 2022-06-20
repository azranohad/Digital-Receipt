import os.path

from Server.Repositories.receiptRepository import receiptRepository
from Server.Repositories.userRepository import userRepository
from Server.Services.generalService import generalService
from Server.Services.userService import userService
from SystemFiles.logger.loggerService import loggerService
import uuid
from barcode import EAN13
from barcode.writer import ImageWriter
from tempfile import NamedTemporaryFile
from shutil import copyfileobj
from flask import send_file


# @singleton
class receiptService:
    def __init__(self):
        self.receipt_repository = receiptRepository()
        self.user_repository = userRepository()
        self.user_service = userService()
        self.logger = loggerService()
        self.general_service = generalService()


    def insert_receipt(self, phone_number, receipt_data_dict):
        if not self.user_repository.is_user_exist('phone_number', phone_number):
            user_key = self.user_service.create_user(phone_number, {})
        else:
            user_key = self.user_repository.get_user_from_db({"phone_number": phone_number})
        receipt_data_dict['user_key'] = user_key
        receipt_data_dict["_id"] = uuid.uuid4().hex
        return self.receipt_repository.insert_receipt(user_key, receipt_data_dict)


    def get_barcode(self, receipt_id):
        barcode_image = EAN13(receipt_id, writer=ImageWriter())
        temp_barcode_name = uuid.uuid4().hex
        path_folder = os.path.join(self.general_service.get_project_folder(), 'Digital-Receipt', 'DB', 'temp', temp_barcode_name)
        path_temp_barcode = barcode_image.save(path_folder)

        tempFileObj = NamedTemporaryFile(mode='w+b', suffix='.png')
        pilImage = open(path_temp_barcode, 'rb')
        copyfileobj(pilImage, tempFileObj)
        pilImage.close()
        tempFileObj.seek(0, 0)
        response = send_file(tempFileObj, as_attachment=True, attachment_filename=tempFileObj.name)
        os.remove(path_temp_barcode)
        return response

    def get_logo(self, store_name):
        logo_name = store_name + '.png'
        path = os.path.join(self.general_service.get_project_folder(), 'Digital-Receipt', 'DB', 'logo', logo_name)

        tempFileObj = NamedTemporaryFile(mode='w+b', suffix='.png')
        pilImage = open(path, 'rb')
        copyfileobj(pilImage, tempFileObj)
        pilImage.close()
        tempFileObj.seek(0, 0)
        response = send_file(tempFileObj, as_attachment=True, attachment_filename=tempFileObj.name)
        return response
