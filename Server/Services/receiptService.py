from Server.Repositories.receiptRepository import receiptRepository
from Server.Repositories.userRepository import userRepository
from Server.Services.userService import userService
from SystemFiles.logger.loggerService import loggerService
import uuid

# @singleton
class receiptService:
    def __init__(self):
        self.receipt_repository = receiptRepository()
        self.user_repository = userRepository()
        self.user_service = userService()
        self.logger = loggerService()


    def insert_receipt(self, phone_number, receipt_data_dict):
        if not self.user_repository.is_user_exist('phone_number', phone_number):
            user_key = self.user_service.create_user(phone_number, {})
        else:
            user_key = self.user_repository.get_user_from_db({"phone_number": phone_number})
        receipt_data_dict['user_key'] = user_key
        receipt_data_dict["_id"] = uuid.uuid4().hex
        return self.receipt_repository.insert_receipt(user_key, receipt_data_dict)
