from singleton_decorator import singleton
from Repositories.mongoDbRepository import mongoDbRepository
from datetime import datetime
# import datetime

@singleton
class receiptRepository:
    def __init__(self):
        self.mongoDb_repository = mongoDbRepository()


    def get_by_date(self, user_details, from_date, to_date):
        collection = self.mongoDb_repository.get_client()[user_details]["scan_receipt"]
        start = datetime.strptime(from_date, '%d/%m/%Y')
        end = datetime.strptime(to_date, '%d/%m/%Y')
        cursor = collection.find({
        "scan_date": {
            "$gte": start,
            "$lt": end
        }})
        receipt_list = {}
        for record in cursor:
            receipt_list[record['_id']] = record
        return receipt_list


    def get_values_by_key(self, user_details, key):
        coll_db = self.mongoDb_repository.get_client()[user_details]["scan_receipt"]
        values_map = {}
        i = 0
        for market in coll_db.distinct(key):
            values_map[i] = market
            i += 1
        return values_map

    def get_receipt_by_value(self, user_details, key, value):
        collection = self.mongoDb_repository.get_client()[user_details]["scan_receipt"]
        cursor = collection.find({key: value})
        receipt_list = {}
        for record in cursor:
            receipt_list[record['_id']] = record
        return receipt_list

    def get_receipt_by_name(self, user_details, name_search):
        list_of_names = self.get_values_by_key(user_details, "name_for_client")
        receipt_list = {}
        for name in list_of_names.values():
            if name.__contains__(name_search):
                #add all receipt with this name
                receipt_list.update(self.get_receipt_by_value(user_details, "name_for_client", name))
        return receipt_list