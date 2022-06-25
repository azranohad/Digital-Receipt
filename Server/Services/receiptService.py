import os.path

from Server.Repositories.fireBaseRepository import fireBaseRepository
from Server.Repositories.receiptRepository import receiptRepository
from Server.Repositories.serverLocalRepository import serverLocalRepository
from Server.Repositories.userRepository import userRepository
from Server.Services.generalService import generalService
from Server.Services.userService import userService
import uuid
#from barcode import EAN13
#from barcode.writer import ImageWriter
from tempfile import NamedTemporaryFile
from shutil import copyfileobj
from flask import send_file


# @singleton
from systemFiles.logger.loggerService import loggerService


class receiptService:
    def __init__(self):
        self.receipt_repository = receiptRepository()
        self.user_repository = userRepository()
        self.local_repository = serverLocalRepository()
        self.user_service = userService()
        self.logger = loggerService()
        self.fire_base_repository = fireBaseRepository()
        self.general_service = generalService()


    def insert_receipt(self, phone_number, receipt_data_dict):
        if not self.user_repository.is_user_exist('phone_number', phone_number):
            user_key = self.user_service.create_user(phone_number, {})
        else:
            user_key = self.user_repository.get_user_from_db({"phone_number": phone_number})
        receipt_data_dict['user_key'] = user_key
        receipt_data_dict["_id"] = uuid.uuid4().hex
        return self.receipt_repository.insert_receipt(user_key, receipt_data_dict)

    def delete_receipt(self, user_key, _id):
        is_digital_receipt = self.receipt_repository.get_receipt_by_value(user_key, '_id', _id)['is_digital_receipt']
        if is_digital_receipt:
            return self.receipt_repository.delete_receipt(user_key, _id)
        if not self.local_repository.delete_scan_image(user_key, _id):
            self.logger.print_severe_message("receiptService | delete scan receipt from local DB Failed. user key: " + user_key)
        if not self.receipt_repository.delete_receipt(user_key, _id):
            self.logger.print_severe_message("receiptService | delete scan receipt  data from DB Failed. user key: " + user_key)
        self.logger.print_severe_message(
            "receiptService | delete scan receipt from DB Success. user key: " + user_key)
        return True


    def get_barcode(self, receipt_id):
        barcode_image = EAN13(receipt_id, writer=ImageWriter())
        temp_barcode_name = uuid.uuid4().hex
        path_temp_barcode = barcode_image.save('temp_image_barcode')

        url_image = self.fire_base_repository.push_temp_image(temp_barcode_name, path_temp_barcode)

        os.remove(path_temp_barcode)

        return url_image

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
