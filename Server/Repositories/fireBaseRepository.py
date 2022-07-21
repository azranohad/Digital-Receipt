import os

import pyrebase
from enum import Enum

from Server.Services.generalService import generalService
from systemFiles.logger.loggerService import loggerService


class typeImage(Enum):
    RECEIPT = "receipt"
    CREDIT = "credit"


CONFIG = {
    "apiKey": "AIzaSyCB7obuRB0zMOF1D8e8vJK9SrOn0AtYySs",
    "authDomain": "invertible-fin-335322.firebaseapp.com",
    "databaseURL": "https://invertible-fin-335322-default-rtdb.firebaseio.com",
    "projectId": "invertible-fin-335322",
    "storageBucket": "invertible-fin-335322.appspot.com",
    "serviceAccount": "serviceAccountKey.json"
}


FIREBASE_SERVICE_ACCOUNT_KEY_PATH="/service-account-key.json"

class fireBaseRepository:
    def __init__(self):
        self.general_service = generalService()
        self.get_json_config_absolute_path()
        self.client = pyrebase.initialize_app(CONFIG)
        self.logger = loggerService()

    def get_json_config_absolute_path(self):
        project_path = self.general_service.get_project_folder()
        base_path = os.path.join(project_path, 'Digital-Receipt', 'Server', 'Repositories', "serviceAccountKey.json")
        CONFIG["serviceAccount"] = base_path
        return True


    def get_storage(self):
        return self.client.storage()

    # return url
    def push_image(self, user_key, type, file_name, file_path):
        self.logger.print_info_message(
            "receiptRepository | push new scan " + type.value + " to user: " + str(user_key))
        path_details = [user_key, type.value, file_name]
        storage_path = "/".join(path_details)
        self.get_storage().child(storage_path).put(file_path)
        return self.get_storage().child(storage_path).get_url("image")

    # return url
    def push_temp_image(self, file_name, file_path):
        self.logger.print_info_message(
            "receiptRepository | push temp image")
        temp_path = ["temp", file_name]
        storage_path = "/".join(temp_path)

        self.get_storage().child(storage_path).put(file_path)
        return self.get_storage().child(storage_path).get_url("image")


    def delete_image(self, path_image_in_firebase):
        self.get_storage().bucket.blob(path_image_in_firebase).delete()




#
# fbRepository = fireBaseRepository()
# url = fbRepository.push_image("b661e90ea0fe4cb5bb6c53b68ad5d555", typeImage.RECEIPT,
#                               "3f464c6dd5c44be4a191fc0daeaa1d2d.jpg", "C:\\Users\\azran\\PycharmProjects\\Digital-Receipt\\DB\\scanStorage\\b661e90ea0fe4cb5bb6c53b68ad5d555\\bad7f857b56849fb9e8797cfbc1d0695.jpg")
# x = 3
