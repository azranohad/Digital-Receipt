from Server.Repositories.mongoDbRepository import mongoDbRepository
from SystemFiles.logger.loggerService import loggerService


# @singleton
class storeRepository:
    def __init__(self):
        self.mongoDb_repository = mongoDbRepository()
        self.logger = loggerService()


    def get_collection(self):
        return self.mongoDb_repository.get_client()["Items"]["items"]

    #item data is dictionary
    def insert_item_to_db(self, item_data):
        collection = self.get_collection()
        result = collection.insert_one(item_data)
        status = result.acknowledged
        if status:
            self.logger.print_info_message("storeRepository | insert new item")
        else:
            self.logger.print_severe_message("storeRepository | failed insert new item")
        return str(status)
