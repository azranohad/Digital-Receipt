import os
import re
from shutil import copyfileobj
from tempfile import NamedTemporaryFile

from flask import send_file
from singleton_decorator import singleton

from systemFiles.logger.loggerService import loggerService


@singleton
class serverLocalRepository:

    def __init__(self):
        self.logger = loggerService()

    def get_user_folder_scans(self, user_details):
        project_folder = re.split(r'.(?=Digital-Receipt)', os.getcwd())[0]
        base_path = os.path.join(project_folder, 'Digital-Receipt', 'DB', 'scanStorage')
        path = os.path.join(base_path, user_details)

        if os.path.exists(path):
            self.logger.print_event("serverLocalRepository | User directory '% s' scan receipt folder is exist" % user_details)
        else:
            os.mkdir(path, 0o666)
            self.logger.print_event("serverLocalRepository | User directory '% s' scan receipt folder created" % user_details)
        return path

    def save_scan_image(self, image_file, image_name, user_details):
        path_image = os.path.join(self.get_user_folder_scans(user_details), image_name)
        image_file.save(path_image)

        return path_image

    def get_image(self, user_details, image_name):
        path_image = os.path.join(self.get_user_folder_scans(user_details), image_name)
        tempFileObj = NamedTemporaryFile(mode='w+b', suffix='jpg')
        pilImage = open(path_image, 'rb')
        copyfileobj(pilImage, tempFileObj)
        pilImage.close()
        tempFileObj.seek(0, 0)
        response = send_file(tempFileObj, as_attachment=True, attachment_filename=image_name)
        return response

