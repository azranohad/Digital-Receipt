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

    def get_itemsID_by_generic_value(self, field, value):
        users_collection = self.get_collection()
        cursor = users_collection.find({field: value})
        items_list = []
        for record in cursor:
            items_list.append(record['itemID'])
        return items_list

    def get_item_data_by_itemID(self, itemID):
        items_collection = self.get_collection()
        return items_collection.find_one({'itemID':{"$regex" : itemID}})


    # def get_item_data_by_itemID(self, user_key, name_search):
    #     list_of_names = self.get_values_by_key(user_key, "name_for_client")
    #     receipt_list = {}
    #     for name in list_of_names.values():
    #         if name.__contains__(name_search):
    #             #add all receipt that contains this name
    #             receipt_list.update(self.get_receipt_by_value(user_key, "name_for_client", name))
    #     return receipt_list

    def delete_item(self, itemID):
        result = self.get_collection().delete_one({'itemID': itemID})
        status = result.acknowledged
        if status:
            self.logger.print_event("storeRepository | item: " + itemID + " deleted from data base")
        else:
            self.logger.print_severe_message("storeRepository | delete item from Data Base Failed.")
        return str(status)

# repo = storeRepository()
# items = repo.get_items_by_generic_value('market', 'walmart')
# for item in items:
#     repo.delete_item(item)
#
# x = 3