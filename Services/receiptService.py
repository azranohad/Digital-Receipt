from Repositories.receiptRepository import receiptRepository
from SystemFiles.logger.loggerService import loggerService

# @singleton
class receiptService:
    def __init__(self):
        self.receipt_repository = receiptRepository()
        self.logger = loggerService()

