from Server.Repositories.mongoDbRepository import mongoDbRepository
from Server.serverConsts import serverConsts
from systemFiles.logger.loggerService import loggerService

server_consts = serverConsts()

# @singleton
class storeRepository:
    def __init__(self):
        self.mongoDb_repository = mongoDbRepository()
        self.logger = loggerService()


    def get_collection(self):
        return self.mongoDb_repository.get_client()[server_consts.ITEMS_DB][server_consts.ITEMS_COLLECTION]

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

    def get_items_by_generic_value(self, field, value):
        users_collection = self.get_collection()
        cursor = users_collection.find({field: {"$regex": value}})
        items_list = []
        for record in cursor:
            items_list.append(record)
        return items_list

    def get_item_data_by_itemID(self, itemID):
        items_collection = self.get_collection()
        return items_collection.find_one({server_consts.ITEM_ID:{"$regex" : itemID}})


    def update_item_data(self, itemID, dict_update_item):
        result = self.get_collection().update({server_consts.ITEM_ID: itemID}, {'$set': dict_update_item})
        if result['updatedExisting']:
            self.logger.print_info_message(
                "storeRepository | details (" + str(dict_update_item.keys()) + ") of item: " + str(
                    itemID) + " updated in data base")
        else:
            self.logger.print_severe_message(
                "storeRepository | failed update data of item: " + itemID)

    def delete_item(self, itemID):
        result = self.get_collection().delete_one({server_consts.ITEM_ID: itemID})
        status = result.acknowledged
        if status:
            self.logger.print_event("storeRepository | item: " + itemID + " deleted from data base")
        else:
            self.logger.print_severe_message("storeRepository | delete item from Data Base Failed.")
        return str(status)

# repo = storeRepository()
# items = repo.get_items_by_generic_value(server_consts.MARKET, 'walmart')
# for item in items:
#     repo.delete_item(item)
#
# x = 3