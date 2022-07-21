
import os
import re

from systemFiles.logger.loggerService import loggerService


class generalService:
    def __init__(self):
        self.logger = loggerService()

    def get_project_folder(self):
        return re.split(r'.(?=Digital-Receipt)', os.getcwd())[0]

