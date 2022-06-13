import csv
import os

from Server.Repositories.mongoDbRepository import mongoDbRepository
from datetime import datetime
# @singleton
from Server.Repositories.userRepository import userRepository
from SystemFiles.logger.loggerService import loggerService


class recommendationSystemRepository:
    def __init__(self):
        self.mongoDb_repository = mongoDbRepository()
        self.user_repository = userRepository()
        self.logger = loggerService()

    def get_user_data(self, user_maps, user_key):
        if user_key in user_maps:
            return user_maps.get(user_key)
        return self.user_repository.get_user_data(user_key)

    def get_all_receipt_by_market(self, market):
        self.logger.print_info_message("recommendationSystemRepository | export all items from market - " + market + " - START")
        current_path = os.getcwd()
        path = current_path[:current_path.find("Digital-Receipt") + 16] + "RecommendationSystem\itemsDataFromDB\\"
        header_info = ['user_key', 'age', 'gender', 'date', 'itemID', 'itemDescription', 'brand', 'category', 'amount', 'price']
        file = open(path + str(datetime.now().strftime('%d_%m_%Y')) + '_' + market + '_items_data.csv', 'w', newline='', encoding = "ISO-8859-8", errors="ignore")
        writer = csv.DictWriter(file, fieldnames=header_info)
        writer.writeheader()


        receipts = self.get_receipt_by_value('market', market)
        user_maps = {}

        for receipt in receipts.values():
            item_list_to_return = []
            user_key = receipt.get('user_key')
            if user_key in user_maps:
                user_data = user_maps.get(user_key)
            else:
                user_data = self.user_repository.get_user_data(user_key)
                user_maps[user_key] = user_data

            common_data_for_recommendation_system = {
                'user_key': user_key,
                'age': user_data.get('age'),
                'gender': user_data.get('gender'),
                'date': receipt.get('date_of_receipt')
            }
            for item in receipt.get('items'):
                item_for_rec_system = dict(common_data_for_recommendation_system)
                item_for_rec_system.update(item)
                item_list_to_return.append(item_for_rec_system)
            writer.writerows(item_list_to_return)
            y = 4
        x = 3

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

    # function generic search, return distinct values per user
    def get_values_by_key(self, user_key, key):
        coll_db = self.mongoDb_repository.get_client()["Receipts"]['receipts']
        values_map = {}
        i = 0
        for value in coll_db.distinct(key, {"user_key": user_key}):
            values_map[i] = value
            i += 1
        return values_map

    # function generic search
    def get_receipt_by_value(self, key, value):
        collection = self.mongoDb_repository.get_client()["Receipts"]['receipts']
        cursor = collection.find({key: value, 'is_digital_receipt': True})
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


rec = recommendationSystemRepository()
rec.get_all_receipt_by_market('super-pharm')