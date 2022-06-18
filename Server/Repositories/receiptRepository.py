from Server.Repositories.mongoDbRepository import mongoDbRepository
from datetime import datetime

# @singleton
from SystemFiles.logger.loggerService import loggerService


class receiptRepository:
    def __init__(self):
        self.mongoDb_repository = mongoDbRepository()
        self.logger = loggerService()

    def get_collection(self):
        return self.mongoDb_repository.get_client()["Receipts"]['receipts']

    def get_most_common_store_for_user(self, user_key, number_of_stores=2):

        cursor = self.get_collection().aggregate([
            {"$match":{"user_key":user_key}},
            {"$sortByCount":"$market"},
            {"$limit":number_of_stores}
        ])

        list_of_favorite_stores = []
        for store in cursor:
            list_of_favorite_stores.append(store.get('_id'))

        return list_of_favorite_stores


    def insert_receipt(self, user_key, receipt):
        collection = self.get_collection()
        result = collection.insert_one(receipt)
        status = result.acknowledged
        if status:
            self.logger.print_info_message(
                "receiptRepository | insert new receipt to user: " + str(user_key))
        else:
            self.logger.print_severe_message(
                "receiptRepository | failed insert receipt to user: " + user_key)
        return str(status)
    def get_by_date(self, user_key, from_date, to_date):
        collection = self.get_collection()
        start = datetime.strptime(from_date, '%d/%m/%Y')
        end = datetime.strptime(to_date, '%d/%m/%Y')
        cursor = collection.find({
        "date_of_receipt": {
            "$gte": start,
            "$lt": end
        }, "user_key": user_key})
        receipt_list = {}
        for record in cursor:
            receipt_list[record['_id']] = record
        return receipt_list

    # function generic search
    def get_values_by_key(self, user_key, key):
        values_map = {}
        i = 0
        for value in self.get_collection().distinct(key, {"user_key": user_key}):
            values_map[i] = value
            i += 1
        return values_map

    # function generic search
    def get_receipt_by_value(self, user_key, key, value):
        cursor = self.get_collection().find({key: value, "user_key": user_key})
        receipt_list = {}
        for record in cursor:
            receipt_list[record['_id']] = record
        return receipt_list

    def get_all_receipts_user(self, user_key):
        collection = self.get_collection()
        cursor_sort = collection.find({"user_key": user_key}).sort("date_of_receipt", 1)

        receipt_list = {}
        for record in cursor_sort:
            receipt_list[record['_id']] = record
        return receipt_list

    def get_receipt_by_name(self, user_key, name_search):
        list_of_names = self.get_values_by_key(user_key, "name_for_client")
        receipt_list = {}
        for name in list_of_names.values():
            if name.__contains__(name_search):
                #add all receipt that contains this name
                receipt_list.update(self.get_receipt_by_value(user_key, "name_for_client", name))
        return receipt_list

    def update_receipt(self, user_key, _id, request):
        dict_update_receipt = {}
        for item in request:
            dict_update_receipt[item] = request[item]

        dict_update_receipt.pop('_id')
        dict_update_receipt.pop('user_key')
        return self.update_receipt_data_impl(user_key, _id, dict_update_receipt)

    def update_receipt_data_impl(self, user_key, _id, dict_update_receipt):
        result = self.get_collection().update({'user_key': user_key,'_id': _id}, {'$set': dict_update_receipt})
        is_updated_existing = result['updatedExisting']
        if is_updated_existing:
            self.logger.print_info_message(
                "receiptRepository | details (" + str(dict_update_receipt.keys()) + ") of receeipt: " + str(
                    _id) + " updated in data base")
        else:
            self.logger.print_severe_message(
                "receiptRepository | failed update data of receipt: " + _id)

        return str(is_updated_existing)


    def delete_receipt(self, user_key, receipt_id):
        result = self.get_collection().delete_one({'_id': receipt_id, 'user_key': user_key})
        status = result.acknowledged
        if status:
            self.logger.print_event("receiptRepository | receipt: " + receipt_id + " deleted from data base")
        else:
            self.logger.print_severe_message("receiptRepository | delete receipt from Data Base Failed. user key: " + user_key)
        return "receipt deleted from data base"


    def get_distinct_values_by_key(self, key):
        return self.get_collection().distinct(key)
