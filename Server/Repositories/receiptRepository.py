from Server.Repositories.mongoDbRepository import mongoDbRepository
from datetime import datetime

# @singleton
from SystemFiles.logger.loggerService import loggerService


class receiptRepository:
    def __init__(self):
        self.mongoDb_repository = mongoDbRepository()
        self.logger = loggerService()


    def insert_receipt(self, user_key, receipt):
        collection = self.mongoDb_repository.get_client()["Receipts"]['receipts']
        result = collection.insert_one(receipt)
        if result.acknowledged:
            self.logger.print_info_message(
                "receiptRepository | insert new receipt to user: " + str(user_key))
        else:
            self.logger.print_severe_message(
                "receiptRepository | failed insert receipt to user: " + user_key)

    def get_by_date(self, user_key, from_date, to_date):
        collection = self.mongoDb_repository.get_client()["Receipts"]['receipts']
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
        coll_db = self.mongoDb_repository.get_client()["Receipts"]['receipts']
        values_map = {}
        i = 0
        for value in coll_db.distinct(key, {"user_key": user_key}):
            values_map[i] = value
            i += 1
        return values_map

    # function generic search
    def get_receipt_by_value(self, user_key, key, value):
        collection = self.mongoDb_repository.get_client()["Receipts"]['receipts']
        cursor = collection.find({key: value, "user_key": user_key})
        receipt_list = {}
        for record in cursor:
            receipt_list[record['_id']] = record
        return receipt_list

    def get_all_receipts_user(self, user_key):
        collection = self.mongoDb_repository.get_client()["Receipts"]['receipts']
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