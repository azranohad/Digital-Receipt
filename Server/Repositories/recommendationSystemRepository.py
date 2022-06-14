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
        num_of_receipt = len(receipts)
        i = 1
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
            print(market + ": " + str(i) + '/' + str(num_of_receipt))
            i += 1

        self.logger.print_info_message("recommendationSystemRepository | export all items from market - " + market + " - FINALLY")



    # function generic search
    def get_receipt_by_value(self, key, value):
        collection = self.mongoDb_repository.get_client()["Receipts"]['receipts']
        cursor = collection.find({key: value, 'is_digital_receipt': True})
        receipt_list = {}
        for record in cursor:
            receipt_list[record['_id']] = record
        return receipt_list




rec = recommendationSystemRepository()
rec.get_all_receipt_by_market('super-pharm')
rec.get_all_receipt_by_market('walmart')